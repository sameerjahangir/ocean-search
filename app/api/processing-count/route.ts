import { NextResponse } from 'next/server';
// import mysql from 'mysql2/promise';
import { Pool } from 'pg';


export const dynamic = 'force-dynamic';

export async function GET() {
    const pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        const result = await pool.query(
            // "SELECT \n" +
            // "    status, \n" +
            // "    COUNT(*) as count \n" +
            // "FROM \n" +
            // "    influencers \n" +
            // // "WHERE \n" +
            // // "    status IN ('Active', 'Too Small', 'No Bio or Embedding', 'Needs Stat Update')\n" +
            // "GROUP BY \n" +
            // "    status;\n"

            "select sma.platform, count(sma.*) from social_media_accounts as sma\n" +
            "\tinner join influencers as i on i.id = sma.influencer_id\n" +
            "\twhere i.status = 'Active'\n" +
            "\tgroup by sma.platform"
        );

        const total = await pool.query("SELECT COUNT(*) FROM influencers WHERE status = 'Active';");

        console.log(result.rows)

        // const rows = {
        //     "Active": result.rows[0],
        //     "No Bio or Embedding": result.rows[1],
        //     "Too Small": result.rows[2],
        //     "Needs Stat Update": result.rows[3]
        // }

        return NextResponse.json(
            { rows: result.rows,
                total: total.rows[0].count
              },
            {
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                },
            }
        );
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    } finally {
        await pool.end();
    }
}