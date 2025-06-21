const monthlyChart = document.getElementById("monthly-chart");
const totalIncomeElement = document.getElementById("total-income");
const totalExpenseElement = document.getElementById("total-expense");
const totalBalanceElement = document.getElementById("total-balance");
const balanceAlert = document.getElementById("balance-alert");

const Chart = {
  updateSummaryCards: (transactions) => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "receita") {
        totalIncome += transaction.value;
      } else {
        totalExpense += transaction.value;
      }
    });

    const balance = totalIncome - totalExpense;

    totalIncomeElement.textContent = formatCurrency(totalIncome);
    totalExpenseElement.textContent = formatCurrency(totalExpense);
    totalBalanceElement.textContent = formatCurrency(balance);

    if (balance < 0) {
      balanceAlert.style.display = "flex";
    } else {
      balanceAlert.style.display = "none";
    }
  },

  updateMonthlyChart: (transactions, monthYear) => {
    monthlyChart.innerHTML = "";

    const daysInMonth = new Date(
      parseInt(monthYear.split("-")[0]),
      parseInt(monthYear.split("-")[1]),
      0
    ).getDate();
    const dailyData = {};

    for (let i = 1; i <= daysInMonth; i++) {
      const day = i.toString().padStart(2, "0");
      const dateKey = `${monthYear}-${day}`;
      dailyData[dateKey] = { income: 0, expense: 0 };
    }

    transactions.forEach((transaction) => {
      const date = transaction.date;
      if (date.startsWith(monthYear)) {
        const day = date.split("-")[2];
        if (transaction.type === "receita") {
          dailyData[date].income += transaction.value;
        } else {
          dailyData[date].expense += transaction.value;
        }
      }
    });

    let maxValue = 0;
    Object.values(dailyData).forEach((day) => {
      maxValue = Math.max(maxValue, day.income, day.expense);
    });

    Object.entries(dailyData).forEach(([date, amounts]) => {
      const day = date.split("-")[2];

      const barContainer = document.createElement("div");
      barContainer.className = "chart-bar";

      const incomeBar = document.createElement("div");
      incomeBar.className = "bar bar-income";
      incomeBar.style.height =
        maxValue > 0 ? `${(amounts.income / maxValue) * 100}%` : "0%";
      incomeBar.title = `Receitas: ${formatCurrency(amounts.income)}`;

      const expenseBar = document.createElement("div");
      expenseBar.className = "bar bar-expense";
      expenseBar.style.height =
        maxValue > 0 ? `${(amounts.expense / maxValue) * 100}%` : "0%";
      expenseBar.title = `Despesas: ${formatCurrency(amounts.expense)}`;

      const label = document.createElement("div");
      label.className = "chart-label";
      label.textContent = day;

      barContainer.appendChild(incomeBar);
      barContainer.appendChild(expenseBar);
      barContainer.appendChild(label);

      monthlyChart.appendChild(barContainer);
    });
  },
};
