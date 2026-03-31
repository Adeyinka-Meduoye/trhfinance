import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/login", (req, res) => {
    const { username, passcode } = req.body;
    const correctPasscode = process.env.ADMIN_PASSCODE || "trhfin";
    
    // Allowed users list (from env var or fallback to hardcoded list)
    const allowedUsersEnv = process.env.ALLOWED_USERS;
    const allowedUsers = allowedUsersEnv 
      ? allowedUsersEnv.split(',').map(u => u.trim())
      : [
          "Admin",
          "Finance",
          "Simon Priestley",
          "Medus"
        ];

    if (!username || !passcode) {
      return res.status(400).json({ success: false, message: "Username and passcode are required" });
    }

    // Check passcode
    if (passcode !== correctPasscode) {
      return res.status(401).json({ success: false, message: "Incorrect passcode" });
    }

    // Check username (case-insensitive)
    const matchedUser = allowedUsers.find(u => u.toLowerCase() === username.trim().toLowerCase());

    if (!matchedUser) {
      return res.status(403).json({ success: false, message: "Login not authorised" });
    }

    res.json({ success: true, username: matchedUser });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
