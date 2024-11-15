import { NextResponse, NextRequest } from "next/server";

// Decode base64url encoded string
function decodeBase64Url(base64Url: any) {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedString = atob(base64);
  const uint8Array = new Uint8Array(decodedString.length);
  for (let i = 0; i < decodedString.length; i++) {
    uint8Array[i] = decodedString.charCodeAt(i);
  }
  return uint8Array;
}

// Verify JWT token using crypto.subtle
async function verifyJWT(token: any, secret: any) {
  const [header, payload, signature] = token.split(".");
  const enc = new TextEncoder();

  // Import secret as a key for HMAC-SHA256
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  // Verify the signature using the header and payload
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    decodeBase64Url(signature),
    enc.encode(`${header}.${payload}`)
  );

  if (!isValid) throw new Error("Invalid token");

  // Return decoded payload if valid
  return JSON.parse(atob(payload));
}

export async function middleware(request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Authentication token missing" },
      { status: 401 }
    );
  }

  try {
    // Verify the JWT token with the secret
    const secret = process.env.JWT_SECRET || "1234";
    const decoded = await verifyJWT(token, secret);

    // Optionally attach the user information to the request
    request.headers.set("user", JSON.stringify(decoded));

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }
}

export const config = {
    matcher: ["/api((?!/login).*)"]
};
