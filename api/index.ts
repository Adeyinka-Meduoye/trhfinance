import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
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

export default app;
