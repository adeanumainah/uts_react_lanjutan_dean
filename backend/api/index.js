import express from "express";
import cors from "cors";
import connection from "./db.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

/* ================= MIDDLEWARE ================= */

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

/* ================= TEST API ================= */

app.get("/", (req, res) => {
  res.send("API UTS React berjalan...");
});

/* ================= REGISTER ================= */

app.post("/api/register", async (req, res) => {
  const { gmail, username, password } = req.body;

  if (!gmail || !username || !password) {
    return res.status(400).json({
      message: "Semua field wajib diisi",
    });
  }

  try {
    const checkUser = await connection.query(
      "SELECT * FROM users WHERE username=$1 OR gmail=$2",
      [username, gmail]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({
        message: "Username atau gmail sudah digunakan",
      });
    }

    const hashedPassword = await argon2.hash(password);

    const result = await connection.query(
      `INSERT INTO users (gmail,username,password)
       VALUES ($1,$2,$3)
       RETURNING id,gmail,username`,
      [gmail, username, hashedPassword]
    );

    res.status(201).json({
      message: "Registrasi berhasil",
      user: result.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      message: "Error register",
      error: error.message,
    });
  }
});

/* ================= LOGIN ================= */

app.post("/api/login", async (req, res) => {

  if (!req.body) {
    return res.status(400).json({
      message: "Body tidak boleh kosong"
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username dan password wajib diisi"
    });
  }

  try {

    const result = await connection.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan"
      });
    }

    const user = result.rows[0];

    const validPassword = await argon2.verify(
      user.password,
      password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Password salah"
      });
    }

    const payload = {
      id: user.id,
      username: user.username,
      gmail: user.gmail
    };

    const token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.json({
      message: "Login berhasil",
      token
    });

  } catch (error) {
    res.status(500).json({
      message: "Error login",
      error: error.message
    });
  }

});

/* ================= PROFILE ================= */

app.get("/api/profile", verifyToken, async (req, res) => {

  try {

    const { id } = req.user;

    const result = await connection.query(
      "SELECT gmail,username FROM users WHERE id=$1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json({
      message: "Access granted",
      user: result.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      message: "Error profile",
      error: error.message,
    });
  }

});

/* ================= GET ALL MAHASISWA ================= */

app.get("/api/mahasiswa", verifyToken, async (req, res) => {

  try {

    const result = await connection.query(
      "SELECT * FROM mhs_tb ORDER BY id ASC"
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }

});

/* ================= ADD MAHASISWA ================= */

app.post("/api/mahasiswa", verifyToken, async (req, res) => {

  const { name, nim, jurusan, ipk, isactive } = req.body;

  try {

    const result = await connection.query(
      `INSERT INTO mhs_tb
       (name,nim,jurusan,ipk,isactive)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [name, nim, jurusan, ipk, isactive]
    );

    res.status(200).json({
      message: "Mahasiswa berhasil ditambahkan",
      mahasiswa: result.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }

});

/* ================= UPDATE MAHASISWA ================= */

app.put("/api/mahasiswa/:id", verifyToken, async (req, res) => {

  const { id } = req.params;
  const { name, nim, jurusan, ipk, isactive } = req.body;

  try {

    const result = await connection.query(
      `UPDATE mhs_tb
       SET name=$1,nim=$2,jurusan=$3,ipk=$4,isactive=$5
       WHERE id=$6
       RETURNING *`,
      [name, nim, jurusan, ipk, isactive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Mahasiswa tidak ditemukan",
      });
    }

    res.json({
      message: "Mahasiswa berhasil diupdate",
      mahasiswa: result.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }

});

/* ================= DELETE MAHASISWA ================= */

app.delete("/api/mahasiswa/:id", verifyToken, async (req, res) => {

  const { id } = req.params;

  try {

    const result = await connection.query(
      "DELETE FROM mhs_tb WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Mahasiswa tidak ditemukan",
      });
    }

    res.json({
      message: "Mahasiswa berhasil dihapus",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }

});

/* ================= UPDATE STATUS ================= */

app.patch("/api/mahasiswa/:id/status", verifyToken, async (req, res) => {

  const { id } = req.params;
  const { isactive } = req.body;

  try {

    const result = await connection.query(
      `UPDATE mhs_tb
       SET isactive=$1
       WHERE id=$2
       RETURNING *`,
      [isactive, id]
    );

    res.json({
      message: "Status mahasiswa berhasil diubah",
      mahasiswa: result.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }

});

/* ================= LOGOUT ================= */

app.post("/api/logout", (req, res) => {

  res.clearCookie("token");

  res.json({
    message: "Logout berhasil",
  });

});

/* ================= START SERVER ================= */

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

export default app;