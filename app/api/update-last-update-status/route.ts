import { NextResponse, NextRequest} from "next/server";
import { Pool } from "pg";

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
    const { id, status } = await request.json(); // Receive id and status from the request

    const client = await pool.connect();
    const query = `
      UPDATE last_stats_update
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;

    const result = await client.query(query, [status, id]);
    client.release();

    // Return the updated record
    return NextResponse.json(result.rows[0]);

  } catch (error) {
    console.error("Database update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await pool.end();
  }
}
