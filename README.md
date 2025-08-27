# Reflections – AI-Powered Journal with Insights

A minimal journaling web app with **AI-powered insights**, designed to provide a simple, modern, and responsive writing experience. Built with **React (TypeScript)** and **Firebase**, and enhanced with **Llama 3** for personalized insights.  

---

## Features

- **AI-Powered Assistance**
  - Automatic title generator for entries  
  - AI-generated insights with mood and tag suggestions  

- **Statistics & Visualization**
  - Mood dashboard with pie charts (Recharts)  
  - Additional stats: *Most Logged Mood*, *Streak*, *Total Entries*  

- **User Experience**
  - Smooth animations with Framer Motion  
  - Dark & light theme support  
  - Fully responsive design  

- **Backend & Auth**
  - Firebase authentication (secure login)  
  - Firestore database for entries and stats  

---

## Tech Stack

- **Frontend**: React + TypeScript  
- **Backend/Database**: Firebase (Auth, Firestore)  
- **AI Integration**: Llama 3  
- **UI/UX**: Framer Motion, Recharts  

---

## Getting Started

### Prerequisites
- Node.js (v16 or above)  
- Firebase project setup (with Firestore & Authentication enabled)  
- API access to any AI

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AI-Powered-Journaling-App/Reflections.git
   cd reflections
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:

4. Run the development server:
   ```bash
   npm run dev
   ```
---

## Folder Structure

```
reflections/
│── public/                # Static assets
│── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components
│   ├── styles/            # CSS files (dark/light theme support)
│   ├── utils/             # Utility functions (AI, Firebase, helpers)
│   ├── firebase.ts        # Firebase config
│   └── App.tsx            # Main entry point
│── package.json
│── README.md
```

---
