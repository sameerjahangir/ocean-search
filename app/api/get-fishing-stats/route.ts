import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
    const pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '5432'),
    });

    try {
        const client = await pool.connect();

        const query = `
            SELECT s.id AS search_id,
                   s.search_query AS search_name,
                   s.isactive AS is_search_active,
                   s.last_time_searched AS last_time_searched,
                   COUNT(DISTINCT CASE WHEN i.status = 'Active' THEN i.id END) AS active_influencers,
                   COUNT(DISTINCT i.id) AS total_influencers
            FROM searches s
                     LEFT JOIN influencers i ON s.id = i.searches_id
                     LEFT JOIN social_media_accounts sma ON i.id = sma.influencer_id
            GROUP BY s.id, s.search_query, s.isactive
            ORDER BY s.created_at DESC
        `;

        const result = await client.query(query);
        client.release();

        const searchesInfo = result.rows.map(row => ({
            id: row.search_id,
            name: row.search_name,
            is_search_active: row.is_search_active,
            active: parseInt(row.active_influencers),
            total: parseInt(row.total_influencers),
            last_time_searched: row.last_time_searched,
        }));

        return NextResponse.json(searchesInfo);
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await pool.end();
    }
}