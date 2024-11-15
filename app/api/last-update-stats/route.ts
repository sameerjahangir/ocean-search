import { NextResponse } from "next/server";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

export async function GET() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "5432"),
  });

  try {
    const client = await pool.connect();

    const query = `
        SELECT *
        FROM last_stats_update
        ORDER BY created_at DESC
        LIMIT 1;
        `;

    const result = await client.query(query);
    client.release();

    // Sending the result directly from the query
    return NextResponse.json(result.rows[0]);  // Only the first row (most recent)

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
