# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (includes TypeScript compilation)
- `npm run lint` - Lint code using Biome
- `npm run lint:fix` - Auto-fix linting issues with Biome
- `npm run format` - Format code using Biome
- `npm run check` - Run both linting and formatting checks
- `npm run check:fix` - Auto-fix both linting and formatting issues
- `npm run preview` - Preview production build locally

### Code Quality
- Uses Biome for linting, formatting, and import organization
- Migrated from ESLint to Biome for unified tooling
- Always run `npm run lint` and `npm run build` before committing to ensure code quality

## Architecture Overview

### Technology Stack
- **Frontend**: React 19.1 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS 4.1 with Vite plugin
- **Charts**: Recharts for data visualization
- **Markdown**: react-markdown for rendering policy summaries

### Application Structure
This is a municipal policy visualization application with two main sections:

#### 1. Policy Management (`policies` tab)
- **Policy CRUD**: Add, view, and vote on municipal policies
- **Interactive Features**: Voting system, commenting, search/filter functionality
- **AI Integration**: LLM-powered policy summarization using Gemini API
- **State Management**: Local state with useState for policies, votes, and comments

#### 2. Financial Visualization (`finance` tab)
- **Data Display**: Revenue/expenditure charts with both bar and pie chart views
- **Time Navigation**: Year/month switching with period selection
- **Financial Metrics**: Health indicators like fiscal capacity ratio, debt ratio
- **Detailed Views**: Modal breakdowns for specific financial categories

### Key Components
- **FinanceChart**: Complex financial data visualization with multiple chart types
- **ConfirmationModal**: Reusable confirmation dialog
- **CommentForm**: Policy comment submission with anonymous option
- **DetailedFinanceModal**: Drill-down financial data modal

### Data Layer
- **Mock Data**: Located in `src/data/` directory
  - `policies.ts` - Policy information with voting and comments
  - `finances.ts` - Financial data (monthly/yearly revenue/expenditure)
  - `expenditures.ts` - Detailed expenditure breakdowns

### State Management Patterns
- Policies are managed in main App component state
- Financial data is imported as static mock data
- Modal states are managed locally with useEffect for scroll control
- Form state includes unsaved changes tracking

### Development Notes
- The app uses Japanese language throughout the UI
- LLM integration requires API key configuration for policy summarization
- Chart interactions support click-through to detailed modal views
- Responsive design with mobile-first approach using Tailwind breakpoints

### Code Review Checklist
- 作業完了後、必ず以下の作業をやってほしい
  - ビルドが通ること
  - 型チェックが通ること（テストも含む）
  - formatする
  - テストが通らない箇所があれば修正
- 次の作業を始める前にコミットする
