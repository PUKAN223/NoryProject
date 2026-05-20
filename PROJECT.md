# Project.md

# AI Expense Tracker PWA

A modern AI-powered expense tracking Progressive Web App focused on ultra-fast daily expense logging with beautiful UI/UX and minimal friction.

---

# Vision

Create a finance app that feels simple, calming, and enjoyable to use every day.

The app should not feel like traditional accounting software.
It should feel lightweight, modern, human, and fast.

Users should be able to:

* Open the app instantly
* Add expenses within seconds
* Understand spending behavior visually
* Feel motivated to continue using the app daily

The product should focus heavily on:

* Clean UI
* Excellent UX
* Mobile-first experience
* Smooth animations
* Simplicity
* Accessibility
* Emotional design

---

# Core Philosophy

## Fast

Every important interaction should take:

* less than 2 taps
* less than 3 seconds

---

## Minimal

Avoid clutter.

Do not overload users with:

* complex dashboards
* accounting terminology
* too many buttons
* dense tables

Use whitespace intentionally.

---

## Human

The app should feel supportive, not robotic.

Examples:

* “You spent a little more on delivery this week 👀”
* “Nice job staying under budget today 🎉”

---

# UI / UX Direction

## Design Goals

The interface must feel:

* premium
* modern
* calming
* lightweight
* highly readable

---

# Visual Style

## Theme

* Dark mode first
* Soft neutral colors
* Low visual noise
* Smooth shadows
* Rounded corners
* Clean typography

---

## UI Characteristics

* Glassmorphism
* Floating cards
* Blur backgrounds
* Soft gradients
* Minimal borders
* Smooth transitions
* Subtle motion

---

## Inspiration

* Linear
* Notion
* Apple Wallet
* Monny
* Arc Browser

---

# UX Rules

## Thumb Friendly

Design primarily for one-hand mobile usage.

Important actions must remain reachable using the thumb.

---

## Large Touch Targets

Buttons and interactive elements should feel comfortable on mobile.

Avoid tiny icons or cramped layouts.

---

## Reduced Cognitive Load

Users should never feel overwhelmed.

Prioritize:

* visual hierarchy
* spacing
* clear typography
* simple interactions

---

## Minimal Inputs

Reduce typing whenever possible.

Examples:

* automatic amount detection
* AI category detection
* quick suggestions
* smart defaults

---

# Core Features

## 1. Quick Expense Add

Primary feature of the app.

Users type naturally:

* “ชาเขียว 45”
* “หมูกระทะ 399”

The system automatically:

* extracts amount
* detects category
* saves expense quickly

Flow should feel instant.

---

## 2. Dashboard

Simple overview of daily finances.

Display:

* remaining daily budget
* today's spending
* recent expenses
* quick insights

Avoid information overload.

---

## 3. Timeline

Modern scrolling expense history.

Each item should include:

* emoji/category icon
* title
* amount
* timestamp

Timeline should feel lightweight and readable.

---

## 4. Analytics

Visualize spending behavior clearly.

Include:

* category charts
* daily spending graph
* spending trends
* AI insights

Focus on readability over complexity.

---

## 5. Gamification

Encourage consistency without feeling childish.

Examples:

* streaks
* badges
* progress indicators
* budget achievements

---

# AI Integration

AI should assist users quietly in the background.

Do NOT build a complicated chatbot experience.

AI responsibilities:

* categorize expenses
* summarize spending
* detect spending patterns
* generate lightweight insights

---

# Performance Goals

The app must feel extremely responsive.

Targets:

* instant navigation
* optimistic UI updates
* lightweight animations
* offline support
* fast loading on mobile networks

---

# PWA Goals

The application should behave like a native app.

Requirements:

* installable
* offline capable
* splash screen support
* home screen support
* smooth transitions

---

# Technical Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Framer Motion

---

## Backend

* Next.js Route Handlers
* Server Actions

---

## Database

* Supabase PostgreSQL

---

## AI

* Gemini Flash
  or
* OpenRouter

---

# Architecture Goals

Prioritize:

* maintainability
* scalability
* modular structure
* reusable components

Avoid:

* overengineering
* unnecessary microservices
* overly complex state management

---

# Component Principles

Reusable UI components should be:

* visually consistent
* accessible
* responsive
* animation friendly

Examples:

* ExpenseCard
* QuickAddSheet
* AnalyticsCard
* BottomNavbar
* AIInsightCard

---

# Accessibility

Ensure:

* readable font sizes
* sufficient contrast
* keyboard accessibility
* screen reader support
* reduced motion compatibility

---

# Mobile-First Development

Design for:

* 390px width first

Desktop support is secondary.

---

# Emotional Experience

The app should make users feel:

* calm
* organized
* in control
* motivated

Avoid making users feel guilty or stressed about spending.

---

# Final Product Goal

Build an expense tracking experience that users genuinely enjoy opening every day.

The product should combine:

* beautiful UI
* thoughtful UX
* intelligent automation
* emotional simplicity
* premium feel
