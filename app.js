// Default budget data template
const defaultBudgetTemplate = {
    income: [
        { category: 'Salary', planned: 207000, actual: 0, notes: '' }
    ],
    emi: [
        { category: 'Home Loan', planned: 29100, actual: 0, notes: '' },
        { category: 'Car Loan', planned: 20000, actual: 0, notes: '' },
        { category: 'LIC Consolidation Loan', planned: 58500, actual: 0, notes: '' }
    ],
    living: [
        { category: 'Provisions & Vegetables', planned: 7500, actual: 0, notes: '' },
        { category: 'Daily Expenses', planned: 4000, actual: 0, notes: '' },
        { category: 'EB/Gas/Internet/Phone/DTH', planned: 7000, actual: 0, notes: '' },
        { category: 'Petrol/Travel', planned: 7500, actual: 0, notes: '' },
        { category: 'Weekend Expenses', planned: 7000, actual: 0, notes: '' },
        { category: 'Office Commute', planned: 5000, actual: 0, notes: '' }
    ],
    family: [
        { category: 'Grandpa + Agriculture', planned: 15000, actual: 0, notes: '' },
        { category: 'Wife Business', planned: 10000, actual: 0, notes: '' },
        { category: 'YouTube', planned: 5000, actual: 0, notes: '' }
    ],
    savings: [
        { category: 'PPF', planned: 5000, actual: 0, notes: '' },
        { category: 'SIP', planned: 3000, actual: 0, notes: '' },
        { category: 'Annual Expenses Fund', planned: 15000, actual: 0, notes: '' },
        { category: 'Emergency Fund', planned: 5000, actual: 0, notes: '' },
        { category: 'Fun / Travel Fund', planned: 5000, actual: 0, notes: '' }
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

// Custom Modal Logic
const modal = {
    overlay: document.getElementById('customModal'),
    title: document.getElementById('modalTitle'),
    message: document.getElementById('modalMessage'),
    input: document.getElementById('modalInput'),
    cancelBtn: document.getElementById('modalCancelBtn'),
    confirmBtn: document.getElementById('modalConfirmBtn'),

    close() {
        this.overlay.classList.remove('active');
        // Clear listeners to avoid duplicates
        const newCancel = this.cancelBtn.cloneNode(true);
        const newConfirm = this.confirmBtn.cloneNode(true);
        this.cancelBtn.parentNode.replaceChild(newCancel, this.cancelBtn);
        this.confirmBtn.parentNode.replaceChild(newConfirm, this.confirmBtn);
        // Refresh references
        this.cancelBtn = newCancel;
        this.confirmBtn = newConfirm;
    },

    confirm(title, message, onConfirm) {
        this.title.textContent = title;
        this.message.textContent = message;
        this.input.style.display = 'none';
        this.overlay.classList.add('active');

        this.cancelBtn.addEventListener('click', () => this.close());
        this.confirmBtn.addEventListener('click', () => {
            this.close();
            onConfirm();
        });
    },

    prompt(title, message, onConfirm) {
        this.title.textContent = title;
        this.message.textContent = message;
        this.input.style.display = 'block';
        this.input.value = '';
        this.overlay.classList.add('active');
        this.input.focus();

        this.cancelBtn.addEventListener('click', () => this.close());
        this.confirmBtn.addEventListener('click', () => {
            const val = this.input.value.trim();
            if (val) {
                this.close();
                onConfirm(val);
            }
        });

        // Allow Enter key to confirm
        this.input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const val = this.input.value.trim();
                if (val) {
                    this.close();
                    onConfirm(val);
                }
            }
        };
    }
};


// Ensure section configuration exists (migration for existing data)
// Helper to get defaults
function getDefaultSections() {
    return [
        { title: 'INCOME', key: 'income' },
        { title: 'EMI', key: 'emi' },
        { title: 'LIVING EXPENSES', key: 'living' },
        { title: 'FAMILY & PROJECTS', key: 'family' },
        { title: 'SAVINGS / FUNDS', key: 'savings' }
    ];
}

function getSectionConfig() {
    // This function returns sections from current data
    // It does NOT re-read or write on its own to avoid partial updates
    const data = getBudgetData();
    if (!data._sections) {
        return getDefaultSections();
    }
    return data._sections;
}

function addBudgetRow(sectionKey) {
    const data = getBudgetData();
    if (!data[sectionKey]) data[sectionKey] = [];

    // Create new blank item
    data[sectionKey].push({ category: 'New Item', planned: 0, actual: 0, notes: '' });
    saveBudgetData(data);
    renderBudgetTable();
}

function deleteBudgetRow(sectionKey, index) {
    modal.confirm('Delete Item', 'Are you sure you want to delete this row?', () => {
        const data = getBudgetData();
        if (data[sectionKey] && data[sectionKey].length > index) {
            data[sectionKey].splice(index, 1);
            saveBudgetData(data);
            renderBudgetTable();
        }
    });
}

function addNewSection() {
    modal.prompt('New Category', 'Enter new category name (e.g., Investment):', (title) => {
        const key = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const data = getBudgetData();

        // Check if key already exists in data keys
        if (data[key]) {
            showNotification("Category already exists!", 'error');
            return;
        }

        // Ensure _sections array exists on this instance of data
        if (!data._sections) {
            data._sections = getDefaultSections();
        }

        data[key] = []; // Initialize empty array
        data._sections.push({ title: title.toUpperCase(), key: key });

        saveBudgetData(data);
        renderBudgetTable();
    });
}

function deleteSection(sectionKey) {
    modal.confirm('Delete Category', 'Are you sure you want to delete this entire category? All items in it will be lost.', () => {
        const data = getBudgetData();

        // Delete the data for the section
        delete data[sectionKey];

        // Update the section config
        if (!data._sections) {
            data._sections = getDefaultSections();
        }

        data._sections = data._sections.filter(s => s.key !== sectionKey);

        saveBudgetData(data);
        renderBudgetTable();
    });
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
// Helper to auto-fill actuals from planned
function copySectionPlannedToActual(sectionKey) {
    modal.confirm('Auto-fill', 'Auto-fill Actual values from Planned values for this section?', () => {
        const data = getBudgetData();
        data[sectionKey].forEach(item => {
            item.actual = item.planned;
        });
        saveBudgetData(data);

        // We need to trigger the UI update. updateBudgetData wraps render and dashboard, 
        // but here we modified data directly.
        renderBudgetTable();
        updateDashboard();
        showNotification('Auto-filled actual values for ' + sectionKey, 'success');
    });
}

// Budget table
function renderBudgetTable() {
    const data = getBudgetData();
    const sections = getSectionConfig(); // Use dynamic sections
    const tbody = document.getElementById('budgetTableBody');
    tbody.innerHTML = '';

    sections.forEach(section => {
        // Ensure data array exists for this section key
        if (!data[section.key]) data[section.key] = [];
        const sectionData = data[section.key];

        // Add Auto-fill button for expense sections
        let actionHtml = '';

        // Auto-fill button (not for income)
        if (section.key !== 'income') {
            actionHtml += `
                <button class="btn-icon-xs" onclick="copySectionPlannedToActual('${section.key}')" title="Copy Planned to Actual">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Auto-fill
                </button>
            `;
        }

        // Add Item Button
        actionHtml += `
            <button class="btn-icon-xs" onclick="addBudgetRow('${section.key}')" title="Add Item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add
            </button>
        `;

        // Delete Section Button (only for custom sections or if we want to allow deleting core ones too)
        // Let's allow deleting everything except maybe Income? Or just everything.
        // For safety, let's keep Income hard to delete, but user asked "delete the category".
        if (section.key !== 'income') {
            actionHtml += `
                <button class="btn-icon-xs" onclick="deleteSection('${section.key}')" title="Delete Category" style="color: var(--danger);">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
        }

        tbody.innerHTML += `
            <tr class="section-header">
                <td colspan="5">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${section.title}</span>
                        <div class="section-actions" style="display:flex; gap: 10px;">${actionHtml}</div>
                    </div>
                </td>
            </tr>
        `;

        sectionData.forEach((item, index) => {
            const diff = section.key === 'income' ? item.actual - item.planned : item.planned - item.actual;
            const diffClass = diff >= 0 ? 'difference-positive' : 'difference-negative';

            tbody.innerHTML += `
                <tr>
                    <td><input type="text" value="${item.category}" data-section="${section.key}" data-index="${index}" data-field="category" class="budget-input" style="font-weight:500;"></td>
                    <td class="col-planned"><input type="number" value="${item.planned}" data-section="${section.key}" data-index="${index}" data-field="planned" class="budget-input"></td>
                    <td class="col-actual"><input type="number" value="${item.actual}" data-section="${section.key}" data-index="${index}" data-field="actual" class="budget-input"></td>
                    <td class="${diffClass}">${formatCurrency(diff)}</td>
                    <td style="display:flex; gap:0.5rem;">
                        <input type="text" value="${item.notes}" data-section="${section.key}" data-index="${index}" data-field="notes" class="budget-input">
                        <button class="btn-icon-xs" onclick="deleteBudgetRow('${section.key}', ${index})" title="Delete Row" style="color: var(--danger);">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </td>
                </tr>
            `;
        });

        // Add ID to section total row for easier updates
        if (section.key !== 'income') {
            const total = sectionData.reduce((sum, item) => sum + item.actual, 0);
            tbody.innerHTML += `
                <tr class="total-row" id="total-row-${section.key}">
                    <td>Total ${section.title}</td>
                    <td></td>
                    <td id="total-val-${section.key}">${formatCurrency(total)}</td>
                    <td></td>
                    <td></td>
                </tr>
            `;
        }
    });

    // Add "Add New Category" Button at the bottom of the table
    tbody.innerHTML += `
        <tr>
            <td colspan="5" style="text-align: center; padding: 1.5rem;">
                <button class="btn btn-secondary btn-sm" onclick="addNewSection()">+ Add New Category</button>
            </td>
        </tr>
    `;


    const salary = data.income[0].actual;

    // Calculate total expenses dynamically
    let totalExpense = 0;
    sections.forEach(s => {
        if (s.key !== 'income' && data[s.key]) {
            totalExpense += data[s.key].reduce((sum, i) => sum + i.actual, 0);
        }
    });

    const balance = salary - totalExpense;

    tbody.innerHTML += `
        <tr class="total-row" id="grand-total-row">
            <td>TOTAL EXPENSES</td>
            <td></td>
            <td id="grand-total-val">${formatCurrency(totalExpense)}</td>
            <td></td>
            <td></td>
        </tr>
        <tr class="total-row" id="balance-row">
            <td>BALANCE</td>
            <td></td>
            <td id="balance-val" class="${balance >= 0 ? 'difference-positive' : 'difference-negative'}">${formatCurrency(balance)}</td>
            <td></td>
            <td></td>
        </tr>
    `;

    // Re-attach listeners only to new inputs (if any)
    // But since we are replacing innerHTML, we must re-attach to all.
    // NOTE: This function is only called on INIT or REFRESHe (not on input).
    document.querySelectorAll('.budget-input').forEach(input => {
        // Use 'input' for real-time updates without re-render
        input.addEventListener('input', updateBudgetData);
    });
}

function updateBudgetData(e) {
    const sectionKey = e.target.dataset.section;
    const index = parseInt(e.target.dataset.index);
    const field = e.target.dataset.field;

    // Allow empty string for better typing experience, default to 0 for calculations
    const rawValue = e.target.value;

    // If updating category name (text) vs amounts (number)
    const val = field === 'category' || field === 'notes' ? rawValue : (parseFloat(rawValue) || 0);

    const data = getBudgetData();
    if (!data[sectionKey]) data[sectionKey] = []; // safety

    data[sectionKey][index][field] = val;
    saveBudgetData(data);

    // DOM Updates instead of full re-render
    const row = e.target.closest('tr');

    if (field === 'planned' || field === 'actual') {
        const item = data[sectionKey][index];
        const diff = sectionKey === 'income' ? item.actual - item.planned : item.planned - item.actual;
        const diffCell = row.cells[3]; // Difference is 4th column (index 3)

        diffCell.textContent = formatCurrency(diff);

        // Update class
        diffCell.className = ''; // clear
        diffCell.classList.add(diff >= 0 ? 'difference-positive' : 'difference-negative');

        // Update Section Total
        if (sectionKey !== 'income') {
            const sectionTotal = data[sectionKey].reduce((sum, i) => sum + i.actual, 0);
            const totalCell = document.getElementById(`total-val-${sectionKey}`);
            if (totalCell) totalCell.textContent = formatCurrency(sectionTotal);
        }

        // Update Grand Total & Balance
        const salary = data.income[0].actual;

        let totalExpense = 0;
        const sections = getSectionConfig();
        sections.forEach(s => {
            if (s.key !== 'income' && data[s.key]) {
                totalExpense += data[s.key].reduce((sum, i) => sum + i.actual, 0);
            }
        });

        const balance = salary - totalExpense;

        const grandTotalCell = document.getElementById('grand-total-val');
        if (grandTotalCell) grandTotalCell.textContent = formatCurrency(totalExpense);

        const balanceCell = document.getElementById('balance-val');
        if (balanceCell) {
            balanceCell.textContent = formatCurrency(balance);
            balanceCell.className = balance >= 0 ? 'difference-positive' : 'difference-negative';
        }

        // Update Dashboard cards (salary, emi, etc need live updates too)
        updateDashboard();
    }
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
