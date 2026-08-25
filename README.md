# Nory

<p align="center">
  <img src="https://api.iconify.design/lucide:wallet-cards.svg?color=%23ffffff" width="64" height="64" alt="Nory">
</p>

<h3 align="center">AI-powered personal finance, designed for everyday spending.</h3>

<p align="center">
  Nory is a modern, mobile-first expense tracker that uses AI to make recording and understanding your spending easier.
</p>

---

## <img src="https://api.iconify.design/lucide:sparkles.svg?color=%23ffffff" width="20" height="20" valign="middle"> Overview

Nory is a modern personal finance application built around one simple idea:

> Tracking expenses should be as easy as telling someone what you bought.

Instead of forcing users to manually enter every field, Nory uses Google's Gemini AI to understand natural-language expense descriptions and automatically extract important information such as the expense name, amount, and category.

For example:

```text
ซื้อกาแฟและขนม 120
````

Nory can turn this into structured expense data:

```text
Title: กาแฟและขนม
Amount: 120
Category: Food & Drinks
```

The application then combines expense tracking, analytics, budgeting, and AI-powered financial insights into a single mobile-first experience.

---

## <img src="https://api.iconify.design/lucide:wand-sparkles.svg?color=%23ffffff" width="20" height="20" valign="middle"> AI-Powered Expense Tracking

Nory removes much of the friction from manually recording expenses.

Instead of filling out:

```text
Title
Amount
Category
Date
```

users can simply describe what they spent.

```text
ซื้อข้าว 60 บาท
```

The AI processes the input and converts it into structured financial data.

### AI can extract

* Expense title
* Amount
* Category
* Relevant information from the description

This makes expense recording much faster for everyday use.

---

## <img src="https://api.iconify.design/lucide:brain-circuit.svg?color=%23ffffff" width="20" height="20" valign="middle"> AI Financial Advisor

Nory also uses AI to provide personalized financial insights.

The dashboard can analyze recent spending patterns and provide encouraging suggestions based on the user's financial activity.

```text
Your Spending
      |
      v
Recent Expenses
      |
      v
Spending Patterns
      |
      v
Gemini AI
      |
      v
Financial Insights
```

The goal is not simply to show numbers, but to help users understand their spending habits.

---

## <img src="https://api.iconify.design/lucide:chart-no-axes-combined.svg?color=%23ffffff" width="20" height="20" valign="middle"> Analytics

Nory provides visual insights into personal spending.

### Dashboard

The dashboard provides an overview of:

* Recent expenses
* Spending activity
* Budget information
* AI-generated financial insights

### Spending Chart

A 7-day spending chart helps users understand their recent spending patterns.

```text
Spending
  |
  |             *
  |       *     |
  |   *   |     *
  |   |   |     |
  +-------------------
    Mon Tue Wed Thu Fri
```

### Category Breakdown

Expenses can also be analyzed by category to help identify where money is being spent.

---

## <img src="https://api.iconify.design/lucide:smartphone.svg?color=%23ffffff" width="20" height="20" valign="middle"> Mobile First

Nory is designed primarily for mobile devices.

The interface focuses on:

* Large touch targets
* Simple navigation
* Gesture-based interactions
* Minimal UI
* Fast expense entry
* Responsive layouts

The application can also be installed as a Progressive Web App.

---

## <img src="https://api.iconify.design/lucide:download.svg?color=%23ffffff" width="20" height="20" valign="middle"> Progressive Web App

Nory supports PWA functionality, allowing it to behave more like a native application.

```text
                 Nory
                   |
          +--------+--------+
          |                 |
          v                 v
        Browser          Installed PWA
          |                 |
          v                 v
       Web App          App-like UI
```

The project includes a service worker under:

```text
public/sw.js
```

This provides the foundation for the installable mobile experience.

---

## <img src="https://api.iconify.design/lucide:hand.svg?color=%23ffffff" width="20" height="20" valign="middle"> Touch Interactions

Nory uses gesture-based interactions to make expense management feel natural on mobile.

For example:

```text
Expense
   |
   | <---- Swipe
   v
Delete
```

Framer Motion is used to provide smooth transitions and interactions throughout the interface.

---

## <img src="https://api.iconify.design/lucide:user-round-cog.svg?color=%23ffffff" width="20" height="20" valign="middle"> Personalization

Users can customize their financial profile.

### Profile settings

* Daily spending budget
* Currency
* Avatar
* Theme

The avatar can be uploaded and stored as Base64 data.

---

## <img src="https://api.iconify.design/lucide:shield-check.svg?color=%23ffffff" width="20" height="20" valign="middle"> Authentication

Nory uses custom JWT-based authentication.

```text
User
 |
 v
Login
 |
 v
JWT
 |
 v
HTTP-only Cookie
 |
 v
Authenticated Session
```

Authentication uses:

* JWT
* `jose`
* HTTP-only cookies
* Server-side authentication logic

Using HTTP-only cookies helps prevent client-side JavaScript from directly accessing authentication tokens.

---

## <img src="https://api.iconify.design/lucide:database.svg?color=%23ffffff" width="20" height="20" valign="middle"> Database

Nory uses PostgreSQL with Prisma ORM.

```text
Nory
 |
 v
Next.js Server Actions
 |
 v
Prisma
 |
 v
PostgreSQL
```

The Prisma schema is located at:

```text
prisma/
```

Database operations are primarily handled through Next.js Server Actions.

---

## <img src="https://api.iconify.design/lucide:layers-3.svg?color=%23ffffff" width="20" height="20" valign="middle"> Architecture

Nory follows a Next.js full-stack architecture.

```text
                    Nory
                     |
              Next.js App Router
                     |
          +----------+----------+
          |                     |
          v                     v
      UI Layer            Server Actions
          |                     |
          |              +------+------+
          |              |             |
          |              v             v
          |           Prisma       Gemini AI
          |              |
          |              v
          |          PostgreSQL
          |
          v
      PWA / Mobile
```

---

## <img src="https://api.iconify.design/lucide:folder-tree.svg?color=%23ffffff" width="20" height="20" valign="middle"> Project Structure

```text
NoryProject/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   ├── sw.js
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── actions/
│   │   ├── analytics/
│   │   ├── login/
│   │   ├── profile/
│   │   ├── timeline/
│   │   └── ...
│   │
│   ├── components/
│   │   ├── AppShell
│   │   ├── ExpenseItem
│   │   └── ...
│   │
│   └── context/
│       ├── ExpenseContext
│       ├── AuthContext
│       └── ThemeContext
│
├── PROJECT.md
├── design.md
├── next.config.ts
├── package.json
├── biome.json
└── tsconfig.json
```

---

## <img src="https://api.iconify.design/lucide:cpu.svg?color=%23ffffff" width="20" height="20" valign="middle"> Tech Stack

| Technology         | Purpose                                   |
| ------------------ | ----------------------------------------- |
| Next.js            | Full-stack React framework                |
| React              | User interface                            |
| TypeScript         | Type safety                               |
| Tailwind CSS       | Styling                                   |
| Framer Motion      | Animations and gestures                   |
| Lucide React       | Icons                                     |
| PostgreSQL         | Database                                  |
| Supabase           | PostgreSQL hosting                        |
| Prisma             | ORM                                       |
| Google Gemini      | AI expense parsing and financial insights |
| `jose`             | JWT authentication                        |
| PWA Service Worker | Progressive Web App                       |
| Biome              | Code formatting and linting               |

---

## <img src="https://api.iconify.design/lucide:workflow.svg?color=%23ffffff" width="20" height="20" valign="middle"> Expense Flow

```text
User
 |
 | "ซื้อกาแฟ 80 บาท"
 v
Nory
 |
 v
Gemini AI
 |
 | Parse
 v
Structured Expense
 |
 +---- Title
 +---- Amount
 +---- Category
 |
 v
Server Action
 |
 v
Prisma
 |
 v
PostgreSQL
 |
 v
Dashboard
```

This allows natural-language input to become a normal structured expense record.

---

## <img src="https://api.iconify.design/lucide:rocket.svg?color=%23ffffff" width="20" height="20" valign="middle"> Getting Started

### Requirements

* Bun or Node.js
* PostgreSQL database
* Google Gemini API key

A hosted PostgreSQL provider such as Supabase can be used.

### Clone

```bash
git clone https://github.com/PUKAN223/NoryProject.git
cd NoryProject
```

### Install Dependencies

Using Bun:

```bash
bun install
```

Or npm:

```bash
npm install
```

---

## <img src="https://api.iconify.design/lucide:key-round.svg?color=%23ffffff" width="20" height="20" valign="middle"> Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgres://user:password@host:port/database"

JWT_SECRET="your_super_secret_jwt_key"

GEMINI_API_KEY="your_gemini_api_key"
```

### Variables

| Variable         | Description                        |
| ---------------- | ---------------------------------- |
| `DATABASE_URL`   | PostgreSQL connection string       |
| `JWT_SECRET`     | Secret used for JWT authentication |
| `GEMINI_API_KEY` | Google Gemini API key              |

Never commit your `.env` file or API keys to Git.

---

## <img src="https://api.iconify.design/lucide:database-zap.svg?color=%23ffffff" width="20" height="20" valign="middle"> Database Setup

Push the Prisma schema to your database:

```bash
bunx prisma db push
```

Generate the Prisma client if required:

```bash
bunx prisma generate
```

---

## <img src="https://api.iconify.design/lucide:terminal.svg?color=%23ffffff" width="20" height="20" valign="middle"> Development

Start the development server:

```bash
bun run dev
```

Or with npm:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## <img src="https://api.iconify.design/lucide:package.svg?color=%23ffffff" width="20" height="20" valign="middle"> Production

Build the application:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

---

## <img src="https://api.iconify.design/lucide:palette.svg?color=%23ffffff" width="20" height="20" valign="middle"> UI Design

Nory uses a modern mobile-first visual language.

The interface combines:

* Glassmorphism
* Soft surfaces
* Smooth micro-interactions
* Dark mode
* Light mode
* Rounded components
* Minimal navigation
* Mobile-first layouts

The goal is to make financial tracking feel approachable rather than like traditional accounting software.

---

## <img src="https://api.iconify.design/lucide:bar-chart-3.svg?color=%23ffffff" width="20" height="20" valign="middle"> Core Pages

```text
/
|
+-- Home
|
+-- Timeline
|    |
|    +-- Expense history
|
+-- Analytics
|    |
|    +-- Spending charts
|    +-- Category analysis
|
+-- Profile
|    |
|    +-- Budget
|    +-- Currency
|    +-- Avatar
|
+-- Login
```

---

## <img src="https://api.iconify.design/lucide:lightbulb.svg?color=%23ffffff" width="20" height="20" valign="middle"> Why Nory?

Traditional expense trackers often require users to manually enter and categorize every transaction.

Nory takes a different approach:

```text
Traditional

Enter title
     |
Enter amount
     |
Choose category
     |
Save
```

```text
Nory

Describe your expense
        |
        v
     Gemini AI
        |
        v
Structured Expense
        |
        v
       Save
```

The result is a faster and more natural way to keep track of everyday spending.

---

## <img src="https://api.iconify.design/lucide:map.svg?color=%23ffffff" width="20" height="20" valign="middle"> Roadmap

Potential future improvements:

* [ ] More advanced AI financial analysis
* [ ] Monthly financial reports
* [ ] Recurring expenses
* [ ] Income tracking
* [ ] Savings goals
* [ ] Budget alerts
* [ ] More detailed analytics
* [ ] Multi-account support
* [ ] Cloud synchronization
* [ ] Improved offline support
* [ ] More AI-powered financial recommendations

---

## <img src="https://api.iconify.design/lucide:code-2.svg?color=%23ffffff" width="20" height="20" valign="middle"> Philosophy

Nory is built around three principles:

```text
        Simple
          |
          v
      Track Money
          |
          v
       Understand
          |
          v
       Improve
```

The application should make financial awareness easier without making users feel like they are managing a spreadsheet.

---

## <img src="https://api.iconify.design/lucide:github.svg?color=%23ffffff" width="20" height="20" valign="middle"> Repository

[PUKAN223/NoryProject](https://github.com/PUKAN223/NoryProject)

---

## <img src="https://api.iconify.design/lucide:globe.svg?color=%23ffffff" width="20" height="20" valign="middle"> Live Demo

[Nory](https://nory-project.vercel.app/)

---

## <img src="https://api.iconify.design/lucide:scale.svg?color=%23ffffff" width="20" height="20" valign="middle"> License

Nory is licensed under the MIT License.

[1]: https://github.com/PUKAN223/NoryProject "GitHub - PUKAN223/NoryProject · GitHub"
