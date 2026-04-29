import db from "../database/database";
import { Faq, SuporteMensagem } from "../models/Suporte";

export const suporteRepository = {
  // ─── Mensagens ──────────────────────────────────────────────────────────────
  buscarMensagens(): SuporteMensagem[] {
    return db.prepare("SELECT * FROM suporte_mensagens ORDER BY criado_em DESC").all() as SuporteMensagem[];
  },

  enviarMensagem(msg: SuporteMensagem): SuporteMensagem {
    const result = db
      .prepare(
        "INSERT INTO suporte_mensagens (usuario_id, mensagem) VALUES (?, ?)"
      )
      .run(msg.usuario_id ?? null, msg.mensagem);
    return { ...msg, id: result.lastInsertRowid as number };
  },

  // ─── FAQ ────────────────────────────────────────────────────────────────────
  buscarFaq(): Faq[] {
    return db.prepare("SELECT * FROM faq").all() as Faq[];
  },

  criarFaq(faq: Faq): Faq {
    const result = db
      .prepare("INSERT INTO faq (pergunta, resposta) VALUES (?, ?)")
      .run(faq.pergunta, faq.resposta);
    return { ...faq, id: result.lastInsertRowid as number };
  },

  atualizarFaq(id: number, faq: Partial<Faq>): void {
    db.prepare(
      "UPDATE faq SET pergunta = COALESCE(?, pergunta), resposta = COALESCE(?, resposta) WHERE id = ?"
    ).run(faq.pergunta, faq.resposta, id);
  },

  deletarFaq(id: number): void {
    db.prepare("DELETE FROM faq WHERE id = ?").run(id);
  },
};
