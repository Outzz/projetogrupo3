import db from "../database/database";
import { Quiz } from "../models/Quiz";

export const quizRepository = {
  buscarTodos(): Quiz[] {
    return db.prepare("SELECT * FROM quizzes").all() as Quiz[];
  },

  buscarPorId(id: number): Quiz | undefined {
    return db.prepare("SELECT * FROM quizzes WHERE id = ?").get(id) as Quiz | undefined;
  },

  criar(quiz: Quiz): Quiz {
    const result = db
      .prepare("INSERT INTO quizzes (pergunta, resposta) VALUES (?, ?)")
      .run(quiz.pergunta, quiz.resposta);
    return { ...quiz, id: result.lastInsertRowid as number };
  },

  atualizar(id: number, quiz: Partial<Quiz>): void {
    db.prepare(
      "UPDATE quizzes SET pergunta = COALESCE(?, pergunta), resposta = COALESCE(?, resposta) WHERE id = ?"
    ).run(quiz.pergunta, quiz.resposta, id);
  },

  deletar(id: number): void {
    db.prepare("DELETE FROM quizzes WHERE id = ?").run(id);
  },
};
