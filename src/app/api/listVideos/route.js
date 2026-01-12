// force redeploy
export async function GET() {
  const MANIFEST_URL =
    "https://pub-ed211d2dbf8d43b6a81391be2bf18901.r2.dev/manifest.json";

  const BASE =
    "https://pub-ed211d2dbf8d43b6a81391be2bf18901.r2.dev";

  try {
    const res = await fetch(MANIFEST_URL, {
      cache: "no-store",
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch manifest" }),
        { status: 500 }
      );
    }

    const manifest = await res.json();

    if (!manifest.folder67 || !Array.isArray(manifest.folder67)) {
      return new Response(
        JSON.stringify({ error: "folder67 missing in manifest" }),
        { status: 500 }
      );
    }

    const folder67 = manifest.folder67.map(
      (f) => `${BASE}/folder67/${encodeURIComponent(f)}`
    );

    return Response.json({ folder67 });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

