import db from "../database/database";
import { Carrinho, CarrinhoItem } from "../models/Carrinho";

export const carrinhoRepository = {
  buscarPorUsuario(usuario_id: number): Carrinho | undefined {
    const carrinho = db
      .prepare("SELECT * FROM carrinhos WHERE usuario_id = ?")
      .get(usuario_id) as { id: number; usuario_id: number } | undefined;

    if (!carrinho) return undefined;

    const itens = db
      .prepare(
        `SELECT ci.*, p.nome as produto_nome, p.preco as preco_atual
         FROM carrinho_itens ci
         JOIN produtos p ON p.id = ci.produto_id
         WHERE ci.carrinho_id = ?`
      )
      .all(carrinho.id) as CarrinhoItem[];

    return { ...carrinho, itens };
  },

  criarOuBuscarCarrinho(usuario_id: number): number {
    const existente = db
      .prepare("SELECT id FROM carrinhos WHERE usuario_id = ?")
      .get(usuario_id) as { id: number } | undefined;

    if (existente) return existente.id;

    const result = db
      .prepare("INSERT INTO carrinhos (usuario_id) VALUES (?)")
      .run(usuario_id);
    return result.lastInsertRowid as number;
  },

  adicionarItem(carrinho_id: number, item: CarrinhoItem): CarrinhoItem {
    const produto = db
      .prepare("SELECT preco FROM produtos WHERE id = ?")
      .get(item.produto_id) as { preco: number } | undefined;

    if (!produto) throw new Error("Produto não encontrado");

    const existente = db
      .prepare(
        "SELECT * FROM carrinho_itens WHERE carrinho_id = ? AND produto_id = ?"
      )
      .get(carrinho_id, item.produto_id) as CarrinhoItem | undefined;

    if (existente) {
      db.prepare(
        "UPDATE carrinho_itens SET quantidade = quantidade + ? WHERE id = ?"
      ).run(item.quantidade, existente.id);
      return { ...existente, quantidade: existente.quantidade + item.quantidade };
    }

    const result = db
      .prepare(
        "INSERT INTO carrinho_itens (carrinho_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)"
      )
      .run(carrinho_id, item.produto_id, item.quantidade, produto.preco);

    return { ...item, id: result.lastInsertRowid as number, preco_unitario: produto.preco };
  },

  removerItem(item_id: number): void {
    db.prepare("DELETE FROM carrinho_itens WHERE id = ?").run(item_id);
  },

  limparCarrinho(carrinho_id: number): void {
    db.prepare("DELETE FROM carrinho_itens WHERE carrinho_id = ?").run(carrinho_id);
  },
};
