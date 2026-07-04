# 🌿 AgriVerse — Smart AI Agriculture Suite

<div align="center">
  <img src="./public/logo.png" alt="AgriVerse Logo" width="120" height="120" style="border-radius: 20%;" />
  <p align="center">
    <strong>An advanced, localized AI companion for maximizing crop productivity, forecasting market prices, and diagnosing crop pathology.</strong>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Framework-TanStack%20Start-FF4154?style=for-the-badge&logo=react" alt="TanStack Start" />
    <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
    <img src="https://img.shields.io/badge/AI-Gemini%202.5%20Flash-F9A825?style=for-the-badge&logo=google-gemini" alt="Gemini" />
  </p>
</div>

---

## 🚀 Key Modules & Features

### 1. 🔍 Disease Detection System
* **Hybrid Diagnostics**: Diagnose plant issues using **images (photos of leaves)**, **textual symptom descriptions**, or **both together**.
* **Pathologist Remedies**: Real-time diagnostic reports outlining the disease name, causes (**How it comes**), treatments (**Solution to clear this**), and prevention (**How to prevent for future**).
* **Tamil Nadu & Kongu Focused**: AI recommendations explicitly specify medicines (fungicides/pesticides) alongside localized organic manures (such as **Panchagavya**, **neem cake manure**, and **vermicompost**).

### 2. 📈 Crop Price Prediction System
* **Tamil Nadu Crop Catalog**: Built-in historical and predictive pricing datasets for major state crops:
  * 🌾 **Rice/Paddy (Nel)**
  * 🍯 **Turmeric (Manjal)**
  * 🥥 **Coconut (Thengai)**
  * 🪵 **Tapioca (Maravalli)**
  * 🌾 **Sugarcane (Karumbu)**
  * 🍌 **Banana (Vazhai)**
  * 🥭 **Mango (Maambazham)**
  * 🥜 **Groundnut (Kadalai)**
  * 🌽 **Maize (Cholam)**
  * 🌶️ **Chilli (Milagai)**
* **Interactive Forecasting**: Adjust expected supply changes (+/- %) to simulate wholesale rate variations (₹/quintal) dynamically plotted using responsive charts.

### 3. 💬 AI Smart Farming Assistant Chatbot
* **Interactive Agronomist**: Ask questions about crop rotation, NPK calculations, irrigation schedules, or weed management.
* **Neat & Structured Layouts**: Outputs are formatted into clean, bold headers and bullet points rather than essay-long blocks.
* **Tamil Translation Hook**: Auto-translates crop and botanical names to Tamil in parentheses (e.g. *Paddy (நெல்)*) for high local readability, completely avoiding Hindi terms.

### 4. 🌦️ Localized Weather & IoT Systems
* **Auto-Geolocation**: Instantly requests GPS coordinate permission on load to fetch local forecasts, defaulting to Coimbatore coordinates (representing the Kongu region).
* **Smart Motor Controls**: IoT simulation to monitor and toggle water pump motor status remotely.

### 5. 🔐 Secure Profiles & Authentication
* **Enhanced Visual Verification**: A clean, premium glassmorphism auth page with confirm-password checks.
* **Hashed Credentials**: Automatically hashes user passwords with SHA-256 client-side before inserting them into a public `profiles` table in Supabase.

---

## 🛠️ Technology Stack
* **App Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (React + Vinxi Server Functions + Nitro Server)
* **Styling**: Vanilla CSS (Premium TailwindCSS integration)
* **Visuals & Charts**: [Recharts](https://recharts.org/) & Lucide React
* **Backend Database & Auth**: [Supabase](https://supabase.com/)
* **AI Model Engine**: [Google Gemini 2.5 Flash API](https://ai.google.dev/)

---

## 💻 Local Quickstart

### Option A: Using Docker (Recommended)
1. Ensure Docker is running.
2. Build and launch the container:
   ```bash
   docker compose build
   docker compose up -d
   ```
3. Open **`http://localhost:3001`** in your browser.

### Option B: Node / Bun Local Server
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory:
   ```env
   # Supabase Credentials
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Gemini AI API Key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web app at **`http://localhost:3000`**.

---

## 🌐 Deploying to Vercel via GitHub

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import the `AgriVerse` repository.
4. **Configure Project Settings**:
   * **Framework Preset**: Select **Vite** or leave it as **Other (Auto-detected)**.
   * **Build Command**: `npm run build`
   * **Output Directory**: `.vercel/output` (Nitro auto-builds here).
5. **Environment Variables**: Add your `GEMINI_API_KEY`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` to the Vercel variables section.
6. Click **Deploy**!

---

<div align="center">
  <p>Developed with ❤️ for agricultural productivity in Tamil Nadu.</p>
</div>
