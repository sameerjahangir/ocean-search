import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function POST(request: NextRequest) {
    try {
        const { userIds } = await request.json();
        const currentDate = new Date().toISOString();

        console.log("USER IDS: ", userIds);

        // Update the last_exported_to_airtable column for the given userIds
        await db.query(
            `UPDATE influencers
       SET last_exported_to_airtable = $1
       WHERE id = ANY($2)`,
            [currentDate, userIds]
        );

        return NextResponse.json({ message: 'Successfully updated last exported date' }, { status: 200 });
    } catch (error) {
        console.error('Error updating last exported date:', error);
        return NextResponse.json({ error: 'Failed to update last exported date' }, { status: 500 });
    }
}