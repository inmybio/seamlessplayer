import fs from "fs";
import path from "path";

export async function GET() {
  const base = path.join(process.cwd(), "public", "videos");
  const result = {};

  if (!fs.existsSync(base)) {
    return new Response(JSON.stringify({}), { status: 200 });
  }

  const folders = fs
    .readdirSync(base, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const folder of folders) {
    const dir = path.join(base, folder.name);

    const files = fs
      .readdirSync(dir)
      .filter(f => /\.(mp4|mov|webm)$/i.test(f))
      .map(f => `/videos/${folder.name}/${f}`);

    result[folder.name] = files;
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
