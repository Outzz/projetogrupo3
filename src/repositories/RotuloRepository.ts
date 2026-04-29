import db from "../database/database";
import { Bula, Rotulo } from "../models/Rotulo";

export const rotuloRepository = {
  buscarPorProduto(produto_id: number): Rotulo | undefined {
    const produto = db
      .prepare("SELECT nome, composicao, descricao FROM produtos WHERE id = ?")
      .get(produto_id) as
      | { nome: string; composicao: string | null; descricao: string | null }
      | undefined;

    if (!produto) return undefined;

    return {
      nome_produto: produto.nome,
      composicao: produto.composicao ?? "",
      // indicação e modo de uso podem ser ampliados com colunas dedicadas futuramente
      indicacao: produto.descricao ?? "",
      modo_de_uso: "",
    };
  },
};

export const bulaRepository = {
  buscarPorProduto(produto_id: number): Bula | undefined {
    const produto = db
      .prepare("SELECT composicao FROM produtos WHERE id = ?")
      .get(produto_id) as { composicao: string | null } | undefined;

    if (!produto) return undefined;

    return {
      produto_id,
      composicao: produto.composicao ?? "",
      modo_de_uso: "",
    };
  },
};
