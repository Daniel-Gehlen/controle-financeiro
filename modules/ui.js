const transactionForm = document.getElementById("transaction-form");
const transactionModal = document.getElementById("transaction-modal");
const addTransactionBtn = document.getElementById("add-transaction-btn");
const cancelTransactionBtn = document.getElementById("cancel-transaction-btn");
const exportBtn = document.getElementById("export-btn");
const modalTitle = document.getElementById("modal-title");

const UI = {
  init: () => {
    apiCategorias.getAll();

    addTransactionBtn.addEventListener("click", () =>
      UI.openTransactionModal()
    );
    cancelTransactionBtn.addEventListener("click", () =>
      UI.closeTransactionModal()
    );
    transactionForm.addEventListener("submit", UI.handleTransactionSubmit);

    filterYear.addEventListener("change", updateUI);
    filterMonth.addEventListener("change", updateUI);
    filterCategory.addEventListener("change", updateUI);
    filterType.addEventListener("change", updateUI);

    exportBtn.addEventListener("click", UI.exportData);

    initializeYearFilter();
    updateCategoryFilter();

    const currentDate = new Date();
    filterMonth.value = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");

    updateUI();
  },

  openTransactionModal: (transactionId = null) => {
    if (transactionId) {
      const transaction = apiTransacoes.getById(transactionId);
      if (transaction) {
        document.getElementById("transaction-id").value = transaction.id;
        document.getElementById("transaction-description").value =
          transaction.description;
        document.getElementById("transaction-value").value = transaction.value;
        document.getElementById("transaction-date").value = transaction.date;
        document.getElementById("transaction-type").value = transaction.type;
        modalTitle.textContent = "Editar Transação";
      }
    } else {
      document.getElementById("transaction-id").value = "";
      document.getElementById("transaction-description").value = "";
      document.getElementById("transaction-value").value = "";
      document.getElementById("transaction-date").value = new Date()
        .toISOString()
        .split("T")[0];
      document.getElementById("transaction-type").value = "receita";
      modalTitle.textContent = "Nova Transação";
    }

    const categorySelect = document.getElementById("transaction-category");
    categorySelect.innerHTML = "";
    const categories = apiCategorias.getAll();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });

    if (transactionId) {
      const transaction = apiTransacoes.getById(transactionId);
      if (transaction) {
        categorySelect.value = transaction.category;
      }
    }

    transactionModal.style.display = "flex";
  },

  closeTransactionModal: () => {
    transactionModal.style.display = "none";
    transactionForm.reset();
  },

  handleTransactionSubmit: (e) => {
    e.preventDefault();

    const id = document.getElementById("transaction-id").value;
    const description = document.getElementById(
      "transaction-description"
    ).value;
    const value = parseFloat(
      document.getElementById("transaction-value").value
    );
    const date = document.getElementById("transaction-date").value;
    const category = document.getElementById("transaction-category").value;
    const type = document.getElementById("transaction-type").value;

    const transaction = {
      description,
      value,
      date,
      category,
      type,
    };

    if (id) {
      apiTransacoes.update(id, transaction);
    } else {
      apiTransacoes.create(transaction);
    }

    UI.closeTransactionModal();
    updateUI();
  },

  exportData: () => {
    const transactions = apiTransacoes.getAll();
    const categories = apiCategorias.getAll();

    const data = {
      transactions,
      categories,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `controle-financeiro-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
