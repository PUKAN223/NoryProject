# Nory Design System

This document outlines the visual and architectural design system for **Nory**, an AI Expense Tracker PWA. It serves as a single source of truth to maintain visual consistency across all components and screens.

## 1. Typography

Nory relies on clear, modern, and readable typography, using standard web fonts along with a premium Thai font.

* **Primary Font (Thai & Latin):** Kanit (`next/font/google`)
* **Fallback Font (Latin):** Geist Sans (`next/font/google`)
* **Monospace Font:** Geist Mono (`next/font/google`)

### Sizing Rules
* **App Titles/Logos:** `text-xl font-bold tracking-tight`
* **Card Values (e.g. Budget):** `text-[2.75rem] leading-none font-bold tracking-tighter`
* **Currency Symbol (฿):** Opacity `70-80%`, one size smaller than the adjacent number (e.g. `text-[2rem]`).
* **Headers:** `text-lg font-semibold tracking-tight`
* **Body Text (Titles):** `text-[15px]` or `text-base font-semibold`
* **Small Text (Time, Subtitles):** `text-[13px] text-zinc-500`

## 2. Color Palette

The app follows a strict light/dark mode dual-theme system, heavily utilizing the Zinc scale for a neutral, calming base.

### Backgrounds
* **App Base Wrapper:** `bg-zinc-200/50` (Light) / `bg-black` (Dark)
* **Mobile Container (The "Device"):** `bg-[#fdfdfd]` (Light) / `bg-[#0a0a0a]` (Dark)
* **Standard Cards:** `bg-white` (Light) / `bg-[#111111]` (Dark)

### Foregrounds (Text & Icons)
* **Primary Text:** `text-zinc-900` (Light) / `text-zinc-50` or `text-zinc-100` (Dark)
* **Secondary/Muted Text:** `text-zinc-500` (Light) / `text-zinc-400` (Dark)

### Accents (Expense Categories & Notifications)
Use low-opacity backgrounds with highly saturated foregrounds for categories.
* **Food:** Orange (`bg-orange-100 text-orange-600` / `dark:bg-orange-500/10 dark:text-orange-400`)
* **Transport:** Blue (`bg-blue-100 text-blue-600` / `dark:bg-blue-500/10 dark:text-blue-400`)
* **Shopping:** Purple (`bg-purple-100 text-purple-600` / `dark:bg-purple-500/10 dark:text-purple-400`)
* **Positive Status:** Emerald (`bg-emerald-100 text-emerald-600` / `dark:bg-emerald-500/10 dark:text-emerald-400`)

## 3. Shape & Borders

We use highly rounded corners (iOS-inspired) to ensure the UI feels soft and human.

* **Main Dashboard Cards:** `rounded-[2rem]`
* **List Items / Icons:** `rounded-[1.25rem]` or `rounded-[1rem]`
* **Tab Bar:** `rounded-[2rem]`
* **Inputs & Action Buttons:** `rounded-full`

### Borders & Shadows
* **Borders:** Extremely subtle. `border border-black/[0.04]` (Light) / `border-white/[0.08]` (Dark)
* **Main Card Shadows:** `shadow-[0_8px_30px_rgb(0,0,0,0.04)]` (Light) / `shadow-[0_8px_30px_rgb(0,0,0,0.2)]` (Dark)
* **Floating Element Shadows:** `shadow-[0_20px_40px_rgb(0,0,0,0.1)]` (Light) / `shadow-[0_20px_40px_rgb(0,0,0,0.4)]` (Dark)

## 4. UI Layout & Navigation

### The Mobile Container
The app is built mobile-first. On desktop, it is constrained to a `max-w-[390px] h-[100dvh]` container in the center of the screen to emulate an iPhone Pro size.

### The Floating Tab Bar
* Placed at `bottom-6` with `left-6 right-6` margins.
* Height: `72px`.
* Backdrop blur: `backdrop-blur-3xl bg-white/80 dark:bg-[#111111]/80`.
* Active State: Uses a black/white dot (`w-1 h-1 rounded-full`) underneath the icon, while the icon gets `strokeWidth={2.5}` and active color.

### Quick Add Input
* Floats right above the Tab Bar (`bottom-[6.5rem]`).
* Height is small and sleek (`h-9` buttons, `p-1.5` wrapper).
* Input text should be small (`text-[13px]`) to ensure the keyboard doesn't make the UI look clunky when typing.

## 5. Animation

We do not use Javascript-heavy animation libraries like Framer Motion for basic UI elements to ensure snappy PWA performance.
Instead, we use native CSS keyframes defined in `globals.css`.

* **Entrance Animation:** `animate-fade-in-up`
* **Staggering:** Use utility classes `.delay-100`, `.delay-200`, `.delay-300` for staggered lists.
* **Hover States:** Button scaling (`hover:scale-105`), subtle color shifts (`transition-colors duration-300`).

## 6. Emotional Design Rules

* Avoid red text for negative numbers unless strictly necessary; use neutral colors to avoid stress.
* Use emojis sparingly but effectively (e.g. 🎉 for staying under budget).
* Keep empty states encouraging (e.g. "No spending yet today, great job!").
