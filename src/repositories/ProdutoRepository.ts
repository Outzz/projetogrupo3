import db from "../database/database";
import { Produto } from "../models/Produto";

export const produtoRepository = {
  buscarTodos(): Produto[] {
    return db.prepare("SELECT * FROM produtos").all() as Produto[];
  },

  buscarPorId(id: number): Produto | undefined {
    return db.prepare("SELECT * FROM produtos WHERE id = ?").get(id) as Produto | undefined;
  },

  buscarPorNome(nome: string): Produto[] {
    return db
      .prepare("SELECT * FROM produtos WHERE nome LIKE ?")
      .all(`%${nome}%`) as Produto[];
  },

  criar(produto: Produto): Produto {
    const stmt = db.prepare(
      "INSERT INTO produtos (nome, especificacoes, composicao, preco, descricao, estoque) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const result = stmt.run(
      produto.nome,
      produto.especificacoes ?? null,
      produto.composicao ?? null,
      produto.preco,
      produto.descricao ?? null,
      produto.estoque
    );
    return { ...produto, id: result.lastInsertRowid as number };
  },

  atualizar(id: number, produto: Partial<Produto>): void {
    db.prepare(
      "UPDATE produtos SET nome = COALESCE(?, nome), especificacoes = COALESCE(?, especificacoes), composicao = COALESCE(?, composicao), preco = COALESCE(?, preco), descricao = COALESCE(?, descricao), estoque = COALESCE(?, estoque) WHERE id = ?"
    ).run(
      produto.nome,
      produto.especificacoes,
      produto.composicao,
      produto.preco,
      produto.descricao,
      produto.estoque,
      id
    );
  },

  atualizarEstoque(id: number, novoEstoque: number): void {
    db.prepare("UPDATE produtos SET estoque = ? WHERE id = ?").run(novoEstoque, id);
  },

  deletar(id: number): void {
    db.prepare("DELETE FROM produtos WHERE id = ?").run(id);
  },
};
