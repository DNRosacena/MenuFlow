# MenuFlow 🍽️

A modern, full-featured digital menu and restaurant management web app — built with React, Vite, and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)

---

## ✨ Features

### 🧑‍🍽️ Customer View
- **Full-screen Landing Page** — Immersive hero with restaurant imagery and an "Order Now" call-to-action
- **Digital Menu** — Browse items by category with food photography, tags, and pricing
- **Inline Cart Controls** — Add, adjust quantity, and remove items directly from the menu cards
- **Order Cart Drawer** — Slide-in cart with item thumbnails, running total, and table number input
- **Confetti on Order** — Celebratory animation when an order is successfully placed

### 👨‍🍳 Staff View
- **Live Order Queue** — Real-time order cards with table info, items, and timestamps
- **Status Management** — Progress orders through Pending → Cooking → Done
- **Filter by Status** — View all, pending, cooking, or completed orders at a glance
- **Time Tracking** — See how long ago each order was placed

### ⚙️ Admin Panel
- **Menu Editor** — Add, edit, delete, and toggle availability of menu items
- **Image Support** — Paste any image URL with a live preview before saving
- **Category & Tag System** — Organize items and highlight popular, new, or vegetarian options
- **Sales Dashboard** — Track total revenue, today's revenue, order counts, and a cumulative revenue chart
- **Recent Orders Log** — Full order history with table, items, total, status, and timestamp

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + CSS Variables |
| Fonts | Google Fonts (Playfair Display + DM Sans) |
| Animations | canvas-confetti + CSS keyframes |
| Charts | Pure SVG (no extra library) |
| State | React useState (no backend) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/menuflow.git

# Navigate into the project
cd menuflow

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy.

---

## 📁 Project Structure

```
menuflow/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx     # Full-screen hero with Order Now CTA
│   │   ├── Navbar.jsx          # Sticky nav with view switcher + order badge
│   │   ├── MenuView.jsx        # Customer menu with cart drawer
│   │   ├── OrdersView.jsx      # Staff order queue with status controls
│   │   └── AdminPanel.jsx      # Menu editor + sales dashboard
│   ├── data/
│   │   └── defaultMenu.js      # Sample menu items with images
│   ├── App.jsx                 # Root layout + shared state
│   ├── App.css                 # Component styles + utility classes
│   ├── index.css               # Global styles + CSS variables
│   └── main.jsx                # Entry point
├── public/
│   └── favicon.svg
├── index.html
├── tailwind.config.js
└── package.json
```

---

## ⚙️ Customization

### Changing the Restaurant Name & Branding
Update the logo and name in `src/components/Navbar.jsx` and `src/components/LandingPage.jsx`.

### Updating the Hero Image
In `src/components/LandingPage.jsx`, replace the `backgroundImage` URL:
```jsx
backgroundImage: "url('YOUR_IMAGE_URL_HERE')",
```

### Adding Menu Items
Use the **Admin Panel** in the app to add items with name, description, price, category, tag, and image URL. Changes persist in-session.

To set permanent default items, edit `src/data/defaultMenu.js`.

### Adjusting Colors
All colors are CSS variables in `src/index.css`:
```css
:root {
  --accent: #ff6b35;   /* Primary orange */
  --accent2: #2d6a4f;  /* Green for available/vegetarian */
  ...
}
```

---

## 🌐 Deployment

Optimized for **Vercel**:

1. Push your code to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Select **Vite** as the preset
5. Click **Deploy**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Daxen Nathamiel Rosacena**
- GitHub: [@DNRosacena](https://github.com/DNRosacena)

---

> Built as part of a 10-project freelance portfolio series.
