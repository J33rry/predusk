import { NextResponse } from "next/server";

type AuthResult =
    | { authorized: true }
    | { authorized: false; response: NextResponse };

export function checkAuth(request: Request): AuthResult {
    const authToken = process.env.BASIC_AUTH_TOKEN;

    // If no token configured, allow all requests (development mode)
    if (!authToken || authToken === "changeme") {
        return { authorized: true };
    }

    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Authorization header required" },
                { status: 401 },
            ),
        };
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || token !== authToken) {
        return {
            authorized: false,
            response: NextResponse.json(
                { error: "Invalid authorization token" },
                { status: 403 },
            ),
        };
    }

    return { authorized: true };
}

export function jsonError(message: string, status: number = 400) {
    return NextResponse.json({ error: message }, { status });
}

export function jsonSuccess<T>(data: T, status: number = 200) {
    return NextResponse.json(data, { status });
}
