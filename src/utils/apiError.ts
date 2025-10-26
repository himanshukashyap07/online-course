import { NextResponse } from "next/server";

const apiError = (message: string, status = 400): NextResponse => {
    return NextResponse.json({ message, success: false }, { status });
}

export default apiError