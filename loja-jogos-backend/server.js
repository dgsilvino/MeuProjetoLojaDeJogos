require("dotenv").config();

// --- 1. IMPORTAÇÕES ---
// Importamos as ferramentas que instalamos
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// --- 2. CONFIGURAÇÃO DO SERVIDOR ---
const app = express(); // Inicializa o Express
app.use(cors()); // Permite que o front-end acesse esta API
app.use(express.json()); // Permite que o servidor entenda dados em formato JSON enviados do front-end

// --- 3. CONEXÃO COM O BANCO DE DADOS ---
// O ideal é usar um "pool" de conexões para melhor performance
const db = mysql
  .createPool({
    host: "localhost", // O servidor MySQL está na sua máquina
    user: "root", // Seu usuário do MySQL
    password: process.env.DB_PASSWORD,
    database: "loja_de_jogos", // O banco de dados que criamos
  })
  .promise(); // Usamos .promise() para poder usar async/await, que é mais moderno

// --- 4. ROTAS DA API (Nossos "Pedidos ao Garçom") ---

// ROTA PARA BUSCAR TODOS OS JOGOS (READ)
app.get("/api/jogos", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Jogos ORDER BY titulo");
    res.json(rows); // Envia a lista de jogos como resposta
  } catch (error) {
    console.error("Erro ao buscar jogos:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// ROTA PARA ADICIONAR UM NOVO JOGO (CREATE)
app.post("/api/jogos", async (req, res) => {
  // Pegamos os dados do jogo enviados pelo front-end
  const { titulo, genero, plataforma, preco, estoque } = req.body;
  try {
    const sql =
      "INSERT INTO Jogos (titulo, genero, plataforma, preco, estoque) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(sql, [
      titulo,
      genero,
      plataforma,
      preco,
      estoque,
    ]);
    // Retornamos o novo jogo criado, incluindo o ID gerado pelo banco
    res.status(201).json({
      id: result.insertId,
      titulo,
      genero,
      plataforma,
      preco,
      estoque,
    });
  } catch (error) {
    console.error("Erro ao adicionar jogo:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// ROTA PARA DELETAR UM JOGO (DELETE)
app.delete("/api/jogos/:id", async (req, res) => {
  const { id } = req.params; // Pega o ID do jogo da URL
  try {
    // Primeiro, precisamos deletar as referências na tabela Venda_Itens
    await db.query("DELETE FROM Venda_Itens WHERE jogo_id = ?", [id]);
    // Agora podemos deletar o jogo
    await db.query("DELETE FROM Jogos WHERE jogo_id = ?", [id]);
    res.status(204).send(); // 204 significa "sucesso, sem conteúdo para retornar"
  } catch (error) {
    console.error("Erro ao deletar jogo:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// ROTAS PARA CLIENTES (padrão similar ao de jogos)
app.get("/api/clientes", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Clientes ORDER BY nome");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

app.post("/api/clientes", async (req, res) => {
  const { nome, email, endereco } = req.body;
  try {
    const sql = "INSERT INTO Clientes (nome, email, endereco) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [nome, email, endereco]);
    res.status(201).json({ id: result.insertId, nome, email, endereco });
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// ROTA PARA REALIZAR UMA VENDA (Operação Complexa)
app.post("/api/vendas", async (req, res) => {
  const { cliente_id, valor_total, carrinho } = req.body; // carrinho é um array de itens

  // Em um app real, usaríamos "TRANSACTIONS" para garantir que tudo aconteça ou nada aconteça.
  // Para fins de estudo, faremos passo a passo.
  try {
    // 1. Inserir a venda na tabela Vendas
    const vendaSql =
      "INSERT INTO Vendas (cliente_id, valor_total) VALUES (?, ?)";
    const [vendaResult] = await db.query(vendaSql, [cliente_id, valor_total]);
    const novaVendaId = vendaResult.insertId;

    // 2. Inserir cada item do carrinho na tabela Venda_Itens
    for (const item of carrinho) {
      const itemSql =
        "INSERT INTO Venda_Itens (venda_id, jogo_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)";
      await db.query(itemSql, [
        novaVendaId,
        item.id,
        item.quantidade,
        item.preco,
      ]);

      // 3. (Opcional, mas boa prática) Atualizar o estoque
      const estoqueSql =
        "UPDATE Jogos SET estoque = estoque - ? WHERE jogo_id = ?";
      await db.query(estoqueSql, [item.quantidade, item.id]);
    }

    res
      .status(201)
      .json({ message: "Venda realizada com sucesso!", vendaId: novaVendaId });
  } catch (error) {
    console.error("Erro ao realizar venda:", error);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

// --- 5. INICIALIZAÇÃO DO SERVIDOR ---
const PORT = 3001; // A porta onde nosso "garçom" vai esperar por pedidos
app.listen(PORT, () => {
  console.log(`Servidor back-end rodando na porta ${PORT}`);
});
