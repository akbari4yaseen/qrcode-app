import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const backend_url = "http://116.203.82.82:8093/api/v1/qrcodes";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  console.log("Token:", token);

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const response = await axios.get(`${backend_url}/validate/${token}`);
    return NextResponse.json(response.data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error in proxy:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "API request failed" },
      { status: error.response?.status || 500 }
    );
  }
}
