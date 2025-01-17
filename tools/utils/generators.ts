import * as fs from "fs";
import * as path from "path";
import {
  AllInterface,
  CityInterface,
  DistrictInterface,
  ProvinceInterface,
  RuralInterface,
} from ".";

export function generateSlug(item: string): string {
  return item
    .replace(/[\u200C\u200B]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[-]+/g, "-")
    .replace(/[^\w\-آ-ی\u0600-\u06FF]+/g, "");
}

export function generateJsonFiles(
  allOutput: AllInterface[],
  provincesOutput: ProvinceInterface[],
  citiesOutput: CityInterface[],
  districtsOutput: DistrictInterface[],
  ruralsOutput: RuralInterface[],
) {
  fs.mkdirSync(path.join(__dirname, "../json"), { recursive: true });

  const outputs = [
    { name: "provinces", data: provincesOutput },
    { name: "cities", data: citiesOutput },
    { name: "districts", data: districtsOutput },
    { name: "rurals", data: ruralsOutput },
    { name: "all", data: allOutput },
  ];

  outputs.forEach(({ name, data }) => {
    const outputPath = path.join(__dirname, `../json/${name}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
  });
}
