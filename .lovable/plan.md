
# Zockto — AI Video Generation Platform

## Overview
A modern SaaS-style website for Zockto, an AI-powered video generation platform built as a college project under SCSIT, DAVV Indore. Dark/light mode, purple/blue gradient theme, glassmorphism, smooth animations.

## Pages

### 1. Landing Page (/)
- **Hero Section** — "Create AI Videos Without Shooting" with gradient text, abstract AI-themed background, CTAs ("Try Zockto" → /create, "See How It Works" → scroll)
- **About College Section** — SCSIT DAVV info, programs (MCA, M.Tech), credibility badges (UGC, AICTE, DRDO)
- **Project Guide Section** — Dr. Ugrasen Suman card with role info
- **What is Zockto** — Simple explanation + 4 benefit cards (no filming, AI visuals, fast, easy)
- **How It Works** — 5-step visual flow (Upload → Style → Voice → Script → Generate)
- **Features Section** — 4 feature cards with icons
- **CTA Section** — "Start Creating Your AI Video Now" with gradient button
- **Footer** — Project name, college, guide, nav links

### 2. Create Page (/create)
Multi-step wizard UI:
- **Step 1**: Drag & drop image upload with preview
- **Step 2**: Style selection grid (Studio, Cafe, Outdoor, etc.) with visual cards
- **Step 3**: Voice selection grid (male/female options via Cartesia API)
- **Step 4**: Script textarea (max 1000 chars) with character counter
- **Step 5**: Review & "Generate Video" button
- Loading/processing state with progress indicator after submission
- Webhook-ready structure for backend integration

### 3. Results Page (/results)
- Grid of generated videos (filtered by status === success)
- Video player + download button per card
- Empty state illustration when no videos exist
- Error state UI

## Design System
- **Theme**: Dark/light mode toggle in navbar
- **Colors**: Purple-to-blue gradients as primary accent, dark bg (#0F172A range), glassmorphism cards
- **Typography**: Clean sans-serif, gradient heading text
- **Components**: Rounded cards, frosted glass effects, smooth fade/scale animations
- **Responsive**: Mobile-first, works on all screen sizes

## Shared Components
- Navbar with dark/light toggle + nav links
- Reusable section wrapper with consistent spacing
- Step indicator component for the wizard
- Video card component for results
