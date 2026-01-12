// Default budget data template
const defaultBudgetTemplate = {
    income: [
        { category: 'Salary', planned: 207000, actual: 207000, notes: '' }
    ],
    emi: [
        { category: 'Home Loan', planned: 29100, actual: 29100, notes: '' },
        { category: 'Car Loan', planned: 20000, actual: 20000, notes: '' },
        { category: 'LIC Consolidation Loan', planned: 58500, actual: 58500, notes: '' }
    ],
    living: [
        { category: 'Provisions & Vegetables', planned: 7500, actual: 7500, notes: '' },
        { category: 'Daily Expenses', planned: 4000, actual: 4000, notes: '' },
        { category: 'EB/Gas/Internet/Phone/DTH', planned: 7000, actual: 7000, notes: '' },
        { category: 'Petrol/Travel', planned: 7500, actual: 7500, notes: '' },
        { category: 'Weekend Expenses', planned: 7000, actual: 7000, notes: '' },
        { category: 'Office Commute', planned: 5000, actual: 5000, notes: '' }
    ],
    family: [
        { category: 'Grandpa + Agriculture', planned: 15000, actual: 15000, notes: '' },
        { category: 'Wife Business', planned: 10000, actual: 10000, notes: '' },
        { category: 'YouTube', planned: 5000, actual: 5000, notes: '' }
    ],
    savings: [
        { category: 'PPF', planned: 5000, actual: 5000, notes: '' },
        { category: 'SIP', planned: 3000, actual: 3000, notes: '' },
        { category: 'Annual Expenses Fund', planned: 15000, actual: 15000, notes: '' },
        { category: 'Emergency Fund', planned: 5000, actual: 5000, notes: '' },
        { category: 'Fun / Travel Fund', planned: 5000, actual: 5000, notes: '' }
    ]
};

const defaultAnnualEvents = [
    { month: 'April', event: 'Kid Birthday', amount: 10000, paid: false, notes: '' },
    { month: 'May', event: 'School Fees', amount: 70000, paid: false, notes: '' },
    { month: 'May', event: 'Term Insurance', amount: 25000, paid: false, notes: '' },
    { month: 'October', event: 'Temple Festival', amount: 30000, paid: false, notes: '' },
    { month: 'October/November', event: 'Diwali', amount: 15000, paid: false, notes: '' },
    { month: 'November', event: 'Term Insurance', amount: 25000, paid: false, notes: '' },
    { month: 'January', event: 'Pongal + Anniversary + Birthdays', amount: 35000, paid: false, notes: '' },
    { month: 'Any', event: 'Health Insurance', amount: 25000, paid: false, notes: '' }
];

const defaultLoans = [
    { name: 'Home Loan', total: 3200000, interest: 9, emi: 29100, balance: 3200000, targetYear: '' },
    { name: 'Car Loan', total: 1250000, interest: 9, emi: 20000, balance: 1250000, targetYear: '' },
    { name: 'LIC Consolidation Loan', total: 2800000, interest: 9, emi: 58500, balance: 2800000, targetYear: '' }
];

// Global state
let currentMonthKey = '';
let hasUnsavedChanges = false;

// Initialize app
// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    try {
        migrateOldData();
        initializeCurrentMonth();
        setupNavigation();
        setupEventListeners();
        renderMonthSelector();
        loadCurrentMonth();
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('Error loading application data. Please refresh.', 'error');
    }
});

// Month key format: "YYYY-MM"
function getCurrentMonthKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

function initializeCurrentMonth() {
    currentMonthKey = getCurrentMonthKey();
}

// Migrate old single-month data to new structure
function migrateOldData() {
    const oldBudget = localStorage.getItem('budgetData');
    const oldAnnual = localStorage.getItem('annualEvents');
    const oldLoans = localStorage.getItem('loans');

    if (oldBudget && !localStorage.getItem('financeData')) {
        const monthKey = getCurrentMonthKey();
        const financeData = {};
        financeData[monthKey] = {
            budget: JSON.parse(oldBudget),
            annualEvents: oldAnnual ? JSON.parse(oldAnnual) : defaultAnnualEvents,
            loans: oldLoans ? JSON.parse(oldLoans) : defaultLoans,
            archived: false
        };
        localStorage.setItem('financeData', JSON.stringify(financeData));

        // Clean up old keys
        localStorage.removeItem('budgetData');
        localStorage.removeItem('annualEvents');
        localStorage.removeItem('loans');
    }
}

// Data management
function getAllFinanceData() {
    const data = localStorage.getItem('financeData');
    return data ? JSON.parse(data) : {};
}

function saveAllFinanceData(data) {
    localStorage.setItem('financeData', JSON.stringify(data));
    hasUnsavedChanges = false;
}

function getMonthData(monthKey) {
    const allData = getAllFinanceData();
    if (!allData[monthKey]) {
        // Create new month from template
        allData[monthKey] = {
            budget: JSON.parse(JSON.stringify(defaultBudgetTemplate)),
            annualEvents: JSON.parse(JSON.stringify(defaultAnnualEvents)),
            loans: JSON.parse(JSON.stringify(defaultLoans)),
            archived: false
        };
        saveAllFinanceData(allData);
    }
    return allData[monthKey];
}

function saveMonthData(monthKey, data) {
    const allData = getAllFinanceData();
    allData[monthKey] = data;
    saveAllFinanceData(allData);
}

function getBudgetData() {
    return getMonthData(currentMonthKey).budget;
}

function saveBudgetData(data) {
    const monthData = getMonthData(currentMonthKey);
    monthData.budget = data;
    saveMonthData(currentMonthKey, monthData);
    hasUnsavedChanges = true;
}

function getAnnualEvents() {
    return getMonthData(currentMonthKey).annualEvents;
}

function saveAnnualEvents(events) {
    const monthData = getMonthData(currentMonthKey);
    monthData.annualEvents = events;
    saveMonthData(currentMonthKey, monthData);
    hasUnsavedChanges = true;
}

function getLoans() {
    return getMonthData(currentMonthKey).loans;
}

function saveLoans(loans) {
    const monthData = getMonthData(currentMonthKey);
    monthData.loans = loans;
    saveMonthData(currentMonthKey, monthData);
    hasUnsavedChanges = true;
}

// Month selector
function renderMonthSelector() {
    const header = document.querySelector('.page-header');
    const selectorHTML = `
        <div class="month-selector">
            <div class="month-selector-label">Viewing:</div>
            <select id="monthSelect" class="month-select">
                ${generateMonthOptions()}
            </select>
            <select id="yearSelect" class="year-select">
                ${generateYearOptions()}
            </select>
            <button class="btn btn-secondary btn-sm" id="goToCurrentMonth">Current Month</button>
        </div>
    `;

    const existingSelector = document.querySelector('.month-selector');
    if (existingSelector) {
        existingSelector.remove();
    }

    header.insertAdjacentHTML('afterbegin', selectorHTML);

    const [year, month] = currentMonthKey.split('-');
    document.getElementById('monthSelect').value = month;
    document.getElementById('yearSelect').value = year;

    document.getElementById('monthSelect').addEventListener('change', changeMonth);
    document.getElementById('yearSelect').addEventListener('change', changeMonth);
    document.getElementById('goToCurrentMonth').addEventListener('click', goToCurrentMonth);
}

function generateMonthOptions() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months.map((m, i) => {
        const value = String(i + 1).padStart(2, '0');
        return `<option value="${value}">${m}</option>`;
    }).join('');
}

function generateYearOptions() {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear - 2; y <= currentYear + 5; y++) {
        years.push(`<option value="${y}">${y}</option>`);
    }
    return years.join('');
}

function changeMonth() {
    if (hasUnsavedChanges) {
        if (!confirm('You have unsaved changes. Do you want to switch months anyway?')) {
            const [year, month] = currentMonthKey.split('-');
            document.getElementById('monthSelect').value = month;
            document.getElementById('yearSelect').value = year;
            return;
        }
    }

    const month = document.getElementById('monthSelect').value;
    const year = document.getElementById('yearSelect').value;
    currentMonthKey = `${year}-${month}`;

    loadCurrentMonth();
}

function goToCurrentMonth() {
    currentMonthKey = getCurrentMonthKey();
    const [year, month] = currentMonthKey.split('-');
    document.getElementById('monthSelect').value = month;
    document.getElementById('yearSelect').value = year;
    loadCurrentMonth();
}

function loadCurrentMonth() {
    renderBudgetTable();
    renderAnnualTable();
    renderLoansTable();
    updateDashboard();
    renderCompareMonths();
    renderTrends();
    hasUnsavedChanges = false;
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarClose = document.getElementById('sidebarClose');

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });
    }

    // Close sidebar
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = item.dataset.page;

            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`${targetPage}-page`).classList.add('active');

            // Close mobile menu after navigation
            if (window.innerWidth <= 1024) {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
            }

            if (targetPage === 'compare') {
                renderCompareMonths();
            } else if (targetPage === 'trends') {
                renderTrends();
            }
        });
    });
}

// Event listeners
function setupEventListeners() {
    document.getElementById('saveBudget').addEventListener('click', saveBudget);
    document.getElementById('saveAnnual').addEventListener('click', saveAnnual);
    document.getElementById('saveLoans').addEventListener('click', saveLoansData);
    document.getElementById('addEvent').addEventListener('click', addAnnualEvent);
    document.getElementById('addLoan').addEventListener('click', addLoan);
    document.getElementById('resetMonth').addEventListener('click', resetMonth);
    document.getElementById('exportData').addEventListener('click', exportToCSV);
    document.getElementById('archiveMonth').addEventListener('click', archiveMonth);
    document.getElementById('createNewMonth').addEventListener('click', createNewMonth);
}

// Budget table
function renderBudgetTable() {
    const data = getBudgetData();
    const tbody = document.getElementById('budgetTableBody');
    tbody.innerHTML = '';

    const sections = [
        { title: 'INCOME', key: 'income', data: data.income },
        { title: 'EMI', key: 'emi', data: data.emi },
        { title: 'LIVING EXPENSES', key: 'living', data: data.living },
        { title: 'FAMILY & PROJECTS', key: 'family', data: data.family },
        { title: 'SAVINGS / FUNDS', key: 'savings', data: data.savings }
    ];

    sections.forEach(section => {
        tbody.innerHTML += `
            <tr class="section-header">
                <td colspan="5">${section.title}</td>
            </tr>
        `;

        section.data.forEach((item, index) => {
            const diff = item.actual - item.planned;
            const diffClass = diff >= 0 ? 'difference-positive' : 'difference-negative';
            tbody.innerHTML += `
                <tr>
                    <td>${item.category}</td>
                    <td><input type="number" value="${item.planned}" data-section="${section.key}" data-index="${index}" data-field="planned" class="budget-input"></td>
                    <td><input type="number" value="${item.actual}" data-section="${section.key}" data-index="${index}" data-field="actual" class="budget-input"></td>
                    <td class="${diffClass}">${formatCurrency(diff)}</td>
                    <td><input type="text" value="${item.notes}" data-section="${section.key}" data-index="${index}" data-field="notes" class="budget-input"></td>
                </tr>
            `;
        });

        if (section.key !== 'income') {
            const total = section.data.reduce((sum, item) => sum + item.actual, 0);
            tbody.innerHTML += `
                <tr class="total-row">
                    <td>Total ${section.title}</td>
                    <td></td>
                    <td>${formatCurrency(total)}</td>
                    <td></td>
                    <td></td>
                </tr>
            `;
        }
    });

    const salary = data.income[0].actual;
    const totalEMI = data.emi.reduce((sum, item) => sum + item.actual, 0);
    const totalLiving = data.living.reduce((sum, item) => sum + item.actual, 0);
    const totalFamily = data.family.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = data.savings.reduce((sum, item) => sum + item.actual, 0);
    const totalExpense = totalEMI + totalLiving + totalFamily + totalSavings;
    const balance = salary - totalExpense;

    tbody.innerHTML += `
        <tr class="total-row">
            <td>TOTAL EXPENSES</td>
            <td></td>
            <td>${formatCurrency(totalExpense)}</td>
            <td></td>
            <td></td>
        </tr>
        <tr class="total-row">
            <td>BALANCE</td>
            <td></td>
            <td class="${balance >= 0 ? 'difference-positive' : 'difference-negative'}">${formatCurrency(balance)}</td>
            <td></td>
            <td></td>
        </tr>
    `;

    document.querySelectorAll('.budget-input').forEach(input => {
        input.addEventListener('input', updateBudgetData);
    });
}

function updateBudgetData(e) {
    const section = e.target.dataset.section;
    const index = parseInt(e.target.dataset.index);
    const field = e.target.dataset.field;
    const value = field === 'notes' ? e.target.value : parseFloat(e.target.value) || 0;

    const data = getBudgetData();
    data[section][index][field] = value;
    saveBudgetData(data);

    renderBudgetTable();
    updateDashboard();
}

function saveBudget() {
    showNotification('Budget saved successfully!', 'success');
    hasUnsavedChanges = false;
    updateDashboard();
}

// Annual events
function renderAnnualTable() {
    const events = getAnnualEvents();
    const tbody = document.getElementById('annualTableBody');
    tbody.innerHTML = '';

    events.forEach((event, index) => {
        tbody.innerHTML += `
            <tr>
                <td><input type="text" value="${event.month}" data-index="${index}" data-field="month" class="annual-input"></td>
                <td><input type="text" value="${event.event}" data-index="${index}" data-field="event" class="annual-input"></td>
                <td><input type="number" value="${event.amount}" data-index="${index}" data-field="amount" class="annual-input"></td>
                <td><input type="checkbox" ${event.paid ? 'checked' : ''} data-index="${index}" data-field="paid" class="annual-checkbox"></td>
                <td><input type="text" value="${event.notes}" data-index="${index}" data-field="notes" class="annual-input"></td>
                <td><button class="btn btn-danger" onclick="deleteAnnualEvent(${index})">Delete</button></td>
            </tr>
        `;
    });

    document.querySelectorAll('.annual-input').forEach(input => {
        input.addEventListener('input', updateAnnualData);
    });

    document.querySelectorAll('.annual-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', updateAnnualData);
    });
}

function updateAnnualData(e) {
    const index = parseInt(e.target.dataset.index);
    const field = e.target.dataset.field;
    let value;

    if (field === 'paid') {
        value = e.target.checked;
    } else if (field === 'amount') {
        value = parseFloat(e.target.value) || 0;
    } else {
        value = e.target.value;
    }

    const events = getAnnualEvents();
    events[index][field] = value;
    saveAnnualEvents(events);
}

function addAnnualEvent() {
    const events = getAnnualEvents();
    events.push({ month: '', event: '', amount: 0, paid: false, notes: '' });
    saveAnnualEvents(events);
    renderAnnualTable();
}

function deleteAnnualEvent(index) {
    const events = getAnnualEvents();
    events.splice(index, 1);
    saveAnnualEvents(events);
    renderAnnualTable();
}

function saveAnnual() {
    showNotification('Annual events saved successfully!', 'success');
    hasUnsavedChanges = false;
}

// Loans
function renderLoansTable() {
    const loans = getLoans();
    const tbody = document.getElementById('loansTableBody');
    tbody.innerHTML = '';

    loans.forEach((loan, index) => {
        tbody.innerHTML += `
            <tr>
                <td><input type="text" value="${loan.name}" data-index="${index}" data-field="name" class="loan-input"></td>
                <td><input type="number" value="${loan.total}" data-index="${index}" data-field="total" class="loan-input"></td>
                <td><input type="number" value="${loan.interest}" data-index="${index}" data-field="interest" class="loan-input"></td>
                <td><input type="number" value="${loan.emi}" data-index="${index}" data-field="emi" class="loan-input"></td>
                <td><input type="number" value="${loan.balance}" data-index="${index}" data-field="balance" class="loan-input"></td>
                <td><input type="text" value="${loan.targetYear}" data-index="${index}" data-field="targetYear" class="loan-input"></td>
                <td><button class="btn btn-danger" onclick="deleteLoan(${index})">Delete</button></td>
            </tr>
        `;
    });

    document.querySelectorAll('.loan-input').forEach(input => {
        input.addEventListener('input', updateLoanData);
    });
}

function updateLoanData(e) {
    const index = parseInt(e.target.dataset.index);
    const field = e.target.dataset.field;
    const value = (field === 'name' || field === 'targetYear') ? e.target.value : parseFloat(e.target.value) || 0;

    const loans = getLoans();
    loans[index][field] = value;
    saveLoans(loans);
}

function addLoan() {
    const loans = getLoans();
    loans.push({ name: '', total: 0, interest: 0, emi: 0, balance: 0, targetYear: '' });
    saveLoans(loans);
    renderLoansTable();
}

function deleteLoan(index) {
    const loans = getLoans();
    loans.splice(index, 1);
    saveLoans(loans);
    renderLoansTable();
}

function saveLoansData() {
    showNotification('Loans saved successfully!', 'success');
    hasUnsavedChanges = false;
}

// Dashboard
function updateDashboard() {
    const data = getBudgetData();

    const salary = data.income[0].actual;
    const totalEMI = data.emi.reduce((sum, item) => sum + item.actual, 0);
    const totalLiving = data.living.reduce((sum, item) => sum + item.actual, 0);
    const totalFamily = data.family.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = data.savings.reduce((sum, item) => sum + item.actual, 0);
    const totalExpense = totalEMI + totalLiving + totalFamily + totalSavings;
    const balance = salary - totalExpense;

    document.getElementById('dashSalary').textContent = formatCurrency(salary);
    document.getElementById('dashEMI').textContent = formatCurrency(totalEMI);
    document.getElementById('dashLiving').textContent = formatCurrency(totalLiving);
    document.getElementById('dashFamily').textContent = formatCurrency(totalFamily);
    document.getElementById('dashSavings').textContent = formatCurrency(totalSavings);

    const balanceEl = document.getElementById('dashBalance');
    balanceEl.textContent = formatCurrency(balance);
    balanceEl.classList.remove('positive', 'negative');
    balanceEl.classList.add(balance >= 0 ? 'positive' : 'negative');

    // Previous month comparison
    updatePreviousMonthComparison(totalExpense);
}

function updatePreviousMonthComparison(currentExpense) {
    const prevMonthKey = getPreviousMonthKey(currentMonthKey);
    const allData = getAllFinanceData();

    const comparisonEl = document.getElementById('monthComparison');
    if (!comparisonEl) return;

    if (allData[prevMonthKey]) {
        const prevData = allData[prevMonthKey].budget;
        const prevExpense = calculateTotalExpense(prevData);
        const diff = currentExpense - prevExpense;
        const diffPercent = prevExpense > 0 ? ((diff / prevExpense) * 100).toFixed(1) : 0;

        const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
        const color = diff > 0 ? 'var(--danger)' : diff < 0 ? 'var(--success)' : 'var(--text-muted)';

        comparisonEl.innerHTML = `
            <div style="color: ${color}; font-weight: 600;">
                ${arrow} ${formatCurrency(Math.abs(diff))} (${Math.abs(diffPercent)}%)
                <div style="font-size: 0.75rem; color: var(--text-muted);">vs previous month</div>
            </div>
        `;
    } else {
        comparisonEl.innerHTML = '<div style="color: var(--text-muted);">No previous month data</div>';
    }
}

function calculateTotalExpense(budgetData) {
    const totalEMI = budgetData.emi.reduce((sum, item) => sum + item.actual, 0);
    const totalLiving = budgetData.living.reduce((sum, item) => sum + item.actual, 0);
    const totalFamily = budgetData.family.reduce((sum, item) => sum + item.actual, 0);
    const totalSavings = budgetData.savings.reduce((sum, item) => sum + item.actual, 0);
    return totalEMI + totalLiving + totalFamily + totalSavings;
}

function getPreviousMonthKey(monthKey) {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() - 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Compare months page
function renderCompareMonths() {
    const allData = getAllFinanceData();
    const monthKeys = Object.keys(allData).sort().reverse();

    const monthASelect = document.getElementById('compareMonthA');
    const monthBSelect = document.getElementById('compareMonthB');

    if (!monthASelect || !monthBSelect) return;

    const options = monthKeys.map(key => {
        const [year, month] = key.split('-');
        const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
        return `<option value="${key}">${monthName} ${year}</option>`;
    }).join('');

    monthASelect.innerHTML = options;
    monthBSelect.innerHTML = options;

    if (monthKeys.length > 1) {
        monthBSelect.value = monthKeys[1];
    }
}

function compareMonthsAction() {
    const monthA = document.getElementById('compareMonthA').value;
    const monthB = document.getElementById('compareMonthB').value;

    const allData = getAllFinanceData();
    const dataA = allData[monthA];
    const dataB = allData[monthB];

    if (!dataA || !dataB) {
        showNotification('Please select valid months', 'error');
        return;
    }

    const expenseA = calculateTotalExpense(dataA.budget);
    const expenseB = calculateTotalExpense(dataB.budget);
    const diff = expenseA - expenseB;

    const resultEl = document.getElementById('compareResult');
    resultEl.innerHTML = `
        <div class="comparison-result">
            <h3>Comparison Result</h3>
            <div class="comparison-stats">
                <div class="stat">
                    <label>${formatMonthKey(monthA)} Expense:</label>
                    <span>${formatCurrency(expenseA)}</span>
                </div>
                <div class="stat">
                    <label>${formatMonthKey(monthB)} Expense:</label>
                    <span>${formatCurrency(expenseB)}</span>
                </div>
                <div class="stat">
                    <label>Difference:</label>
                    <span class="${diff >= 0 ? 'text-danger' : 'text-success'}">${formatCurrency(diff)}</span>
                </div>
            </div>
        </div>
    `;
}

// Trends page
function renderTrends() {
    const allData = getAllFinanceData();
    const monthKeys = Object.keys(allData).sort();
    const last12Months = monthKeys.slice(-12);

    const trendsBody = document.getElementById('trendsTableBody');
    if (!trendsBody) return;

    trendsBody.innerHTML = '';

    last12Months.forEach(key => {
        const data = allData[key].budget;
        const totalExpense = calculateTotalExpense(data);
        const totalEMI = data.emi.reduce((sum, item) => sum + item.actual, 0);
        const totalSavings = data.savings.reduce((sum, item) => sum + item.actual, 0);
        const balance = data.income[0].actual - totalExpense;

        trendsBody.innerHTML += `
            <tr>
                <td>${formatMonthKey(key)}</td>
                <td>${formatCurrency(totalExpense)}</td>
                <td>${formatCurrency(totalEMI)}</td>
                <td>${formatCurrency(totalSavings)}</td>
                <td class="${balance >= 0 ? 'difference-positive' : 'difference-negative'}">${formatCurrency(balance)}</td>
            </tr>
        `;
    });
}

// Utility functions
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function formatMonthKey(key) {
    const [year, month] = key.split('-');
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'short' });
    return `${monthName} ${year}`;
}

function resetMonth() {
    if (confirm('Reset current month to default template? This cannot be undone.')) {
        const monthData = {
            budget: JSON.parse(JSON.stringify(defaultBudgetTemplate)),
            annualEvents: JSON.parse(JSON.stringify(defaultAnnualEvents)),
            loans: JSON.parse(JSON.stringify(defaultLoans)),
            archived: false
        };
        saveMonthData(currentMonthKey, monthData);
        loadCurrentMonth();
        showNotification('Month reset to defaults!', 'success');
    }
}

function archiveMonth() {
    const monthData = getMonthData(currentMonthKey);
    monthData.archived = true;
    saveMonthData(currentMonthKey, monthData);
    showNotification('Month archived successfully!', 'success');
}

function createNewMonth() {
    const nextMonthKey = getNextMonthKey(currentMonthKey);
    currentMonthKey = nextMonthKey;

    const [year, month] = nextMonthKey.split('-');
    document.getElementById('monthSelect').value = month;
    document.getElementById('yearSelect').value = year;

    loadCurrentMonth();
    showNotification(`Created new month: ${formatMonthKey(nextMonthKey)}`, 'success');
}

function getNextMonthKey(monthKey) {
    const [year, month] = monthKey.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function exportToCSV() {
    const data = getBudgetData();
    let csv = `Finance Tracker Export - ${formatMonthKey(currentMonthKey)}\n\n`;
    csv += 'Category,Planned,Actual,Difference,Notes\n';

    const sections = ['income', 'emi', 'living', 'family', 'savings'];
    sections.forEach(section => {
        csv += `\n${section.toUpperCase()}\n`;
        data[section].forEach(item => {
            const diff = item.actual - item.planned;
            csv += `"${item.category}",${item.planned},${item.actual},${diff},"${item.notes}"\n`;
        });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-tracker-${currentMonthKey}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    showNotification('Data exported successfully!', 'success');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--gradient-success)' : 'var(--gradient-danger)'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
