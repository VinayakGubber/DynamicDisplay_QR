require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ───────────────  MIDDLEWARE  ─────────────── */

app.use(cors());
app.use(express.json());

/* ───────────────  HEALTH CHECK  ───────────── */

app.get("/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1; // 0 = disconnected, 1 = connected
  res.json({ ok: true, dbConnected });
});

/* ───────────────  STARTUP  ───────────── */
/* function to start the server and establish connection to db */

async function start() {
  try {
    const url = process.env.MONGODB_URL;
    if (!url) {
      console.error("Error : MONGODB_URL missing in .env XX");
      process.exit(1);
    }

    /* Connect to MongoDb (mongoose handles pooling and reconnection) */
    await mongoose.connect(url);
    console.log("----------------------");
    console.log("");

    console.log("Mongo Db connected !!");

    const port = process.env.PORT || 2000;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port} `);
    });
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}
/*connects to MongoDB first, then starts the server if successful — ensures server won’t accept requests until DB is reachable. */
start();
