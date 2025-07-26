# Expense Tracker AI

A modern, professional NextJS expense tracking application that helps users manage their personal finances with an intuitive and clean interface.

## Features

### 📊 Dashboard
- **Summary Cards**: Total expenses, monthly spending, top category, and average spending
- **Visual Analytics**: Category breakdown with progress bars and percentages
- **Recent Expenses**: Quick view of your latest transactions

### 💰 Expense Management
- **Add Expenses**: Form with validation for amount, category, description, and date
- **Edit & Delete**: Full CRUD operations on expense entries
- **Categories**: Food, Transportation, Entertainment, Shopping, Bills, Other

### 🔍 Advanced Filtering & Search
- **Search**: Find expenses by description or category
- **Filter by Category**: View expenses from specific categories
- **Date Range Filtering**: Filter expenses by date range
- **Sorting**: Sort by date, amount, category, or description

### 📱 Responsive Design
- **Desktop**: Full table view with sortable columns
- **Mobile**: Card-based layout optimized for small screens
- **Professional UI**: Clean, modern design with Tailwind CSS

### 💾 Data Persistence
- **localStorage**: All data is saved locally in your browser
- **Export**: Download expenses as CSV files
- **Real-time Updates**: Immediate feedback and state updates

## Technology Stack

- **Frontend**: NextJS 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React icons
- **State Management**: React hooks and localStorage

## Getting Started

### Prerequisites

Make sure you have Node.js (v18 or higher) installed on your system.

### Installation

1. **Navigate** to the project directory:
   ```bash
   cd expense-tracker-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode
Start the development server with hot reloading:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

#### Production Build
To build and run the optimized production version:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Testing All Features

Follow this testing checklist to verify all functionality:

#### 1. Dashboard Testing
- [ ] Navigate to the Dashboard tab (should be default view)
- [ ] Verify summary cards show placeholder data initially
- [ ] Check that "Recent Expenses" and "Category Chart" show empty states

#### 2. Adding Expenses
- [ ] Click "Add Expense" tab
- [ ] Fill out the form with test data:
  - Amount: Enter a positive number (e.g., 25.50)
  - Category: Select from dropdown (e.g., "Food")
  - Date: Pick today's date or any date
  - Description: Enter descriptive text (e.g., "Lunch at cafe")
- [ ] Click "Add Expense"
- [ ] Verify you're redirected to Dashboard
- [ ] Confirm new expense appears in "Recent Expenses"
- [ ] Check that summary cards update with new totals

#### 3. Viewing Expenses List
- [ ] Click "Expenses" tab
- [ ] Verify the new expense appears in the table (desktop) or card (mobile)
- [ ] Test sorting by clicking column headers (Date, Amount, Category, Description)
- [ ] Verify export functionality by clicking "Export CSV"

#### 4. Filtering & Search
- [ ] Use the search box to find expenses by description
- [ ] Filter by category using the dropdown
- [ ] Set date range filters (From Date / To Date)
- [ ] Test the "Clear" button to remove all filters
- [ ] Verify filtered results update immediately

#### 5. Edit & Delete Operations
- [ ] Click the edit icon (pencil) on any expense
- [ ] Verify you're redirected to "Add Expense" tab with form pre-filled
- [ ] Modify some values and click "Update Expense"
- [ ] Verify changes are reflected in the expense list
- [ ] Click the delete icon (trash) on any expense
- [ ] Confirm the deletion dialog appears
- [ ] Verify expense is removed after confirmation

#### 6. Responsive Design Testing
- [ ] Test on desktop (>768px width)
- [ ] Test on tablet (768px - 1024px width)
- [ ] Test on mobile (<768px width)
- [ ] Verify navigation adapts properly
- [ ] Check that expense list switches from table to cards on mobile

#### 7. Data Persistence
- [ ] Add several expenses
- [ ] Refresh the browser page
- [ ] Verify all expenses persist after reload
- [ ] Test in different browser tabs
- [ ] Verify data consistency across tabs

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and responsive utilities
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application page
├── components/
│   ├── dashboard/          # Dashboard components
│   │   ├── Dashboard.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── CategoryChart.tsx
│   │   └── RecentExpenses.tsx
│   ├── expenses/           # Expense list and filtering
│   │   ├── ExpenseList.tsx
│   │   └── ExpenseFilters.tsx
│   ├── forms/              # Form components
│   │   └── ExpenseForm.tsx
│   ├── layout/             # Layout components
│   │   ├── Header.tsx
│   │   └── Navigation.tsx
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Select.tsx
├── lib/                    # Utility functions
│   ├── expenseAnalytics.ts # Analytics calculations
│   ├── localStorage.ts     # Data persistence
│   └── utils.ts           # Helper functions
└── types/
    └── expense.ts         # TypeScript type definitions
```

## Browser Compatibility

This application works in all modern browsers including:
- Chrome (v90+)
- Firefox (v88+)
- Safari (v14+)
- Edge (v90+)

## Data Storage

All expense data is stored locally in your browser using localStorage. This means:
- ✅ Your data never leaves your device
- ✅ No registration or account required
- ✅ Fast, offline-capable application
- ⚠️ Data is tied to specific browser/device
- ⚠️ Clearing browser data will remove expenses
