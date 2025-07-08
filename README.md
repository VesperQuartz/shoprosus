# Shoprosus

Shoprosus is an AI-powered restaurant ordering platform that helps users discover restaurants, browse menus, manage their orders, and receive personalized dietary suggestions. The platform leverages a knowledge graph (Neo4j) and a conversational AI assistant powered by the Llama3-70b-8192 model to provide a smart, safe, and delightful food ordering experience.

---

## Features

- **Conversational AI Assistant**  
  Users interact with a friendly AI assistant that can:

  - List available restaurants
  - Show menus for specific restaurants
  - Add or remove items from the cart
  - Display the current cart
  - Generate payment links for checkout
  - Update user preferences and dietary restrictions
  - Provide personalized food and restaurant recommendations

- **Personalization with Knowledge Graph (Neo4j)**

  - User preferences, allergies, and order history are stored in a Neo4j knowledge graph.
  - The AI assistant uses this data to suggest menu items that fit the user's dietary needs and avoid allergens.
  - The system learns from user interactions and updates the knowledge graph for even better future recommendations.

- **Modern Web Stack**
  - Built with Next.js, React, and Hono for the API layer
  - Uses Drizzle ORM for database access and Neo4j for graph-based personalization
  - Real-time, streaming AI responses via the `ai` SDK and the Llama3-70b-8192 LLM (via Groq)

---

## How It Works

1. **User Interaction**  
   Users chat with the AI assistant to find restaurants, browse menus, and manage their cart.

2. **Smart Tooling**  
   The AI assistant has access to backend tools (APIs) for:

   - Fetching restaurants and menus
   - Adding/removing items from the cart
   - Checking out and processing payments
   - Updating and retrieving user preferences

3. **Personalized Dietary Suggestions**

   - The assistant checks the user's allergies and dietary restrictions before making food suggestions.
   - Menu recommendations are generated using the Neo4j knowledge graph, ensuring safety and personalization.

4. **Continuous Learning**
   - As users interact, the system updates their profile in Neo4j, learning about new preferences, restrictions, and order patterns.

---

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Project Structure

- `app/` — Next.js app directory (frontend and API routes)
- `agents/` — AI assistant tool definitions and UI integrations
- `services/` — Business logic, including Neo4j knowledge graph integration
- `components/` — Reusable UI components
- `lib/` — Auth, database, and utility libraries

---

## Technologies Used

- **Next.js** — React framework for web apps
- **React** — UI library
- **Hono** — Lightweight API framework
- **Neo4j** — Graph database for personalization
- **Drizzle ORM** — TypeScript ORM for SQL databases
- **Llama3-70b-8192 (Groq)** — Large Language Model for conversational AI
- **Paystack** — Payment processing

---

## Purpose

Shoprosus aims to make food ordering safer, smarter, and more enjoyable by combining conversational AI with a knowledge graph.  
It is especially useful for users with dietary restrictions, allergies, or specific food preferences, ensuring every recommendation is both relevant and safe.

---

## Contributing

Contributions are welcome! Please open issues or pull requests for improvements, bug fixes, or new features.

---

## License

MIT
