# 🐶 DoogieSpotted – Tinder for Dogs

**Find the perfect playdate (or soulmate) for your furry friend!**  
DoogieSpotted is a fun web app that connects dog owners looking for walking buddies, playmates, or even a little puppy love 😉

![](https://github.com/pawel-misztal/DoogieSpotted/blob/bca8265cb2c99c22105076bf3fbcb5624fe11b98/DoggieSpotted.webp)

## 🚀 Features

- User registration and login
- Create detailed dog profiles (photos, breed, description, location)
- Daily matches system based on distance and preferences
- Swipe through dog profiles (like / pass)
- Mutual likes create permanent matches
- Customizable search radius (1–100 km)
- Secure photo management (compression, deletion)
- Responsive and modern UI

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express**
- **Sequelize** ORM + relational database
- Session-based authentication
- Image upload & compression
- Reverse geocoding (city from coordinates)
- Spherical distance calculations

### Frontend
- **React 18** with **TypeScript**
- **React Router DOM** v7
- **Vite** for blazing-fast development
- **Tailwind CSS** with custom theme (Manrope font, custom shadows & colors)
- Experimental React Compiler for optimization

### Other
- WebSocket support (for real-time notifications – WIP)
- Local HTTPS via `vite-plugin-mkcert`

## 📂 Project Structure

```
DoogieSpotted/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Endpoint logic
│   │   ├── models/          # Sequelize models
│   │   ├── middlewares/     # Auth & validation
│   │   ├── utils/           # Helpers (geo, photos, matching)
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # App pages
│   │   └── ...
│   └── tailwind.config.js
└── README.md
```

## 🏃‍♂️ How to Run Locally

### Requirements
- Node.js ≥ 18
- Relational database (PostgreSQL)
- npm or yarn

### Backend
```bash
cd backend
npm install
# Configure .env (DATABASE_URL, SESSION_SECRET, etc.)
npx sequelize db:migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

App available at:

Frontend: https://localhost:3001

Backend API: https://localhost:3000/api

⭐ If you like it, give it a star!
Questions or suggestions? Feel free to open an Issue!

## 🐕 Woof woof! 🐕
