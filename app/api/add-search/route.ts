import { Pool } from 'pg';
import {NextResponse} from "next/server";

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
});

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO searches (search_query, isactive) VALUES ($1, $2) RETURNING *',
            [name, '1']
        );
        client.release();
        console.log('Search added:', result.rows[0])
        return NextResponse.json({ message: 'Search successfully added', search: result.rows[0] });
    } catch (error) {
        console.error('Error adding new search:', error);
        return NextResponse.json({ message: 'Failed to add new search', error: error }, { status: 500 });
    }
}