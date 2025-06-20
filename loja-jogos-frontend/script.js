document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3001/api";

  // --- ESTADO DA APLICAÇÃO ---
  let gamesList = [];
  let clientesList = [];
  let carrinho = [];

  // --- SELETORES DO DOM ---
  const mainHeaderTitle = document.getElementById("main-title");
  const sections = {
    jogos: document.getElementById("jogos-section"),
    clientes: document.getElementById("clientes-section"),
    vendas: document.getElementById("vendas-section"),
  };
  const navLinks = {
    jogos: document.getElementById("nav-jogos"),
    clientes: document.getElementById("nav-clientes"),
    vendas: document.getElementById("nav-vendas"),
  };

  // Seletores de Jogos
  const addGameForm = document.getElementById("add-game-form");
  const gamesTableBody = document.getElementById("games-table-body");

  // Seletores de Clientes
  const addClientForm = document.getElementById("add-client-form");
  const clientsTableBody = document.getElementById("clients-table-body");

  // Seletores de Vendas
  const salesClientSelect = document.getElementById("sales-client-select");
  const salesGameSelect = document.getElementById("sales-game-select");
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const cartTableBody = document.getElementById("cart-table-body");
  const cartTotalValue = document.getElementById("cart-total-value");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Ícones SVG
  const editIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83L19.5 9.5l1.21-1.21.01-.02.01-.02.02-.01ZM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"/></svg>`;
  const deleteIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/></svg>`;

  // --- FUNÇÕES DE API ---
  const fetchGames = async () => {
    try {
      const response = await fetch(`${API_URL}/jogos`);
      gamesList = await response.json();
      renderGamesTable();
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
    }
  };
  const fetchClientes = async () => {
    try {
      const response = await fetch(`${API_URL}/clientes`);
      clientesList = await response.json();
      renderClientesTable();
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  // --- FUNÇÕES DE RENDERIZAÇÃO ---
  function renderGamesTable() {
    gamesTableBody.innerHTML = "";
    gamesList.forEach((game) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><strong>${game.titulo}</strong></td><td>${
        game.plataforma
      }</td>
                <td>R$ ${parseFloat(game.preco)
                  .toFixed(2)
                  .replace(".", ",")}</td><td>${game.estoque}</td>
                <td class="action-buttons-cell">
                    <button class="icon-button" title="Editar" data-id="${
                      game.jogo_id
                    }">${editIconSVG}</button>
                    <button class="icon-button delete-btn" title="Excluir" data-id="${
                      game.jogo_id
                    }">${deleteIconSVG}</button>
                </td>`;
      gamesTableBody.appendChild(row);
    });
  }

  function renderClientesTable() {
    clientsTableBody.innerHTML = "";
    clientesList.forEach((cliente) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><strong>${cliente.nome}</strong></td><td>${
        cliente.email
      }</td><td>${cliente.endereco || "N/A"}</td>
                <td class="action-buttons-cell">
                    <button class="icon-button" title="Editar" data-id="${
                      cliente.cliente_id
                    }">${editIconSVG}</button>
                    <button class="icon-button delete-btn" title="Excluir" data-id="${
                      cliente.cliente_id
                    }">${deleteIconSVG}</button>
                </td>`;
      clientsTableBody.appendChild(row);
    });
  }

  function renderCarrinhoTable() {
    cartTableBody.innerHTML = "";
    let total = 0;
    carrinho.forEach((item, index) => {
      const subtotal = item.preco * item.quantidade;
      total += subtotal;
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${item.titulo}</td><td>${item.quantidade}</td>
                <td>R$ ${parseFloat(item.preco)
                  .toFixed(2)
                  .replace(".", ",")}</td><td>R$ ${subtotal
        .toFixed(2)
        .replace(".", ",")}</td>
                <td class="action-buttons-cell">
                    <button class="icon-button delete-btn" title="Remover" data-index="${index}">${deleteIconSVG}</button>
                </td>`;
      cartTableBody.appendChild(row);
    });
    cartTotalValue.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
    checkoutBtn.disabled = carrinho.length === 0;
  }

  // --- FUNÇÕES DE PREENCHIMENTO (Populate) ---
  function populateClientesDropdown() {
    salesClientSelect.innerHTML =
      '<option value="">Selecione um Cliente...</option>';
    clientesList.forEach((cliente) => {
      const option = document.createElement("option");
      option.value = cliente.cliente_id;
      option.textContent = cliente.nome;
      salesClientSelect.appendChild(option);
    });
  }

  function populateJogosDropdown() {
    salesGameSelect.innerHTML =
      '<option value="">Selecione um Jogo...</option>';
    gamesList.forEach((game) => {
      const option = document.createElement("option");
      option.value = game.jogo_id;
      option.textContent = `${game.titulo} (Estoque: ${game.estoque})`;
      option.disabled = game.estoque === 0;
      salesGameSelect.appendChild(option);
    });
  }

  // --- LÓGICA DE EVENTOS ---

  // Adicionar Jogo
  addGameForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newGame = {
      titulo: document.getElementById("titulo").value,
      genero: document.getElementById("genero").value,
      plataforma: document.getElementById("plataforma").value,
      preco: parseFloat(document.getElementById("preco").value),
      estoque: parseInt(document.getElementById("estoque").value),
    };
    await fetch(`${API_URL}/jogos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGame),
    });
    addGameForm.reset();
    fetchGames();
  });

  // Adicionar Cliente
  addClientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newClient = {
      nome: document.getElementById("cliente-nome").value,
      email: document.getElementById("cliente-email").value,
      endereco: document.getElementById("cliente-endereco").value,
    };
    await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    });
    addClientForm.reset();
    fetchClientes();
  });

  // Adicionar ao Carrinho
  addToCartBtn.addEventListener("click", () => {
    const gameId = parseInt(salesGameSelect.value);
    const quantidade = parseInt(
      document.getElementById("sales-quantity").value
    );
    if (!gameId || !quantidade) {
      alert("Por favor, selecione um jogo e uma quantidade.");
      return;
    }
    const game = gamesList.find((g) => g.jogo_id === gameId);
    if (quantidade > game.estoque) {
      alert("Quantidade solicitada maior que o estoque disponível.");
      return;
    }
    const itemNoCarrinho = carrinho.find((item) => item.id === gameId);
    if (itemNoCarrinho) {
      itemNoCarrinho.quantidade += quantidade;
    } else {
      carrinho.push({
        id: game.jogo_id,
        titulo: game.titulo,
        quantidade: quantidade,
        preco: game.preco,
      });
    }
    renderCarrinhoTable();
  });

  // Remover do Carrinho
  cartTableBody.addEventListener("click", (e) => {
    const removeButton = e.target.closest(".delete-btn");
    if (removeButton) {
      const itemIndex = parseInt(removeButton.dataset.index);
      carrinho.splice(itemIndex, 1);
      renderCarrinhoTable();
    }
  });

  // Finalizar Venda
  checkoutBtn.addEventListener("click", async () => {
    const cliente_id = parseInt(salesClientSelect.value);
    if (!cliente_id) {
      alert("Por favor, selecione um cliente.");
      return;
    }
    const valor_total = carrinho.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );

    const venda = { cliente_id, valor_total, carrinho };

    try {
      const response = await fetch(`${API_URL}/vendas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });
      if (!response.ok) throw new Error("Erro ao finalizar a venda.");

      alert("Venda realizada com sucesso!");
      carrinho = [];
      renderCarrinhoTable();
      fetchGames(); // Atualiza estoque na aba de jogos
      populateJogosDropdown(); // Atualiza dropdown de jogos
    } catch (error) {
      console.error(error);
      alert("Falha ao realizar a venda.");
    }
  });

  // Navegação Principal
  Object.keys(navLinks).forEach((key) => {
    navLinks[key].addEventListener("click", async (e) => {
      e.preventDefault();
      const titles = {
        jogos: "Gerenciar Jogos",
        clientes: "Gerenciar Clientes",
        vendas: "Realizar Venda",
      };
      showSection(key, titles[key]);

      if (key === "jogos") await fetchGames();
      if (key === "clientes") await fetchClientes();
      if (key === "vendas") {
        await Promise.all([fetchGames(), fetchClientes()]);
        populateClientesDropdown();
        populateJogosDropdown();
      }
    });
  });

  // --- INICIALIZAÇÃO ---
  function showSection(sectionId, title) {
    // Esconde todas as seções de conteúdo
    Object.values(sections).forEach((section) =>
      section.classList.add("hidden")
    );
    // Remove a classe 'active' de TODOS os links de navegação
    Object.values(navLinks).forEach((link) => link.classList.remove("active"));

    // Mostra a seção correta e ativa o link correspondente
    sections[sectionId].classList.remove("hidden");
    navLinks[sectionId].classList.add("active");
    mainHeaderTitle.textContent = title;
  }
  fetchGames(); // Carrega os dados iniciais da primeira aba
});
