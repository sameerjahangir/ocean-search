import { NextResponse, NextRequest } from 'next/server';
import { Pool } from 'pg';
import { OpenAI } from 'openai';

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

export async function POST(request: NextRequest) {
    try {

        const body = await request.json();

        const { hasEmail, platform } = body;

        const client = await pool.connect();

        const result = await client.query(
            'select \n' +
            'i.id,\n' +
            'sma.username,\n' +
            'sma.platform,\n' +
            'sma.follower_count,\n' +
            'i.email,\n' +
            'sma.short_form_engagement_ratio,\n' +
            'sma.short_form_avg_video_viewcount,\n' +
            'i.bio,\n' +
            'i.last_exported_to_airtable,\n' +
            'sma.long_form_engagement_ratio,\n' +
            'sma.long_form_avg_video_viewcount\n' +
            'from influencers i \n' +
            'join social_media_accounts sma on i.id = sma.influencer_id\n' +
            'where sma.platform = $1\n' +
            'AND ' + (hasEmail ? 'i.email IS NOT NULL' : 'i.email IS NULL') + '\n' +
            'order by i.created_at desc\n' +
            'limit 1000',
            [platform]
        );

        client.release();

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error executing search:', error);
        return NextResponse.json({ error: 'Error executing search' }, { status: 500 });
    }
}

