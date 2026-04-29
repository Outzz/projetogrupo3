export interface Produto {
  id?: number;
  nome: string;
  especificacoes?: string;
  composicao?: string;
  preco: number;
  descricao?: string;
  estoque: number;
}