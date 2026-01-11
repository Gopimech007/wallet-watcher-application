# Gopi Finance Tracker

A simple, beautiful personal finance web app for tracking your monthly budget, EMIs, savings, and loans across multiple months.

## 🚀 Quick Start

1. Open `index.html` in your web browser
2. Start tracking your finances immediately
3. All data saves automatically in your browser

## ✨ Features

### 📊 Dashboard
- View all your financial metrics at a glance
- Monthly salary, EMIs, expenses, savings, and balance
- Compare with previous month automatically
- Color-coded balance (green = positive, red = negative)

### 💰 Monthly Budget
- Track income and expenses by category
- **Planned vs Actual** amounts for each category
- Auto-calculated differences
- Categories included:
  - Income (Salary)
  - EMIs (Home Loan, Car Loan, LIC Loan)
  - Living Expenses (Provisions, Bills, Petrol, etc.)
  - Family & Projects
  - Savings & Funds

### 📅 Annual Events Planner
- Track yearly expenses (birthdays, insurance, festivals)
- Mark events as paid/unpaid
- Pre-filled with common events:
  - Kid Birthday, School Fees, Insurance
  - Temple Festival, Diwali, Pongal
  - And more...

### 🏦 Loan Tracker
- Manage all your loans in one place
- Track: Total amount, Interest %, EMI, Current balance
- Pre-filled with 3 loans:
  - Home Loan: ₹32,00,000
  - Car Loan: ₹12,50,000
  - LIC Consolidation Loan: ₹28,00,000

### 🗓️ Multi-Month Tracking
- **Switch between any month/year** using dropdown selectors
- Each month's data is saved independently
- View historical data anytime
- Never lose past month's information

### 📈 Compare Months
- Select any two months to compare
- See total expense differences
- Understand spending patterns

### 📉 Trends
- View last 12 months of expenses
- Track spending trends over time
- See EMI and savings patterns

## 💾 Data Storage

- All data stored in your browser's localStorage
- Data persists even after closing the browser
- Each month stored separately: `"2026-01"`, `"2026-02"`, etc.
- Export to CSV anytime for backup

## 🎯 How to Use

### Basic Workflow

**Step 1: View Current Month**
- App opens to current month (e.g., January 2026)
- See your dashboard with all totals

**Step 2: Update Expenses**
- Go to "Monthly Budget" page
- Edit "Actual" amounts as you spend money
- Data saves automatically as you type

**Step 3: Track Progress**
- Dashboard shows remaining balance
- See difference from planned amounts
- Compare with previous month

**Step 4: Next Month**
- Click "Create New Month" button
- Start fresh with new month
- Previous month data is preserved

### Month Selector

At the top of every page:
- **Month dropdown**: Select January - December
- **Year dropdown**: Select year (2024-2031)
- **Current Month button**: Jump back to today's month

### Buttons Explained

- **Save Budget/Annual/Loans**: Confirms your changes (auto-saves anyway)
- **Reset Month**: Reset current month to default values
- **Archive Month**: Lock month to prevent accidental edits
- **Create New Month**: Create next month from template
- **Export CSV**: Download current month's data
- **Add Event/Loan**: Add new row to tables

## 📱 Mobile Friendly

- Works on phones, tablets, and desktops
- Touch-friendly controls
- Responsive design adapts to screen size
- Use menu toggle (☰) on mobile

## 🎨 Default Values

The app comes pre-filled with your data:

**Income:**
- Salary: ₹2,07,000

**EMIs:**
- Home Loan: ₹29,100
- Car Loan: ₹20,000
- LIC Consolidation Loan: ₹58,500

**Living Expenses:**
- Provisions & Vegetables: ₹7,500
- Daily Expenses: ₹4,000
- EB/Gas/Internet/Phone/DTH: ₹7,000
- Petrol/Travel: ₹7,500
- Weekend Expenses: ₹7,000
- Office Commute: ₹5,000

**Family & Projects:**
- Grandpa + Agriculture: ₹15,000
- Wife Business: ₹10,000
- YouTube: ₹5,000

**Savings/Funds:**
- PPF: ₹5,000
- SIP: ₹3,000
- Annual Expenses Fund: ₹15,000
- Emergency Fund: ₹5,000
- Fun/Travel Fund: ₹5,000

**Total Monthly Expense:** ₹1,45,100  
**Balance:** ₹61,900

## 💡 Tips

1. **Update regularly**: Edit "Actual" amounts as you spend
2. **Export monthly**: Download CSV backup at month-end
3. **Compare months**: Use Compare page to track improvements
4. **Check trends**: View 12-month trends to see patterns
5. **Archive completed months**: Prevent accidental changes

## 🔧 Technical Info

- **No installation required** - Just open HTML file
- **No internet needed** - Works completely offline
- **No backend/database** - Pure frontend app
- **Browser storage** - Uses localStorage API
- **Modern browsers** - Chrome, Firefox, Safari, Edge

## ⚠️ Important Notes

- Data is stored in your browser only
- Clearing browser data will delete your finance data
- Export CSV regularly as backup
- Each browser stores data separately
- Private/Incognito mode may not save data

## 🆕 Upgrading from Old Version

If you used the old single-month version:
- Your data automatically migrates to current month
- No action needed from you
- All data is preserved

## 📊 Example Monthly Routine

**Week 1:**
- Update grocery expenses
- Update petrol costs
- Check balance

**Week 2:**
- Pay EMIs, update if needed
- Update weekend expenses

**Week 3:**
- Update family expenses
- Add any new expenses

**Week 4:**
- Review total spending
- Compare with previous month
- Export CSV for records

**Start of New Month:**
- Click "Create New Month"
- Previous month data saved
- Start tracking new month

## 🎯 Pages Overview

1. **Dashboard** - Overview of all finances
2. **Monthly Budget** - Detailed income/expense tracking
3. **Annual Planner** - Yearly events and expenses
4. **Loan Tracker** - Manage all loans
5. **Compare Months** - Compare any two months
6. **Trends** - View 12-month expense trends

## ❓ FAQ

**Q: Where is my data stored?**  
A: In your browser's localStorage. It's private and local to your computer.

**Q: Can I access from multiple devices?**  
A: No, data is stored per browser. Export CSV to transfer data.

**Q: What if I clear browser data?**  
A: Your finance data will be deleted. Always export CSV backups.

**Q: Can I track multiple years?**  
A: Yes! The app supports unlimited months and years.

**Q: How do I backup my data?**  
A: Click "Export CSV" button to download your data.

**Q: Can I edit past months?**  
A: Yes, use month selector to switch to any past month.

---

**Built with ❤️ for smart money management**

Simple. Beautiful. Powerful. 💰
