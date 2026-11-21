# Streako Personal - Gamified Habit Tracker 🎮📊

A complete, functional, personal **Gamified Habit Tracker Web Application** inspired by the spreadsheet-style dashboard and gamified mechanics of *streako.shop*. 

100% free, zero-login, local-first web application built with **React**, **Tailwind CSS**, and **Lucide React**, where you can manage, check off, and analyze your daily habits with automatic persistence in `localStorage`.

---

## 🌟 Key Updates & Features

### 1. Clean Slate / Zero-State Initialization
- **Completely Fresh Start**: No pre-populated mock habits or sample check-ins on first load.
- **True Zero Baseline**:
  - **Daily Progress card**: `0 / 0 (0% Done)`
  - **Streak card**: `0 Days`
  - **Monthly Completion card**: `0% (0 of 0 target check-ins done)`
  - **Level card**: `Lvl 1 (Beginner) — 0 XP (0% to Lvl 2)`
  - **Habit Table Empty State**: Friendly card: *"No habits yet. Click '+ Add Habit' to create your first daily goal!"* with a prominent `+ Add Habit` button.
  - **Categories**: Starts clean with only `"All"` until you create custom categories.
- **Reset All Data Button**: Inside the *Data & Backup* modal, a one-click wipe resets habits, streaks, and XP back to zero anytime.

### 2. Interactive Contextual Hints & Onboarding Walkthrough
- **Header Toggle**: Dedicated `Hints: ON / OFF` button in the top navigation bar with live indicator.
- **Contextual Popovers**: Clicking key UI elements (or stepping through the tour) opens an interactive popover detailing:
  - 🎯 **What That Feature Does**
  - 🧮 **How It Is Calculated or Used**
  - 💡 **Pro Tips to Get the Most Out of It**
- **Connected Elements**:
  1. **Top KPI Cards**: Full breakdown of formulas for Daily Done %, Active Streaks, Monthly Consistency, and Level/XP progression (+10 XP per check-in).
  2. **"+ Add Habit" Button**: Step-by-step guidance on setting habit titles, emojis, categories, and monthly targets.
  3. **Calendar Grid Checkboxes**: Real-time explanation of one-click toggles, pop animations, audio feedback, and streak continuity.
  4. **Category Filter & Search**: Guide on isolating categories and searching routines.
  5. **Daily Total (`COUNTIF`) Row**: Formula explanation for column-based spreadsheet percentages.
  6. **Badges & Data Portability**: Guide to exporting real UTF-8 BOM CSV files for Excel, JSON backups, and resetting data.
- **Walkthrough Tour Navigation**: Includes `Next Tip →`, `← Prev`, `Got It`, and `Turn Hints Off` controls.

---

## 🚀 Running the App Locally

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build production bundle
npm run build
```
Visit: `http://localhost:5173/`
