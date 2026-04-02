# 🛒 MO Marketplace Web

## 📌 Overview
MO Marketplace Web is a modern e-commerce-style web application built using Next.js. It allows users to browse products, select variants (such as size or color), and perform quick purchases through a streamlined interface.

This project demonstrates component-based architecture, state management, and a clean UI/UX approach within a short development scope.

---

## 🚀 Features

- 🔐 User Authentication (Login & Register)
- 🛍️ Product Listing Page
- 📄 Product Detail View
- 🎯 Variant Selection (e.g., size, color)
- ⚡ Quick Buy Functionality
- 🎨 Reusable UI Components
- 📱 Responsive Design

---

## 🧱 Component Structure

The application is structured using reusable and modular components:

- **Layout Components**
  - Navbar
  - AuthProvider (handles authentication state)

- **Product Components**
  - ProductCard
  - VariantSelector
  - QuickBuyBtn

- **UI Components**
  - Button
  - Input
  - Badge
  - Skeleton Loader

---

## 🧠 State Management Approach

- Global authentication state is managed using a centralized store (`authStore`)
- Component-level state is used for:
  - Variant selection
  - UI interactions
- API interactions are handled through a dedicated `lib/api.ts` layer

---

## ⚙️ Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Custom store (lightweight)
- **API Handling:** Fetch-based utility layer

---

## 🛠️ Setup Instructions

### 1. Clone the repository

git clone https://github.com/mohamedrimsan/mo-marketplace-web.git
cd mo-marketplace-web

### 2. Install dependencies
npm install

### 3. Configure environment variables

Create a .env.local file:

NEXT_PUBLIC_API_URL=your_api_url_here

(Refer to .env.local.example)

### 4. Run the development server
npm run dev

App will run on:

http://localhost:3000

🌐 Live Demo

Link:

🧪 Assumptions

Users must be authenticated to perform purchases
Product data is assumed to be valid and available from API
Variant data is pre-defined per product

⚠️ Known Limitations

No real payment gateway integration
Limited error handling for API failures
No advanced filtering or search functionality
Minimal form validation

📂 Project Structure
app/
  (auth)/
  products/
components/
  layout/
  products/
  ui/
lib/
store/
types/

🚀 Deployment

The app is deployed using Vercel.

Steps:
Import repository into Vercel

Set environment variable:

NEXT_PUBLIC_API_URL
Deploy

🎥 Demo Video

Link: 

The demo includes:

Login flow
Product browsing
Variant selection
Quick Buy process
Brief explanation of architecture and state management
✨ Future Improvements
Add cart functionality
Integrate payment gateway
Improve error handling
Add product search & filtering
Enhance UI animations
👤 Author

Mohamed Rimsan

📄 License

This project is for educational and assessment purposes.


---

# 🔥 What You Should Do Now
1. Paste this into your `README.md`
2. Replace:
   - Live URL:
   - Demo video link:
3. Push:

```bash
git add README.md
git commit -m "docs: add professional README"
git push