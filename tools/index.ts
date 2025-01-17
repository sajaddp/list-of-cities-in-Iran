import list from "../offical/list.json";
import * as fs from "fs";
import * as path from "path";
import {
  AllInterface,
  CityInterface,
  DistrictInterface,
  generateSlug,
  getTelPrefixForProvince,
  ListInterface,
  ProvinceInterface,
  RuralInterface,
} from "./utils";

let provincesIds: { [key: string]: number } = {};
let citiesIds: { [key: string]: number } = {};
let districtIds: { [key: string]: number } = {};
let ruralIds: { [key: string]: number } = {};

let provincesOutput: ProvinceInterface[] = [];
let citiesOutput: CityInterface[] = [];
let districtsOutput: DistrictInterface[] = [];
let ruralsOutput: RuralInterface[] = [];

(list as ListInterface[]).forEach((item: ListInterface, index: number) => {
  if (item.type == "استان") {
    provincesIds[item.name] = item.national_id;
    provincesOutput.push({
      id: item.national_id,
      name: item.name,
      slug: generateSlug(item.name),
      tel_prefix: getTelPrefixForProvince(item.name),
    });
  } else if (item.type == "شهرستان") {
    citiesIds[item.name] = item.national_id;
    citiesOutput.push({
      id: item.national_id,
      name: item.name,
      slug: generateSlug(item.name),
      province_id: provincesIds[item.province as string],
    });
  } else if (item.type == "بخش") {
    districtIds[item.name] = item.national_id;
    districtsOutput.push({
      id: item.national_id,
      name: item.name,
      slug: generateSlug(item.name),
      province_id: provincesIds[item.province as string],
      city_id: citiesIds[item.city as string],
    });
  } else if (item.type == "دهستان") {
    ruralIds[item.name] = item.national_id;
    ruralsOutput.push({
      id: item.national_id,
      name: item.name,
      slug: generateSlug(item.name),
      province_id: provincesIds[item.province as string],
      city_id: citiesIds[item.city as string],
      district_id: districtIds[item.district as string],
    });
  }
});

const allOutput: AllInterface[] = [
  ...provincesOutput,
  ...citiesOutput,
  ...districtsOutput,
  ...ruralsOutput,
];

fs.mkdirSync(path.join(__dirname, "../json"), { recursive: true });

const provincesOutputPath = path.join(__dirname, "../json/provinces.json");
fs.writeFileSync(
  provincesOutputPath,
  JSON.stringify(provincesOutput, null, 2),
  "utf-8",
);
const citiesOutputPath = path.join(__dirname, "../json/cities.json");
fs.writeFileSync(
  citiesOutputPath,
  JSON.stringify(citiesOutput, null, 2),
  "utf-8",
);
const districtsOutputPath = path.join(__dirname, "../json/districts.json");
fs.writeFileSync(
  districtsOutputPath,
  JSON.stringify(districtsOutput, null, 2),
  "utf-8",
);
const ruralsOutputtPath = path.join(__dirname, "../json/rurals.json");
fs.writeFileSync(
  ruralsOutputtPath,
  JSON.stringify(ruralsOutput, null, 2),
  "utf-8",
);
const outputPath = path.join(__dirname, "../json/all.json");
fs.writeFileSync(outputPath, JSON.stringify(allOutput, null, 2), "utf-8");
