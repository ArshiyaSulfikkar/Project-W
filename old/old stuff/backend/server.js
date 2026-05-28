require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* --------------------
   HOUSEHOLD SIGNUP
-------------------- */

app.post("/api/signup", async (req, res) => {
  const d = req.body;

  try {
    const check = await pool.query(
      "SELECT household_id FROM households WHERE contact_phone=$1",
      [d.phone]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({ error: "exists" });
    }

    await pool.query(`
      INSERT INTO households
      (ward_id, household_name, address_line1, city, state, contact_phone, password)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
    `, [
      1,
      d.name,
      d.location,
      "Kerala",
      "Kerala",
      d.phone,
      d.password
    ]);

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server" });
  }
});

/* --------------------
   HOUSEHOLD LOGIN
-------------------- */

app.post("/api/login/household", async (req, res) => {
  const d = req.body;

  try {
    const result = await pool.query(`
      SELECT household_id FROM households
      WHERE contact_phone=$1 AND password=$2
    `, [d.phone, d.password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "invalid" });
    }

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: "server" });
  }
});

/* --------------------
   COLLECTOR LOGIN
-------------------- */

app.post("/api/login/collector", async (req, res) => {
  const d = req.body;

  try {
    const result = await pool.query(`
      SELECT worker_id FROM workers
      WHERE phone=$1 AND password=$2
    `, [d.phone, d.password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "invalid" });
    }

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: "server" });
  }
});

/* --------------------
   DISTRICTS
-------------------- */

app.get("/api/districts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM districts_cities");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "server" });
  }
});

/* --------------------
   PICKUP REQUEST
-------------------- */

app.post("/api/pickup-request", async (req, res) => {
  const data = req.body;

  if (!data.household_id) {
    return res.status(400).json({ error: "Missing household" });
  }

  try {
    await pool.query(`
      INSERT INTO pickup_requests
      (household_id, request_date, status, notes)
      VALUES ($1, CURRENT_DATE, 'requested', $2)
    `, [data.household_id, data.notes]);

    res.json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: "server" });
  }
});

/* -------------------- */

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW()");
    res.json(r.rows);
  } catch (e) {
    console.error("DB ERROR:", e);
    res.status(500).json({ error: "db failed" });
  }
});