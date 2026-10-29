import { createContactServerServices } from "@/infrastructure/services/createContactServerServices";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  return createContactServerServices().handle(request);
}

// Explicit method handling also prevents Next's automatic OPTIONS response.
export const GET = POST;
export const HEAD = POST;
export const OPTIONS = POST;
export const PUT = POST;
export const PATCH = POST;
export const DELETE = POST;
