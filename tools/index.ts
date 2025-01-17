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

const provincesIds = new Map<string, number>();
const citiesIds = new Map<string, number>();
const districtIds = new Map<string, number>();
const ruralIds = new Map<string, number>();

const provincesOutput: ProvinceInterface[] = [];
const citiesOutput: CityInterface[] = [];
const districtsOutput: DistrictInterface[] = [];
const ruralsOutput: RuralInterface[] = [];

const typeHandlers: { [key: string]: (item: ListInterface) => void } = {
    "استان": (item) => {
        provincesIds.set(item.name, item.national_id);
        provincesOutput.push({
            id: item.national_id,
            name: item.name,
            slug: generateSlug(item.name),
            tel_prefix: getTelPrefixForProvince(item.name),
        });
    },
    "شهرستان": (item) => {
        citiesIds.set(item.name, item.national_id);
        citiesOutput.push({
            id: item.national_id,
            name: item.name,
            slug: generateSlug(item.name),
            province_id: provincesIds.get(item.province as string) || 0,
        });
    },
    "بخش": (item) => {
        districtIds.set(item.name, item.national_id);
        districtsOutput.push({
            id: item.national_id,
            name: item.name,
            slug: generateSlug(item.name),
            province_id: provincesIds.get(item.province as string) || 0,
            city_id: citiesIds.get(item.city as string) || 0,
        });
    },
    "دهستان": (item) => {
        ruralIds.set(item.name, item.national_id);
        ruralsOutput.push({
            id: item.national_id,
            name: item.name,
            slug: generateSlug(item.name),
            province_id: provincesIds.get(item.province as string) || 0,
            city_id: citiesIds.get(item.city as string) || 0,
            district_id: districtIds.get(item.district as string) || 0,
        });
    },
};

(list as ListInterface[]).forEach((item: ListInterface) => {
    const handler = typeHandlers[item.type];
    if (handler) {
        handler(item);
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
