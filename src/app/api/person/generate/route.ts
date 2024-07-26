export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import label from '~/templat/label';

export async function POST(req: NextRequest) {
    const apiUrl = 'https://playground.jsreport.net/w/admin/hBfqC7af/api/report';

    let requestData;

    try {
        requestData = await req.json();
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Invalid Json' }), { status: 400 });
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template: {
                    content: label,
                    engine: 'handlebars',
                    recipe: 'chrome-pdf',
                },
                data: requestData,
            })
        });

        if (!response.ok) {
            throw new Error(`Error fetching report: ${response.statusText}`);
        }

        const result = await response.arrayBuffer();

        return new NextResponse(result, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=mailLabel.pdf'
            }
        });
    } catch (error: any) {
        console.error('Error:', error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
