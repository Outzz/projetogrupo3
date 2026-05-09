import express from "express";
import "./database/database"; // importa a configuração do banco de dados


import { usuarioController } from "./controllers/UsuarioController";
import { produtoController} from "./controllers/ProdutoController";
import { carrinhoController } from "./controllers/CarrinhoController";
import { compraController } from "./controllers/CompraController";
import { quizController } from "./controllers/QuizController";
import { rotuloController } from "./controllers/RotuloController";
import { suporteController } from "./controllers/SuporteController";

const app = express();
app.use(express.json());

// ─── Usuários ────────────────────────────────────────────────────────────────
app.get("/usuarios", usuarioController.listar);
app.get("/usuarios/:id", usuarioController.buscarPorId);
app.post("/usuarios", usuarioController.criar);
app.put("/usuarios/:id", usuarioController.atualizar);
app.delete("/usuarios/:id", usuarioController.deletar);

// ─── Produtos ────────────────────────────────────────────────────────────────
// GET /produtos?nome=xyz  → busca por nome (opcional)
app.get("/produtos", produtoController.listar);
app.get("/produtos/:id", produtoController.buscarPorId);
app.post("/produtos", produtoController.criar);
app.put("/produtos/:id", produtoController.atualizar);
app.patch("/produtos/:id/estoque", produtoController.atualizarEstoque);
app.delete("/produtos/:id", produtoController.deletar);

// ─── Rótulo / Bula ───────────────────────────────────────────────────────────
app.get("/produtos/:produto_id/rotulo", rotuloController.buscarRotulo);
app.get("/produtos/:produto_id/bula", rotuloController.buscarBula);

// ─── Carrinho ────────────────────────────────────────────────────────────────
app.get("/carrinhos/:usuario_id", carrinhoController.buscarPorUsuario);
app.post("/carrinhos/:usuario_id/itens", carrinhoController.adicionarItem);
app.delete("/carrinhos/:usuario_id/itens/:item_id", carrinhoController.removerItem);
app.delete("/carrinhos/:usuario_id", carrinhoController.limparCarrinho);

// ─── Compras ─────────────────────────────────────────────────────────────────
app.get("/compras", compraController.listar);
app.get("/compras/usuario/:usuario_id", compraController.buscarPorUsuario);
app.post("/compras", compraController.criar);

// ─── Quizzes ─────────────────────────────────────────────────────────────────
app.get("/quizzes", quizController.listar);
app.get("/quizzes/:id", quizController.buscarPorId);
app.post("/quizzes", quizController.criar);
app.put("/quizzes/:id", quizController.atualizar);
app.delete("/quizzes/:id", quizController.deletar);

// ─── Suporte — Mensagens ─────────────────────────────────────────────────────
app.get("/suporte/mensagens", suporteController.listarMensagens);
app.post("/suporte/mensagens", suporteController.enviarMensagem);

// ─── Suporte — FAQ ───────────────────────────────────────────────────────────
app.get("/suporte/faq", suporteController.listarFaq);
app.post("/suporte/faq", suporteController.criarFaq);
app.put("/suporte/faq/:id", suporteController.atualizarFaq);
app.delete("/suporte/faq/:id", suporteController.deletarFaq);

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/", (_req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;