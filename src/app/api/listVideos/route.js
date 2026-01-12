export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    message: "API ROUTE IS LIVE",
    time: new Date().toISOString()
  });
}
