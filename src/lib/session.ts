const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ?? "peinan-admin-session-secret";

async function hmacHex(message: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken() {
  const payload = `admin:${Date.now()}`;
  const signature = await hmacHex(payload, SESSION_SECRET);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = await hmacHex(payload, SESSION_SECRET);
  return signature === expected;
}
