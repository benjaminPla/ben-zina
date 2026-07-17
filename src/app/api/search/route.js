import { NextResponse } from 'next/server';

const BASE = 'https://carburanti.mise.gov.it/ospzApi'

export async function POST(req) {
    try {
        const body = await req.json();

        const reqBody = {
            points:     [{ lat: body.lat, lng: body.lng }],
            priceOrder: 'asc',
            radius:     body.radius,
        };
        if (body.fuel) reqBody.fuelType = body.fuel;

        const res = await fetch(`${BASE}/search/zone`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body:    JSON.stringify(reqBody)
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("mise_error", text);
            throw new Error("MISE error");
        }

        const response = await res.json();

        return NextResponse.json({ stations: response.results });
    } catch(error) {
        console.error("internal_server_error", error)
        return NextResponse.json(
            { error:  error?.message || "Something went wrong"        },
            { status: error?.status  || error?.statusCode      || 500 }
        )
    }
}
