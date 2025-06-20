-- Inserindo clientes
INSERT INTO Clientes (nome, email, endereco) VALUES
('João Silva', 'joao.silva@email.com', 'Rua das Flores, 123'),
('Maria Oliveira', 'maria.o@email.com', 'Avenida Principal, 456');

-- Inserindo jogos
INSERT INTO Jogos (titulo, genero, plataforma, preco, estoque) VALUES
('Cyberpunk 2077', 'RPG', 'PC', 150.00, 50),
('The Witcher 3', 'RPG', 'PC', 90.50, 100),
('Elden Ring', 'Ação', 'PlayStation 5', 250.00, 30);

-- Simulando uma venda para o cliente João Silva
-- Primeiro, criamos a venda
INSERT INTO Vendas (cliente_id, valor_total) VALUES (1, 490.50); -- O ID da venda será 1

-- Agora, adicionamos os itens a essa venda
-- João comprou 2x Cyberpunk 2077 e 1x The Witcher 3 (2*150 + 1*90.50 + 1*250 = 490.50 ? Não, vamos corrigir o valor total)
-- João comprou 1x Cyberpunk 2077 (150) e 1x The Witcher 3 (90.50). Total: 240.50
UPDATE Vendas SET valor_total = 240.50 WHERE venda_id = 1;

INSERT INTO Venda_Itens (venda_id, jogo_id, quantidade, preco_unitario) VALUES
(1, 1, 1, 150.00), -- 1 Cyberpunk
(1, 2, 1, 90.50); -- 1 The Witcher