import { NextResponse, NextRequest } from "next/server";
import { Pool } from "pg";
import crypto from "crypto";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "5432"),
  });

  try {
    const { email, password } = await request.json();

    // Hash the incoming password using SHA-1
    const hashedPassword = crypto
      .createHash("sha1")
      .update(password)
      .digest("hex");

    const client = await pool.connect();
    const query = `
      SELECT * FROM users
      WHERE email = $1 AND password = $2
    `;

    const result = await client.query(query, [email, hashedPassword]);
    client.release();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Create a JWT token with 30 days expiration
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "1234", // Use a secure secret from environment variables
      { expiresIn: "30d" } // Set token expiration to 30 days
    );

    // Return the user details along with the access token
    return NextResponse.json({
      user,
      accessToken: token,
    });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}
