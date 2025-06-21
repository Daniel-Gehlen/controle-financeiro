const transactionsTable = document.getElementById('transactions-table').querySelector('tbody');
const filterYear = document.getElementById('filter-year');
const filterMonth = document.getElementById('filter-month');
const filterCategory = document.getElementById('filter-category');
const filterType = document.getElementById('filter-type');

function initializeYearFilter() {
    const transactions = apiTransacoes.getAll();
    const years = new Set();

    const currentYear = new Date().getFullYear();
    years.add(currentYear);

    transactions.forEach(t => {
        const year = t.date.split('-')[0];
        years.add(parseInt(year));
    });

    const sortedYears = Array.from(years).sort((a, b) => b - a);

    filterYear.innerHTML = '';
    sortedYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        filterYear.appendChild(option);
    });

    filterYear.value = currentYear;
}

function updateCategoryFilter() {
    const categories = apiCategorias.getAll();
    filterCategory.innerHTML = '<option value="">Todas</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        filterCategory.appendChild(option);
    });
}

function updateTransactionsTable(transactions) {
    transactionsTable.innerHTML = '';

    if (transactions.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.textContent = 'Nenhuma transação encontrada';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        transactionsTable.appendChild(row);
        return;
    }

    transactions.forEach(transaction => {
        const row = document.createElement('tr');

        const dateCell = document.createElement('td');
        dateCell.textContent = formatDate(transaction.date);

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = transaction.description;

        const categoryCell = document.createElement('td');
        categoryCell.textContent = transaction.category;

        const typeCell = document.createElement('td');
        const typeBadge = document.createElement('span');
        typeBadge.className = `badge ${transaction.type === 'receita' ? 'badge-success' : 'badge-danger'}`;
        typeBadge.textContent = transaction.type === 'receita' ? 'Receita' : 'Despesa';
        typeCell.appendChild(typeBadge);

        const valueCell = document.createElement('td');
        valueCell.textContent = formatCurrency(transaction.value);
        valueCell.style.color = transaction.type === 'receita' ? 'var(--success-color)' : 'var(--danger-color)';
        valueCell.style.fontWeight = 'bold';

        const actionsCell = document.createElement('td');
        actionsCell.style.display = 'flex';
        actionsCell.style.gap = '5px';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-sm btn-warning';
        editBtn.textContent = 'Editar';
        editBtn.addEventListener('click', () => UI.openTransactionModal(transaction.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-sm btn-danger';
        deleteBtn.textContent = 'Excluir';
        deleteBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir esta transação?')) {
                apiTransacoes.delete(transaction.id);
                updateUI();
            }
        });

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);

        row.appendChild(dateCell);
        row.appendChild(descriptionCell);
        row.appendChild(categoryCell);
        row.appendChild(typeCell);
        row.appendChild(valueCell);
        row.appendChild(actionsCell);

        transactionsTable.appendChild(row);
    });
}

function updateUI() {
    const year = filterYear.value;
    const month = filterMonth.value;
    const category = filterCategory.value;
    const type = filterType.value;

    const monthYear = `${year}-${month}`;
    let transactions = apiTransacoes.getByMonth(monthYear);

    if (category) {
        transactions = transactions.filter(t => t.category === category);
    }

    if (type) {
        transactions = transactions.filter(t => t.type === type);
    }

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    updateTransactionsTable(transactions);
    Chart.updateSummaryCards(transactions);
    Chart.updateMonthlyChart(transactions, monthYear);
}
