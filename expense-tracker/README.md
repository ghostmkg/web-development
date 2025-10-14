# Expense Tracker (Socket.io)

A tiny real-time expense tracker demo using Node.js, Express and Socket.io.

Features
- Add expenses (description + amount)
- Real-time updates between connected clients
- Delete expenses
- Dark / Light theme toggle (saved to localStorage)
- Each expense has an id and timestamp (createdAt)

Files
- `server.js` - Express + Socket.io server. Serves `public/` and holds in-memory `expenses` list.
- `public/index.html` - Main single-page UI.
- `public/style.css` - Basic styling + dark theme.
- `public/app.js` - Client-side Socket.io code that renders expenses, handles add/delete, and saves theme preference.

Quick start
1. Install dependencies

```powershell
npm install
```

2. Start the server

```powershell
node server.js
```

3. Open your browser at `http://localhost:3000` and open multiple windows to see real-time sync.

Notes
- This project uses an in-memory array for expenses. If the server restarts data will be lost. Consider adding a persistent store (SQLite, JSON file, MongoDB) for production use.
- Port: the server listens on `3000` by default. Use `PORT` environment variable to change.

Next improvements
- Add user authentication
- Persist to a small database
- Add editing of existing expenses
- Add basic validation and error handling on the server

License
MIT
