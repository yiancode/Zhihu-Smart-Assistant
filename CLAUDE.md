# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Zhihu Smart Assistant** - a Chrome extension built on top of the chrome-extension-boilerplate-react-vite template. The project aims to enhance the Zhihu browsing experience by providing theme switching, ad filtering, answer aggregation, and AI-powered content summarization features.

## Development Commands

### Core Development Commands
- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server with hot reload (Chrome)
- `pnpm dev:firefox` - Start development for Firefox
- `pnpm build` - Production build for Chrome
- `pnpm build:firefox` - Production build for Firefox
- `pnpm zip` - Build and package extension into zip file

### Quality Assurance
- `pnpm type-check` - Run TypeScript type checking across all packages
- `pnpm lint` - Run ESLint with auto-fix
- `pnpm lint:fix` - Run ESLint with aggressive auto-fix
- `pnpm prettier` - Format code with Prettier
- `pnpm e2e` - Run end-to-end tests (builds and zips first)

### Testing & Development
- `pnpm e2e:firefox` - Run e2e tests for Firefox version

## Architecture

This is a **monorepo** using Turborepo with the following key structure:

### Chrome Extension Core
- `chrome-extension/` - Contains manifest.js and background scripts
- `chrome-extension/src/background/` - Service worker implementation

### Pages (Extension Components)
- `pages/popup/` - Extension popup interface (320x400px)
- `pages/options/` - Settings and configuration page
- `pages/content/` - Content scripts for Zhihu page injection
- `pages/content-ui/` - React UI components injected into Zhihu pages
- `pages/content-runtime/` - Runtime content script injection
- `pages/side-panel/` - Side panel for answer aggregation (Chrome 114+)
- `pages/new-tab/` - Custom new tab page (if needed)
- `pages/devtools/` & `pages/devtools-panel/` - Developer tools integration

### Shared Packages
- `packages/shared/` - Common types, constants, hooks, and components
- `packages/storage/` - Chrome storage API helpers with encryption
- `packages/i18n/` - Internationalization (Chinese/English support)
- `packages/ui/` - Shared UI components and Tailwind config merging
- `packages/tailwind-config/` - Global Tailwind configuration
- `packages/hmr/` - Hot module reload for development

## Key Technical Details

### Framework Stack
- **React 18** with TypeScript
- **Vite 6** for building and dev server
- **Tailwind CSS** for styling and theme system
- **Turborepo** for monorepo management
- **Chrome Manifest V3** compliance

### Zhihu-Specific Features
Based on the PRD, this extension implements:
1. **Theme System** - 3 presets (default, dark, eye-care) with CSS variable injection
2. **Ad Filtering** - DOM-based removal of promotional content
3. **Answer Aggregation** - Extracts and ranks answers by upvotes in collapsible sidebar (240px-480px width)
4. **AI Integration** - Content summarization via external AI APIs (OpenAI)
5. **Content Operations** - One-click copy functionality with clipboard API

### Development Notes
- All packages use individual `vite.config.mts` files
- TypeScript configurations extend from `packages/tsconfig/`
- Environment variables use `VITE_` prefix and are defined in `vite-env.d.ts`
- Keyboard shortcuts: Alt+Z (toggle sidebar), Alt+C (copy), Alt+S (summarize)

### Storage & Security
- User preferences and AI API keys stored encrypted in chrome.storage
- Settings sync across devices via Chrome account
- Secure handling of API credentials

## Development Workflow

1. **Start Development**: `pnpm dev` creates dev build with HMR
2. **Load Extension**: Use `dist/` folder in Chrome's "Load unpacked"
3. **Test Changes**: HMR automatically refreshes extension pages
4. **Quality Check**: Run `pnpm type-check && pnpm lint` before commits
5. **Build for Distribution**: `pnpm build && pnpm zip`

## Important File Patterns
- All React components use `.tsx` extension
- Vite configs use `.mts` extension
- Package.json files contain turbo-specific commands
- CSS injection uses content scripts with proper CSP handling