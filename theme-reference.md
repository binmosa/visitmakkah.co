# Visit Makkah - Complete Structure Reference

> **Purpose**: This document provides a comprehensive reference for understanding and customizing the Visit Makkah website. Use this to guide restructuring of layout, menu, header, footer, and home page selection.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Layout Hierarchy](#layout-hierarchy)
4. [Header System](#header-system)
5. [Footer System](#footer-system)
6. [Navigation Configuration](#navigation-configuration)
7. [Home Page Variants](#home-page-variants)
8. [Component Library](#component-library)
9. [Styling System](#styling-system)
10. [Data Layer](#data-layer)
11. [Customization Guide](#customization-guide)

---

## Project Overview

**Project**: Visit Makkah  
**Framework**: Next.js 15 (App Router)  
**Styling**: Tailwind CSS 4 with custom theme  
**Fonts**: Plus Jakarta Sans (headings), Inter (body), Noto Sans Arabic  
**Features**: Dark mode, RTL support, Audio player, Multiple layouts, **Shadcn UI Integrated**

---

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (font, theme provider)
│   ├── theme-provider.tsx  # Dark mode & RTL context
│   ├── SiteHeader.tsx      # Legacy header switcher (COMMENTED OUT)
│   ├── (app)/              # Main app route group
│   │   ├── layout.tsx      # App layout (audio, aside providers)
│   │   ├── application-layout.tsx  # ⭐ MAIN: Header/Footer wrapper
│   │   ├── (home)/         # Home page variants
│   │   ├── (search)/       # Search pages
│   │   ├── about/          # About page
│   │   ├── author/         # Author pages
│   │   ├── category/       # Category pages
│   │   ├── contact/        # Contact page
│   │   ├── post/           # Single post pages
│   │   ├── subscription/   # Subscription page
│   │   └── tag/            # Tag pages
│   ├── (auth)/             # Auth route group (login/signup)
│   ├── dashboard/          # Dashboard pages
│   └── submission/         # Content submission
├── components/             # All React components (229 files)
│   ├── Header/             # Header components
│   ├── Footer/             # Footer component
│   ├── PostCards/          # 23 post card variants
│   ├── Section*.tsx        # Section components (Magazine, Slider, etc.)
│   └── ...
├── data/                   # Mock data & configuration
│   ├── navigation.ts       # ⭐ MENU CONFIGURATION
│   ├── posts.ts            # Post data
│   ├── authors.ts          # Author data
│   └── categories.ts       # Category data
├── shared/                 # Reusable UI primitives (37 files)
│   ├── Logo.tsx            # Site logo
│   ├── Button.tsx          # Button component
│   └── ...
├── styles/
│   └── tailwind.css        # ⭐ THEME COLORS & CUSTOM STYLES
├── hooks/                  # Custom React hooks
└── utils/                  # Utility functions
```

---

## Layout Hierarchy

The template uses a nested layout structure:

```
┌─────────────────────────────────────────────────────────────┐
│  RootLayout (src/app/layout.tsx)                            │
│  └─ ThemeProvider, Font (Be Vietnam Pro), Meta             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │  (app)/layout.tsx                                      │ │
│  │  └─ AudioProvider, Aside.Provider, AudioPlayer         │ │
│  │                                                        │ │
│  │  ┌─────────────────────────────────────────────────┐  │ │
│  │  │  ApplicationLayout (application-layout.tsx)     │  │ │
│  │  │  └─ Banner?, Header/Header2, {children}, Footer │  │ │
│  │  │     AsideSidebarNavigation                      │  │ │
│  │  └─────────────────────────────────────────────────┘  │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Layout Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout - sets font, theme provider, metadata |
| `src/app/theme-provider.tsx` | Dark mode & RTL context provider |
| `src/app/(app)/layout.tsx` | Audio context & aside sidebar provider |
| `src/app/(app)/application-layout.tsx` | **⭐ Main wrapper for header/footer** |

### ApplicationLayout Props

```tsx
interface Props {
  children: ReactNode
  headerHasBorder?: boolean         // Add bottom border to header
  headerStyle?: 'header-1' | 'header-2'  // Choose header variant
  showBanner?: boolean              // Show top banner
}
```

---

## Header System

### Available Headers

| Component | Location | Style |
|-----------|----------|-------|
| `Header` | `src/components/Header/Header.tsx` | Mega-menu style with search bar |
| `Header2` | `src/components/Header/Header2.tsx` | Traditional navigation bar |

### Header Structure

**Header (header-1):**
- Logo + Search bar on left
- MegaMenuPopover (Template showcase) in center
- Create button, Notifications, Avatar on right
- Hamburger menu on mobile

**Header2 (header-2):**
- Logo + Search icon on left
- Full Navigation menu in center
- Create button, Notifications, Avatar on right
- Hamburger menu on mobile

### Header Components

| Component | Purpose |
|-----------|---------|
| `Navigation.tsx` | Main navigation renderer (dropdown/mega-menu) |
| `MegaMenuPopover.tsx` | Mega-menu popup |
| `AvatarDropdown.tsx` | User menu dropdown |
| `NotifyDropdown.tsx` | Notifications dropdown |
| `SearchModal.tsx` | Search overlay |
| `HamburgerBtnMenu.tsx` | Mobile menu trigger |
| `CategoriesDropdown.tsx` | Categories dropdown |
| `LangDropdown.tsx` | Language selector |

### How to Change Default Header

Edit `src/app/(app)/application-layout.tsx`:

```tsx
// Change from 'header-2' to 'header-1' for mega-menu style
headerStyle = 'header-1'  // or keep 'header-2' for traditional nav
```

---

## Footer System

### Footer Location
`src/components/Footer/Footer.tsx`

### Footer Structure

The footer has **hardcoded menu sections** defined in `widgetMenus` array:

```tsx
const widgetMenus: WidgetFooterMenu[] = [
  { id: '5', title: 'Getting started', menus: [...] },
  { id: '1', title: 'Explore', menus: [...] },
  { id: '2', title: 'Resources', menus: [...] },
  { id: '4', title: 'Community', menus: [...] },
]
```

### How to Customize Footer

1. Edit `src/components/Footer/Footer.tsx`
2. Modify the `widgetMenus` array with your own sections
3. The footer also includes `Logo` and `SocialsList1` components

---

## Navigation Configuration

### Main Configuration File
`src/data/navigation.ts`

### Navigation Types

```tsx
type TNavigationItem = {
  id: string
  href: string
  name: string
  type?: 'dropdown' | 'mega-menu'
  isNew?: boolean
  children?: TNavigationItem[]
}
```

### Current Navigation Structure

```
├── Home (dropdown)
│   ├── Home demo 1 → /
│   ├── Home demo 2 → /home-2
│   ├── Home demo 3 → /home-3
│   ├── Home demo 4 → /home-4
│   ├── Home demo 5 → /home-5
│   └── Header style 2 → /home-3
├── Search → /search?s=technology
├── Travel → /category/travel
├── Templates (mega-menu)
│   ├── Home pages
│   ├── Archive pages
│   ├── Single pages
│   └── Other pages
└── Explore (dropdown)
    ├── Category page
    ├── Author page
    ├── Search pages
    └── ...
```

### Helper Functions

| Function | Returns |
|----------|---------|
| `getNavigation()` | Full navigation array |
| `getNavMegaMenu()` | The "Templates" mega-menu item |
| `getLanguages()` | Language options |
| `getCurrencies()` | Currency options |
| `getHeaderDropdownCategories()` | Category dropdown items |

### How to Customize Navigation

1. Edit `src/data/navigation.ts`
2. Modify the array returned by `getNavigation()`
3. For a simple menu:
   - Remove the "Templates" mega-menu
   - Convert "Home" dropdown to a single link
   - Add your desired menu items

---

## Home Page Variants

### Available Home Pages

| Route | Folder | Description |
|-------|--------|-------------|
| `/` | `(home-1)` | **Default** - Full featured with sliders, magazines, videos |
| `/home-2` | `home-2` | Podcast-focused with hero section |
| `/home-3` | `home-3` | Alternative layout |
| `/home-4` | `home-4` | Alternative layout |
| `/home-5` | `home-5` | Alternative layout |
| `/home-6` | `home-6` | Alternative layout |

### Default Home Page (`(home-1)`)

Uses route group `(home-1)` which makes it the default `/` route.

**Sections included:**
- SectionLargeSlider (Editor's pick)
- SectionSliderNewAuthors
- SectionSliderNewCategories
- SectionSliderPosts
- SectionMagazine1, 2, 7, 8, 9
- SectionGridPosts (video articles)
- SectionGridAuthorBox
- SectionBecomeAnAuthor
- SectionSubscribe2
- SectionVideos
- SectionPostsWithWidgets
- SectionAds

### How to Change Default Home Page

**Option 1: Swap route groups**
1. Rename `(home-1)` to `home-1` (removes parentheses)
2. Rename your desired home (e.g., `home-2`) to `(home-2)` 
3. The route group with parentheses becomes the default

**Option 2: Modify the default home page**
1. Edit `src/app/(app)/(home)/(home-1)/page.tsx`
2. Remove/reorder sections as needed
3. Add/remove components to match your needs

---

## Component Library

### Post Cards (23 variants)

Located in `src/components/PostCards/`:

| Type | Components |
|------|------------|
| Standard | Card1, Card2, Card3, Card4, Card5, Card6, Card7, Card8 |
| Video | Card9, Card10, Card10V2, Card11 |
| Audio/Podcast | Card15Podcast, Card16Podcast |
| Featured | Card13, Card14, Card17, Card18, Card19, Card20, Card21 |

### Section Components

Located in `src/components/`:

| Component | Purpose |
|-----------|---------|
| `SectionMagazine1-11` | Various magazine-style layouts |
| `SectionLargeSlider` | Large post slider |
| `SectionSliderPosts` | Horizontal post slider |
| `SectionSliderNewCategories` | Category slider |
| `SectionSliderNewAuthors` | Author slider |
| `SectionGridPosts` | Grid layout for posts |
| `SectionGridAuthorBox` | Author grid |
| `SectionGridCategoryBox` | Category grid |
| `SectionPostsWithWidgets` | Posts + sidebar widgets |
| `SectionVideos` | Video section |
| `SectionHero`, `SectionHero2`, `SectionHero3` | Hero sections |
| `SectionSubscribe2` | Newsletter subscription |
| `SectionBecomeAnAuthor` | CTA for authors |
| `SectionAds` | Advertisement section |
| `BackgroundSection` | Decorative background |

### Widget Components

| Component | Purpose |
|-----------|---------|
| `WidgetPosts` | Sidebar posts widget |
| `WidgetCategories` | Sidebar categories |
| `WidgetAuthors` | Sidebar authors |
| `WidgetTags` | Sidebar tags |
| `WidgetHeading` | Widget title |

### Shared UI Components

Located in `src/shared/`:

| Component | Purpose |
|-----------|---------|
| `Logo.tsx` | Site logo (SVG) |
| `Button.tsx` | Button component |
| `Avatar.tsx` | User avatar |
| `Badge.tsx` | Status badge |
| `Input.tsx`, `Textarea.tsx` | Form inputs |
| `Pagination.tsx` | Page navigation |
| `SwitchDarkMode.tsx` | Theme toggle |
| `SocialsList1.tsx` | Social media links |
| `Heading.tsx` | Section heading |

### Shadcn UI (Prioritized)

> **RULE**: Always prioritize using Shadcn UI components for new features or when replacing existing UI elements.

- **Location**: `src/components/ui/`
- **Styling**: Fully integrated with project theme (Deep Teal & Warm Gold).
- **Usage**:
  ```tsx
  import { Button } from "@/components/ui/button"
  <Button>Click me</Button>
  ```
- **Available Components**:
  - Button (`src/components/ui/button.tsx`)
  - *Add new Shadcn components as needed*

---

## Styling System

### Main CSS File
`src/styles/tailwind.css`

### Theme Colors

```css
@theme {
  /* Primary (Indigo) */
  --color-primary-50 to --color-primary-900
  
  /* Secondary (Teal) */
  --color-secondary-50 to --color-secondary-900
  
  /* Neutral (Gray) */
  --color-neutral-50 to --color-neutral-900
}
```

### Dark Mode

- Class-based: `.dark` class on `<html>`
- Stored in `localStorage` as `theme: 'dark-mode' | 'light-mode'`
- Managed by `ThemeContext` in `theme-provider.tsx`

### RTL Support

- Direction stored in `<html dir="rtl|ltr">`
- Managed by `ThemeContext`
- Tailwind RTL utilities: `rtl:`, `ltr:`

### Custom Utilities

| Utility | Purpose |
|---------|---------|
| `.container` | Centered container with responsive padding |
| `.embla*` | Carousel utilities |
| `.hidden-scrollbar` | Hide scrollbars |
| `.nc-animation-spin` | Spinning animation |
| `.menu-item` / `.sub-menu` | Menu hover states |

---

## Data Layer

### Mock Data Files

| File | Content |
|------|---------|
| `data/posts.ts` | Post data with functions for filtering |
| `data/authors.ts` | Author profiles |
| `data/categories.ts` | Category definitions |
| `data/navigation.ts` | Navigation menu structure |
| `data/search.ts` | Search data |

### Post Data Functions

```tsx
getAllPosts()           // All posts
getPostsDefault()       // Standard posts
getPostsAudio()         // Audio/podcast posts
getPostsVideo()         // Video posts
getPostsGallery()       // Gallery posts
```

---

## Customization Guide

### 🎯 Step 1: Choose Default Home Page

1. Decide which home variant you want
2. Rename folders to make your choice the default
3. Or customize `(home-1)/page.tsx` directly

### 🎯 Step 2: Configure Header

Edit `src/app/(app)/application-layout.tsx`:

```tsx
const ApplicationLayout: React.FC<Props> = ({
  children,
  headerHasBorder,
  headerStyle = 'header-2',  // ← Change this
  showBanner = false,
}) => {
```

### 🎯 Step 3: Simplify Navigation

Edit `src/data/navigation.ts`:

```tsx
export async function getNavigation(): Promise<TNavigationItem[]> {
  return [
    { id: '1', href: '/', name: 'Home' },           // Simple link
    { id: '2', href: '/about', name: 'About' },
    { id: '3', href: '/contact', name: 'Contact' },
    // Add your menu items...
  ]
}
```

### 🎯 Step 4: Customize Footer

Edit `src/components/Footer/Footer.tsx`:
- Update `widgetMenus` array with your sections
- Modify links to point to your pages

### 🎯 Step 5: Update Logo

Edit `src/shared/Logo.tsx`:
- Replace the SVG with your own logo
- Or use an image: `<Image src="/logo.png" alt="Logo" />`

### 🎯 Step 6: Customize Colors

Edit `src/styles/tailwind.css`:

```css
@theme {
  --color-primary-500: rgb(YOUR_COLOR);
  --color-primary-600: rgb(YOUR_COLOR);
  /* ... */
}
```

### 🎯 Step 7: Connect to Real Data

Replace mock data functions in `src/data/` with API calls:
- Use Next.js server components for data fetching
- Or create API routes in `src/app/api/`

---

## Quick Reference: Key Files to Modify

| Goal | File(s) to Edit |
|------|-----------------|
| Change header style | `src/app/(app)/application-layout.tsx` |
| Modify navigation menu | `src/data/navigation.ts` |
| Customize footer | `src/components/Footer/Footer.tsx` |
| Change logo | `src/shared/Logo.tsx` |
| Modify colors | `src/styles/tailwind.css` |
| Change default home | `src/app/(app)/(home)/(home-1)/page.tsx` |
| Modify fonts | `src/app/layout.tsx` |
| Change metadata | `src/app/layout.tsx` |

---

## Notes for AI Agents

When restructuring this template:

1. **ApplicationLayout is the key wrapper** - It controls header/footer for all pages
2. **Navigation is data-driven** - Change `src/data/navigation.ts` to update menus
3. **Footer has hardcoded menus** - Must edit `Footer.tsx` directly
4. **Route groups control defaults** - `(parentheses)` makes a folder the default route
5. **Section components are modular** - Mix and match to build pages
6. **Theme uses Tailwind CSS 4** - Custom properties in `@theme` block
7. **All headers support dark mode** - Uses `.dark` class on `<html>`
8. **Prioritize Shadcn UI** - Use components from `src/components/ui/` for all new UI development. Maintain existing design patterns (colors, fonts) when adding new Shadcn components.

---

*Generated for: visitmakkah project restructuring*
