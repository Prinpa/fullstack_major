# Full Stack Major Project

A monorepo built with Turborepo containing a Next.js web application with supporting packages.

## Project Structure

The project is organized as a monorepo with the following structure:

**Applications**
- `apps/web` - Next.js web application

**Packages**
- `packages/db` - Database handling with Prisma and Neon
- `packages/env` - Environment configuration 
- `packages/eslint-config` - Shared ESLint configuration
- `packages/typescript-config` - Shared TypeScript configuration
- `packages/ui` - Shared UI components
- `packages/utils` - Shared utility functions

**Tests**
- `tests/playwright` - End-to-end tests using Playwright

## Prerequisites

- Node.js >= 18
- pnpm 9.0.0

## Getting Started

1. Install dependencies:
```sh
pnpm install
```

2. Set up environment variables:
   - Copy `.env.example` files in `apps/web` and `packages/db` to `.env`
   - Configure the environment variables as needed

3. Start the development server:
```sh
pnpm dev
```

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all applications and packages
- `pnpm lint` - Run linting
- `pnpm format` - Format code with Prettier
- `pnpm check-types` - Run TypeScript type checking

## Technology Stack

- **Framework:** Next.js 15
- **Database:** Prisma with Neon Database
- **Styling:** TailwindCSS
- **Testing:** Playwright
- **Package Management:** pnpm
- **Build System:** Turborepo