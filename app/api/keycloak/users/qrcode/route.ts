// app/api/keycloak/users/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Parse the JSON body from the request
        const body = await request.json();

        // Forward the POST request to your Express backend
        const response = await fetch(
            `${process.env.CENTRAL_SERVER_URL}/keycloak/users/qrcode`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            }
        );

        const data = await response.json();

        // Return the response from the backend to the Next.js frontend
        return NextResponse.json(data, { status: response.status });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Axios error details:', {
            status: error.response?.status,
            data: error.response?.data,
        });
        return NextResponse.json(
            { message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
