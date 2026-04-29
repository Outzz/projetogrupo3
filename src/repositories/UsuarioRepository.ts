import db from "../database/database";
import { Usuario } from "../models/Usuario";

export const usuarioRepository = {
  buscarTodos(): Usuario[] {
    return db.prepare("SELECT * FROM usuarios").all() as Usuario[];
  },

  buscarPorId(id: number): Usuario | undefined {
    return db.prepare("SELECT * FROM usuarios WHERE id = ?").get(id) as Usuario | undefined;
  },

  buscarPorEmail(email: string): Usuario | undefined {
    return db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email) as Usuario | undefined;
  },

  criar(usuario: Usuario): Usuario {
    const stmt = db.prepare(
      "INSERT INTO usuarios (nome, email, telefone, cpf) VALUES (?, ?, ?, ?)"
    );
    const result = stmt.run(usuario.nome, usuario.email, usuario.telefone, usuario.cpf);
    return { ...usuario, id: result.lastInsertRowid as number };
  },

  atualizar(id: number, usuario: Partial<Usuario>): void {
    db.prepare(
      "UPDATE usuarios SET nome = COALESCE(?, nome), email = COALESCE(?, email), telefone = COALESCE(?, telefone), cpf = COALESCE(?, cpf) WHERE id = ?"
    ).run(usuario.nome, usuario.email, usuario.telefone, usuario.cpf, id);
  },

  deletar(id: number): void {
    db.prepare("DELETE FROM usuarios WHERE id = ?").run(id);
  },
};
