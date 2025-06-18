import fs from "fs";
import path from "path";

interface County {
  id: number;
  name: string;
  slug: string;
  province_id: number;
  lat?: string;
  lon?: string;
}

interface Province {
  id: number;
  name: string;
}

const countiesPath = path.join(__dirname, "../dist/json/counties.json");
const provincesPath = path.join(__dirname, "../dist/json/provinces.json");

const counties: County[] = JSON.parse(fs.readFileSync(countiesPath, "utf-8"));
const provinces: Province[] = JSON.parse(
  fs.readFileSync(provincesPath, "utf-8"),
);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchCoordinates(
  query: string,
): Promise<{ lat: string; lon: string } | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "list-of-cities-in-iran/coordinates (https://github.com/sajaddp/list-of-cities-in-Iran)",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return { lat: data[0].lat, lon: data[0].lon };
}

(async () => {
  for (const county of counties) {
    const province = provinces.find((p) => p.id === county.province_id);
    const query = `${county.name} ${province ? province.name : ""} county Iran`;
    const coords = await fetchCoordinates(query);
    if (coords) {
      county.lat = coords.lat;
      county.lon = coords.lon;
      console.log(county);
    }
    await delay(1100);
  }
  fs.writeFileSync(
    path.join(__dirname, "../dist/json/counties_with_coords.json"),
    JSON.stringify(counties, null, 2),
    "utf-8",
  );
})();