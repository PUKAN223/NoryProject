# Nory 💸✨

Nory is a modern, AI-powered Progressive Web App (PWA) for expense tracking. Designed with a premium mobile-first UI, Nory leverages the power of Google's Gemini AI to make tracking your daily finances effortless and insightful.

## ✨ Features

- **🤖 AI-Powered Smart Parsing**: No more manual categorization. Just type natural language like `"ซื้อกาแฟและขนม 120"` and Nory's AI automatically extracts the title, amount, and categorizes it instantly.
- **💡 AI Financial Advisor**: Get personalized, encouraging financial tips and insights on your dashboard based on your recent spending habits.
- **📱 Mobile-First & PWA**: Installable on iOS and Android. Features native-like interactions including **Swipe-to-Delete** using Framer Motion.
- **📊 Analytics & Insights**: Interactive 7-day spending charts and category breakdowns.
- **🎨 Premium UI/UX**: Beautiful glassmorphism, smooth micro-animations, and full support for Dark and Light modes.
- **👤 Profile Management**: Set your daily budget, choose your currency, and upload a custom avatar (stored securely via base64).
- **🔒 Secure Authentication**: Custom JWT-based authentication using HTTP-only cookies for maximum security.

## 🛠 Tech Stack

- **Framework**: [Next.js 14/15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Supabase](https://supabase.com/))
- **ORM**: [Prisma v5](https://www.prisma.io/)
- **AI Integration**: [@google/genai](https://github.com/google/generative-ai-js) (Gemini 2.5 Flash model)
- **Auth**: Custom JWT (`jose`) with Proxy API

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (or Node.js/npm)
- A PostgreSQL database (e.g., Supabase)
- A Google Gemini API Key (get it from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nory.git
   cd nory
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   # Database connection string
   DATABASE_URL="postgres://[db-user]:[password]@[host]:[port]/[db-name]"
   
   # JWT Secret for Auth sessions
   JWT_SECRET="your_super_secret_jwt_key_here"
   
   # Gemini API Key for AI features
   GEMINI_API_KEY="your_gemini_api_key_here"
   ```

4. **Initialize the Database**
   Push the Prisma schema to your database:
   ```bash
   bunx prisma db push
   ```

5. **Run the Development Server**
   ```bash
   bun run dev
   ```
   Nory should now be running on `http://localhost:3000`.

## 📂 Project Structure

- `src/app/` - Next.js App Router pages (Home, Login, Analytics, Profile, Timeline)
- `src/app/actions/` - Next.js Server Actions (Database queries, AI fetching, Auth logic)
- `src/components/` - Reusable React components (`AppShell`, `ExpenseItem`, etc.)
- `src/context/` - React Context providers for global state (`ExpenseContext`, `AuthContext`, `ThemeContext`)
- `prisma/` - Prisma schema definitions
- `public/` - Static assets and PWA Service Worker (`sw.js`)

## 📄 License

This project is licensed under the MIT License.
