export interface CompraItem {
  id?: number;
  compra_id?: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
}

export interface Compra {
  id?: number;
  usuario_id: number;
  forma_pagamento: string;
  endereco: string;
  total: number;
  itens: CompraItem[];
}