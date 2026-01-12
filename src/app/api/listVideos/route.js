export async function GET() {
  const MANIFEST_URL =
    "https://pub-ed211d2dbf8d43b6a81391be2bf18901.r2.dev/manifest.json";

  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch manifest");
    }

    const manifest = await res.json();

    const BASE =
      "https://pub-ed211d2dbf8d43b6a81391be2bf18901.r2.dev";

    // Build full URLs for folder67
    const folder67 = (manifest.folder67 || []).map(
      (file) => `${BASE}/folder67/${encodeURIComponent(file)}`
    );

    return new Response(
      JSON.stringify({
        folder67,
        // optional fallback loop
        loop45: [`${BASE}/folder67/45sec.mp4`],
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err.message,
        folder67: [],
      }),
      { status: 500 }
    );
  }
}
