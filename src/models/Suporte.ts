export interface SuporteMensagem {
  id?: number;
  usuario_id?: number;
  mensagem: string;
  criado_em?: string;
}

export interface Faq {
  id?: number;
  pergunta: string;
  resposta: string;
}