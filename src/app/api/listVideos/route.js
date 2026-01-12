export async function GET() {
  const MANIFEST_URL =
    "https://pub-ed211d2dbf8d43b6a81391be2bf18901.r2.dev/manifest.json";

  const BASE =
    "https://pub-ed211d2dbf8d43b6a81391be2bf18901.r2.dev";

  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    const manifest = await res.json();

    const folder67 = (manifest.folder67 || []).map(
      (f) => `${BASE}/folder67/${encodeURIComponent(f)}`
    );

    return Response.json({ folder67 });
  } catch (e) {
    return Response.json({ folder67: [], error: e.message });
  }
}
