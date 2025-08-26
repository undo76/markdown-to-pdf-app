# CRUSH.md - Project Configuration & Commands

## 🚀 Development Commands

### Core Development

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production with Turbopack
pnpm start        # Start production server
```

### Testing (Vitest)

```bash
pnpm test         # Run tests in watch mode
pnpm test:ui      # Open Vitest UI
pnpm test:run     # Run tests once
```

### Linting & Formatting

```bash
pnpm lint         # Run ESLint on all JS/TS files
pnpm lint:fix     # Fix ESLint issues automatically
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting without fixing
```

### Git Hooks (Husky + lint-staged)

- Pre-commit hooks automatically run:
  - ESLint on staged JS/TS files
  - Prettier formatting
  - Automatic fixes applied

## 🛠️ Technology Stack

### Core Framework

- **Next.js 15.5.0** with App Router
- **React 19.1.0** with latest features
- **TypeScript 5.9.2** for type safety

### Styling

- **Tailwind CSS 4.1.12** (latest v4)
- **shadcn/ui** for component library, use pnpm dlx shadcn-ui@latest add <component> to add components

### Data Management

- **TanStack Query 5.85.5** (React Query)
- React Query Devtools included

### Testing

- **Vitest 3.2.4** test runner
- **Testing Library** for component testing
- **jsdom** for browser environment simulation

### Code Quality

- **ESLint 9.34.0** with flat config
- **Prettier 3.6.2** for formatting
- **Husky 9.1.7** for git hooks
- **lint-staged 16.1.5** for pre-commit checks

## 📁 Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
│   ├── ui/        # shadcn/ui components
│   └── test-component.tsx
├── providers/     # React context providers
├── lib/           # Utilities and helpers
└── test/          # Test files
```

## ⚙️ Configuration Files

- `eslint.config.mjs` - ESLint flat config
- `.prettierrc` - Prettier configuration
- `vitest.config.ts` - Vitest configuration
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## 🎯 Code Style Preferences

- Single quotes for JavaScript/TypeScript
- 2 spaces indentation
- 80 character print width
- Semicolons enabled
- ES5 trailing commas

## 🔧 Development Workflow

1. Code in your components
2. Tests run automatically with changes
3. Pre-commit hooks ensure code quality
4. ESLint + Prettier enforce consistency
5. Husky prevents committing broken code

## 📦 Package Manager

- **pnpm** used for all package management
- Lockfile: `pnpm-lock.yaml`
- Node.js version: Check `.nvmrc` if present

## 🚨 Important Notes

- Uses Turbopack for faster development
- Path aliases configured (`@/*`)
- Modern ESLint flat config format
- All code formatted with Prettier
- Tests use Vitest + Testing Library
- Git hooks enforce quality standards
- Use always `fd` command for file searching instead of `find`
- Use context7 tools for checking out documentation and snippets
- Use a single file per component
- Make it modular and small components
- Use shadcn/ui for UI components
- Use strict typing in TypeScript, avoid `any`

## Specific Task Instructions

Your job is to port markdown-paper.html to this repository in next.js and maintain the repository.

Make a commit and push your changes after every single file edit.

Use the .agent/ directory as a scratchpad for your work. Store long term plans and todo lists there.

The original project was mostly tested by manually running the code. When porting, you will need to write end to end and unit tests for the project. But make sure to spend most of your time on the actual porting, not on the testing. A good heuristic is to spend 80% of your time on the actual porting, and 20% on the
testing.
