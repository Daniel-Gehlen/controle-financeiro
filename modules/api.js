const apiTransacoes = {
  getByMonth: (monthYear) => {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    return transactions.filter((t) => t.date.startsWith(monthYear));
  },
  getAll: () => {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  },
  getById: (id) => {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    return transactions.find((t) => t.id === id);
  },
  create: (transaction) => {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transaction.id = Date.now().toString();
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    return transaction;
  },
  update: (id, updatedTransaction) => {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const index = transactions.findIndex((t) => t.id === id);
    if (index !== -1) {
      transactions[index] = { ...updatedTransaction, id };
      localStorage.setItem("transactions", JSON.stringify(transactions));
      return true;
    }
    return false;
  },
  delete: (id) => {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const filtered = transactions.filter((t) => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(filtered));
    return true;
  },
};

const apiCategorias = {
  getAll: () => {
    const categories = JSON.parse(localStorage.getItem("categories"));
    if (!categories || categories.length === 0) {
      const defaultCategories = [
        { id: "1", name: "Salário" },
        { id: "2", name: "Investimentos" },
        { id: "3", name: "Presente" },
        { id: "4", name: "Alimentação" },
        { id: "5", name: "Moradia" },
        { id: "6", name: "Transporte" },
        { id: "7", name: "Lazer" },
        { id: "8", name: "Saúde" },
        { id: "9", name: "Educação" },
        { id: "10", name: "Outros" },
      ];
      localStorage.setItem("categories", JSON.stringify(defaultCategories));
      return defaultCategories;
    }
    return categories;
  },
  create: (category) => {
    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    category.id = Date.now().toString();
    categories.push(category);
    localStorage.setItem("categories", JSON.stringify(categories));
    return category;
  },
};

function formatDate(dateString) {
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
