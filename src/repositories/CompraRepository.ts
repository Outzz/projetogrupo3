import db from "../database/database";
import { Compra, CompraItem } from "../models/Compra";

export const compraRepository = {
  buscarTodas(): Compra[] {
    const compras = db.prepare("SELECT * FROM compras").all() as Omit<Compra, "itens">[];
    return compras.map((c) => {
      const itens = db
        .prepare("SELECT * FROM compra_itens WHERE compra_id = ?")
        .all(c.id) as CompraItem[];
      return { ...c, itens };
    });
  },

  buscarPorUsuario(usuario_id: number): Compra[] {
    const compras = db
      .prepare("SELECT * FROM compras WHERE usuario_id = ?")
      .all(usuario_id) as Omit<Compra, "itens">[];
    return compras.map((c) => {
      const itens = db
        .prepare("SELECT * FROM compra_itens WHERE compra_id = ?")
        .all(c.id) as CompraItem[];
      return { ...c, itens };
    });
  },

  criar(compra: Omit<Compra, "id">): Compra {
    const criarCompra = db.transaction((compra: Omit<Compra, "id">) => {
      // Valida estoque e calcula total
      let total = 0;
      const itensComPreco: CompraItem[] = compra.itens.map((item) => {
        const produto = db
          .prepare("SELECT preco, estoque FROM produtos WHERE id = ?")
          .get(item.produto_id) as { preco: number; estoque: number } | undefined;

        if (!produto) throw new Error(`Produto ${item.produto_id} não encontrado`);
        if (produto.estoque < item.quantidade)
          throw new Error(`Estoque insuficiente para produto ${item.produto_id}`);

        const subtotal = produto.preco * item.quantidade;
        total += subtotal;

        return {
          ...item,
          preco_unitario: produto.preco,
          subtotal,
        };
      });

      // Insere a compra
      const compraResult = db
        .prepare(
          "INSERT INTO compras (usuario_id, forma_pagamento, endereco, total) VALUES (?, ?, ?, ?)"
        )
        .run(compra.usuario_id, compra.forma_pagamento, compra.endereco, total);

      const compra_id = compraResult.lastInsertRowid as number;

      // Insere os itens e desconta estoque
      const itensInseridos: CompraItem[] = itensComPreco.map((item) => {
        const itemResult = db
          .prepare(
            "INSERT INTO compra_itens (compra_id, produto_id, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)"
          )
          .run(compra_id, item.produto_id, item.quantidade, item.preco_unitario, item.subtotal);

        db.prepare("UPDATE produtos SET estoque = estoque - ? WHERE id = ?").run(
          item.quantidade,
          item.produto_id
        );

        return { ...item, id: itemResult.lastInsertRowid as number, compra_id };
      });

      return { ...compra, id: compra_id, total, itens: itensInseridos };
    });

    return criarCompra(compra);
  },
};
