import { NextResponse, NextRequest } from 'next/server';
import { Pool } from 'pg';
import { OpenAI } from 'openai';

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

console.log(
    'DB_HOST:', process.env.DB_HOST,
    'DB_USER:', process.env.DB_USER,
)

export async function POST(request: NextRequest) {
    try {

        const body = await request.json();

        console.log(body);

        const { query, similarityThreshold, maxFollowers, minFollowers, hasEmail, minEngagementRate, minAvgViews, lastExportDate, platform } = body;

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        const emb = await openai.embeddings.create({
            model: 'text-embedding-3-large',
            input: query
        });

        const searchVector = emb.data[0].embedding;
        const vectorString = `[${searchVector.join(',')}]`;

        const client = await pool.connect();
        // const result = await client.query(
        //     'SELECT * FROM semantic_search($1, $2, $3, $4, $5, $6, $7, $8)',
        //     [vectorString, maxFollowers, minFollowers, hasEmail, minEngagementRate, minAvgViews, similarityThreshold, lastExportDate]
        // );

        // console.log('SELECT * FROM search_influencers(', [vectorString, similarityThreshold, maxFollowers, minFollowers, hasEmail, minEngagementRate, minAvgViews, lastExportDate, platform])

        // const fs = require('fs');

        // const content = JSON.stringify({
        //     query: 'SELECT * FROM search_influencers(',
        //     params: [vectorString, similarityThreshold, maxFollowers, minFollowers, hasEmail, minEngagementRate, minAvgViews, lastExportDate, platform]
        // }, null, 2);
        //
        // fs.writeFileSync('debug_output.json', content);
        // console.log('Debug information written to debug_output.json');

        const result = await client.query(
            'SELECT * FROM search_influencers($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [vectorString, similarityThreshold, maxFollowers, minFollowers, hasEmail, minEngagementRate, minAvgViews, lastExportDate, platform]
        );

        client.release();

        // console.log(result)

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error executing search:', error);
        return NextResponse.json({ error: 'Error executing search' }, { status: 500 });
    }
}

