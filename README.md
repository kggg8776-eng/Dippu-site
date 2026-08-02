# WhatsApp Product Shop

A simple, modern product catalog where you can add products and customers can order them through WhatsApp.

## Features

- **Admin page** — add, view, and delete products. Set your store name, WhatsApp number, and currency.
- **Product catalog** — searchable, category-filtered grid for customers.
- **WhatsApp ordering** — clicking "Order on WhatsApp" opens a pre-filled WhatsApp message with product details, quantity, total price, and customer notes.
- **Local persistence** — products and settings are saved in the browser's `localStorage`.

## Tech stack

- React + Vite
- Tailwind CSS
- Lucide icons

## Getting started

1. Open a terminal in this folder:

```bash
cd /Users/khanik.goyal/CascadeProjects/whatsapp-product-shop
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open the URL shown (usually `http://localhost:5173`) in your browser.

## How to use

1. Click **Admin** in the top-right corner.
2. Enter your **WhatsApp number** with country code (e.g. `919876543210` for India).
3. Add products with name, price, description, category, and an image URL.
4. Switch back to **Store**.
5. Customers can search/filter, click a product, fill their name and quantity, and then click **Continue to WhatsApp** to open WhatsApp with a pre-filled order message.

## Build for production

```bash
npm run build
```

The static files will be in the `dist/` folder and can be deployed to any static host (Netlify, Vercel, GitHub Pages, etc.).
