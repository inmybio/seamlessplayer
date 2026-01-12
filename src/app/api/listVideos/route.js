export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    test: "THIS SHOULD NEVER BE EMPTY",
    time: Date.now()
  });
}
