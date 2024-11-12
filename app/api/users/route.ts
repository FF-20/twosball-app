import { NextResponse } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

export async function GET(request: Request) {
    const users = await client.getUsers();
    return NextResponse.json(users);
}