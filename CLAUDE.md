# Estimate Reliance Landing Page

Professional insurance restoration estimates, supplements, and AI-powered creative marketing solutions.

## Tech Stack

- **React 19** with functional components and hooks
- **TypeScript** (ES2022, strict JSX)
- **Vite 6** for build tooling
- **Tailwind CSS** via inline classes
- **Gemini API** (@google/genai) for AI features
- **Lucide React** for icons

## Project Structure

```
/
├── App.tsx              # Root component with view routing
├── index.tsx            # Entry point
├── types.ts             # Shared TypeScript types & enums
├── components/          # React components
│   ├── StarField.tsx    # Background animation
│   ├── ClaimSubmission.tsx
│   ├── PortalLogin.tsx
│   ├── Labs.tsx         # Labs router component
│   └── Labs/            # Creative studio sub-components
│       ├── LabsMenu.tsx
│       ├── LogoStudio.tsx
│       ├── BusinessCardStudio.tsx
│       ├── YardSignStudio.tsx
│       ├── BannerStudio.tsx
│       ├── FlyerStudio.tsx
│       └── SloganStudio.tsx
└── services/
    └── geminiService.ts # All Gemini API integrations
```

## Architecture Patterns

### View Routing
- Uses `AppView` enum in `types.ts` for navigation states
- App.tsx manages view state via `useState<AppView>`
- No external router - simple conditional rendering in `renderContent()`

### Component Conventions
- **Functional components only** - no class components
- **PascalCase** for component files and names
- Props interface named `{ComponentName}Props` when needed
- Components with `onBack` callback for internal navigation

### Labs Pattern
New lab tools should:
1. Create component in `components/Labs/{ToolName}Studio.tsx`
2. Accept `onBack: () => void` prop
3. Register in `components/Labs.tsx` with a service key
4. Add menu item in `components/Labs/LabsMenu.tsx`

### Service Layer
- All AI/API calls go through `services/geminiService.ts`
- Functions are async and return promises
- API key accessed via `process.env.API_KEY`

## Styling Conventions

- **Tailwind utility classes** inline (no separate CSS files)
- **Dark theme** - `bg-slate-950`, `text-slate-300`, etc.
- **Color palette**: indigo/violet (primary), teal (labs), emerald (brand accent), blue (portal)
- **Animations**: `animate-float`, `animate-swoosh-green`, `animate-pulse`
- **Glassmorphism**: `backdrop-blur-md bg-slate-950/80`

## Commands

```bash
npm install     # Install dependencies
npm run dev     # Start Vite dev server (localhost:5173)
npm run build   # Production build
npm run preview # Preview production build
```

## Important Conventions

- API keys use environment variables - never hardcode
- StarField component provides background - don't duplicate
- View state is centralized in App.tsx
- New features should follow existing patterns before creating new ones
- Icons come from `lucide-react` - check existing imports first

## Do NOT

- Create new top-level directories without understanding structure
- Add new routing libraries - use the AppView pattern
- Create new service files - extend geminiService.ts
- Modify tsconfig.json or vite.config.ts without discussion
- Use class components
- Add new CSS files - use Tailwind inline
