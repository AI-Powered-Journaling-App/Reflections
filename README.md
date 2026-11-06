# Reflections

## Overview
Reflections is an AI-augmented journaling and emotional intelligence platform designed to transform conventional diary entries into actionable mental health insights. By leveraging high-performance large language models (LLMs), the system automates the cognitive load of self-reflection through real-time sentiment analysis, thematic tagging, and therapeutic feedback loops.

The application addresses the "blank page" problem and the lack of structured emotional tracking in traditional journals. Through an intuitive, high-performance interface, users can record their thoughts, while the system asynchronously generates titles, detects emotional states, and provides gentle, clinical-grade suggestions for emotional regulation.

## Architecture
Reflections utilizes a modern, serverless architecture that prioritizes scalability, real-time data consistency, and low-latency intelligence processing.

### Multi-Tier System Design
1.  **Presentation Tier (Frontend)**: A React 19 single-page application (SPA) built with Vite for optimal HMR and build performance. It handles client-side routing, state management, and complex UI animations.
2.  **Intelligence Tier (AI Layer)**: A decoupled integration with the Groq high-performance inference engine. This tier processes natural language input asynchronously to extract structured emotional metadata.
3.  **Data Tier (Backend-as-a-Service)**: Firebase provides the foundational infrastructure, utilizing Google OAuth for secure authentication and Cloud Firestore for document-oriented data persistence.

### Data Flow Pipeline
1.  **Input**: The user authenticates via Google OAuth and creates a rich-text entry.
2.  **Analysis**: The application dispatches the raw text to the Groq API (Llama 3 70B), which performs structured extraction of mood, tags, and insights.
3.  **Persistence**: The original entry and its AI-generated metadata are reconciled and persisted in user-specific Firestore collections.
4.  **Transformation**: The system aggregates historical entry data to generate visual emotional distributions.
5.  **Output**: Users interact with the "Insights" dashboard, viewing their emotional trends and therapeutic feedback.

## Tech Stack
-   **Languages**: TypeScript (Strict-mode)
-   **Frontend**: React 19, Vite
-   **State Management**: React Hooks (useContext, useReducer)
-   **Backend**: Firebase (Authentication, Firestore)
-   **Intelligence Hub**: Groq API (Llama 3 70B)
-   **Visualization**: Recharts (High-performance charting)
-   **Animation Engine**: Framer Motion (60FPS micro-interactions)
-   **Icons**: FontAwesome 6

## Features

### AI-Powered Intelligence Suite
-   **Asynchronous Insight Generation**: Automatically extracts the emotional core of an entry, providing 25-75 word therapeutic reflections that validate the user's state.
-   **Predictive Title Generation**: Uses LLMs to analyze entry content and suggest concise, relevant titles, reducing friction during the journaling process.
-   **Automated Mood Analytics**: Maps entries to a predefined emotional spectrum (Happy, Grateful, Anxious, etc.) with associated color-coding for visual categorization.

### Advanced Data Visualization
-   **Emotional Distribution Charts**: Leverages Recharts to render interactive pie charts representing the user's emotional landscape over time.
-   **Thematic Tagging System**: AI-generated tags enable cross-referential analysis of recurring life themes and stressors.

### Secure & Personalized Environment
-   **Protected Authentication**: Implements a middleware-like routing pattern to ensure data privacy and user-scoped data access.
-   **Dynamic Theme Engine**: A custom CSS variable-driven theme system for optimized visual comfort during day or night usage.

## Folder Structure
```bash
reflections/
├── backend/            # Future server-side expansions
├── public/             # Static assets (favicons, manifest)
├── src/
│   ├── assets/         # Global media and icon assets
│   ├── components/
│   │   ├── charts/     # Recharts implementations (PieCharts, etc.)
│   │   ├── common/     # Reusable UI primitives (Buttons, Notifications)
│   │   ├── entries/    # Entry list and card management components
│   │   ├── forms/      # Input handlers and AI generation triggers
│   │   ├── layout/     # Navigation, Protected Routes, and Providers
│   │   └── ui/         # Highly stylized interface components
│   ├── pages/          # Top-level route components (Home, Login)
│   ├── styles/         # Modular Vanilla CSS architecture
│   ├── utils/          # Business logic (Firebase, AI API, Date helpers)
│   ├── App.tsx         # Main router and provider configuration
│   ├── firebase.ts    # Firebase initialization and service exports
│   └── main.tsx        # Application mount point
├── tsconfig.json       # Strict-type configuration
└── vite.config.ts      # Build pipeline configuration
```

## How It Works

1.  **Authentication**: The user logs in via `Login.tsx`, triggering an OAuth flow via `firebase.ts`.
2.  **Navigation**: Upon successful auth, `ProtectedRoute` hydrates the `Home.tsx` page, granting access to the private state.
3.  **Entry Creation**: Users input text into `AddEntrySection.tsx`.
4.  **Metadata Extraction**: Clicking "AI Insights" invokes `getAiInsights` in `AiInsightsUtils.ts`. This sends a payload to Groq, which returns a structured JSON object containing mood, tags, and insights.
5.  **Storage**: `handleSaveEntry` persists the augmented JSON object to Firestore.
6.  **Refresh**: `YourEntriesSection.tsx` utilizes real-time Firestore listeners or effect-based polling to update the UI with the latest reflection cards.

## Key Implementation Details

### Performance-Optimized Inference
The system uses high-performance inference via Groq (configured with `openai/gpt-oss-120b` by default, alongside an automated fallback cascade including `openai/gpt-oss-20b`, `llama-3.3-70b-versatile`, and `llama-3.1-8b-instant`). This architecture prevents downtime caused by model deprecations and ensures sentiment analysis and title generation occur in sub-500ms intervals.

### Structured JSON Parsing Logic
To prevent crashes from unpredictable LLM outputs, the system enforces `response_format: { type: "json_object" }` on Groq calls, strips code fences, normalizes mood detection against a fixed emotion spectrum, validates tag color contrast, and defaults to safe, calm fallbacks if any field is missing.

### Micro-interaction Design
Using Framer Motion, the entry process features "spring" physics and blurred overlays in `Overlay.css`, creating a premium, tactile experience that feels natural to the user.

## Setup & Installation

### Environment Configuration
Create a `.env` file in the root directory (or inside `reflections/`) and populate the following keys (see `.env.example`):
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_GROQ_API_KEY=your_groq_key
VITE_GROQ_MODEL=openai/gpt-oss-120b
```

### Installation & Local Run
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or inside reflections/:
   cd reflections && npm install
   ```
3. Launch the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Production Deployment

### Option 1: Vercel (Recommended)
1. Push your code to GitHub.
2. In the Vercel Dashboard, click **Add New Project** and import the repository.
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `reflections` (or leave as root, root `vercel.json` will route the build)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` (or `reflections/dist` if root)
4. Under **Environment Variables**, add each of the keys listed above (`VITE_FIREBASE_*`, `VITE_GROQ_*`).
5. Click **Deploy**. Vercel will build and assign a production URL.
6. In **Firebase Console -> Authentication -> Settings -> Authorized Domains**, add your Vercel domain (e.g. `reflections-xxx.vercel.app`) so Google Sign-In and OAuth popup flows work seamlessly.

### Option 2: Render
1. Create a new **Static Site** on Render and connect your repository.
2. Set:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `reflections/dist`
3. Add the environment variables under the Environment tab.
4. Add your Render domain to Firebase Authorized Domains.

## Usage
1. Log in with your Google account or email & password.
2. Select "Add Entry" to begin writing your reflection.
3. Use the "Magic Wand" icon to generate a title or the "AI Insights" button to analyze your text.
4. Save the entry to persist it to your dashboard.
5. Review the "Home" section to see your emotional distribution across all entries.
