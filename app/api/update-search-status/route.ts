import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import {db} from '@/utils/db';

export async function POST(request: Request) {
    try {
        const { id, isactive } = await request.json();

        console.log("RECIEVED", id, isactive)

        if (typeof id !== 'number' || typeof isactive !== 'boolean') {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        let newStatus = '1';

        if (isactive == true) {
            newStatus = '1'
        } else {
            newStatus = '0'
        }

        try {
            const query = 'UPDATE searches SET isactive = $1 WHERE id = $2 RETURNING *';
            const values = [newStatus, id];
            const result = await db.query(query, values);
            if (result.rowCount === 0) {
                return NextResponse.json({ error: 'Search not found' }, { status: 404 });
            }

            return NextResponse.json({ message: 'Search status updated successfully', search: result.rows[0] });
        } finally {
            // ;
        }
    } catch (error) {
        console.error('Error updating search status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}