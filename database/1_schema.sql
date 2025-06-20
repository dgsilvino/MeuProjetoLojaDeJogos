-- Criação do banco de dados (opcional, se ainda não tiver um)
CREATE DATABASE IF NOT EXISTS loja_de_jogos;
USE loja_de_jogos;

-- Tabela Clientes
-- Armazena as informações dos clientes da loja.
CREATE TABLE Clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    endereco VARCHAR(255)
);

-- Tabela Jogos
-- Armazena o catálogo de jogos disponíveis.
CREATE TABLE Jogos (
    jogo_id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    plataforma VARCHAR(50),
    preco DECIMAL(10, 2) NOT NULL,
    estoque INT NOT NULL
);

-- Tabela Vendas
-- Armazena o cabeçalho de cada transação de venda.
CREATE TABLE Vendas (
    venda_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10, 2),
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id)
);

-- Tabela Venda_Itens
-- Tabela de ligação que detalha quais jogos e em que quantidade foram vendidos em cada transação.
CREATE TABLE Venda_Itens (
    venda_item_id INT AUTO_INCREMENT PRIMARY KEY,
    venda_id INT,
    jogo_id INT,
    quantidade INT NOT NULL,
    preco_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES Vendas(venda_id),
    FOREIGN KEY (jogo_id) REFERENCES Jogos(jogo_id)
);

