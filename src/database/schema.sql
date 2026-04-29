CREATE TABLE IF NOT EXISTS usuarios (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT    NOT NULL,
  email     TEXT    NOT NULL UNIQUE,
  telefone  TEXT    NOT NULL,
  cpf       TEXT    NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produtos (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  nome           TEXT    NOT NULL,
  especificacoes TEXT,
  composicao     TEXT,
  preco          REAL    NOT NULL,
  descricao      TEXT,
  estoque        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quizzes (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS carrinhos (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS carrinho_itens (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  carrinho_id    INTEGER NOT NULL,
  produto_id     INTEGER NOT NULL,
  quantidade     INTEGER NOT NULL,
  preco_unitario REAL    NOT NULL,
  FOREIGN KEY (carrinho_id) REFERENCES carrinhos(id),
  FOREIGN KEY (produto_id)  REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS compras (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id      INTEGER NOT NULL,
  forma_pagamento TEXT    NOT NULL,
  endereco        TEXT    NOT NULL,
  total           REAL    NOT NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS compra_itens (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  compra_id      INTEGER NOT NULL,
  produto_id     INTEGER NOT NULL,
  quantidade     INTEGER NOT NULL,
  preco_unitario REAL    NOT NULL,
  subtotal       REAL    NOT NULL,
  FOREIGN KEY (compra_id)  REFERENCES compras(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE IF NOT EXISTS suporte_mensagens (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  mensagem   TEXT NOT NULL,
  criado_em  TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS faq (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  pergunta TEXT NOT NULL,
  resposta TEXT NOT NULL
);