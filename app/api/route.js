import { createConnection } from "../lib/database.js";
import { NextResponse } from "next/server";

// Handle POST requests
export async function POST(req) {
    try {
        // Read the raw body text first
        const body = await req.text();

        if (!body.trim()) {
            return NextResponse.json(
                { message: 'Request body is empty', status: false, data: [] },
                { status: 400 }
            );
        }

        const { data, spname } = JSON.parse(body);

        if(!data) {
            return NextResponse.json(
                { message: 'JSON parameter required', status: false, data: [] },
                { status: 400 }
            );
        }
        if (!spname) {
            return NextResponse.json(
                { message: 'Stored procedure name required', status: false, data: [] },
                { status: 400 } // Bad Request
            );
        }
        // CREATES CONNECTION
        const db = await createConnection();

        if (!db) {
            return NextResponse.json(
                { message: 'Failed to connect to the database', status: false, data: [] },
                { status: 500 }
            );
        }
        
        // CALL STORE PROCEDURE NAME HERE
        const sql = `CALL ${spname}(?)`;
        const [response] = await db.query(sql, [JSON.stringify(data)]);
        return NextResponse.json(
            { message: 'Success', status: true, data: response[0][0] },
            { status: 200 }
        );
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: err.message, status: false, data: [] }, {status: 404});
    } 
}

// Handle other HTTP methods (like GET, PUT) with a 405 Method Not Allowed response
export async function GET() {
    return new NextResponse(
        JSON.stringify({ message: 'Method not allowed', status: false, data: [] }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
}

export async function PUT() {
    return new NextResponse(
        JSON.stringify({ message: 'Method not allowed', status: false, data: [] }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
}

export async function DELETE() {
    return new NextResponse(
        JSON.stringify({ message: 'Method not allowed', status: false, data: [] }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
}
export async function PATCH() {
    return new NextResponse(
        JSON.stringify({ message: 'Method not allowed', status: false, data: [] }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
}