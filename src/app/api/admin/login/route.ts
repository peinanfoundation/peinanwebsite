import { NextResponse } from "next/server";
import { setSessionCookie, verifyCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username ?? "");
  const password = String(body.password ?? "");

  if (!verifyCredentials(username, password)) {
    return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 });
  }

  await setSessionCookie();
  return NextResponse.json({ ok: true });
}
