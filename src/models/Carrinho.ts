export interface CarrinhoItem {
  id?: number;
  carrinho_id?: number;
  produto_id: number;
  quantidade: number;
  preco_unitario?: number;
}

export interface Carrinho {
  id?: number;
  usuario_id: number;
  itens: CarrinhoItem[];
}