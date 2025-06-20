-- Qual o nome do cliente e quais jogos ele comprou na venda de ID 1?
SELECT
    c.nome AS Nome_Cliente,
    j.titulo AS Jogo_Comprado,
    vi.quantidade AS Quantidade
FROM Vendas v
JOIN Clientes c ON v.cliente_id = c.cliente_id
JOIN Venda_Itens vi ON v.venda_id = vi.venda_id
JOIN Jogos j ON vi.jogo_id = j.jogo_id
WHERE v.venda_id = 1;