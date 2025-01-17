import list from "../offical/list.json"
import * as fs from 'fs';
import * as path from 'path';

export interface ListInterface {
    type: string,
    name: string,
    national_id: number
    province?: string,
    city?: string,
    district?: string,
}

let provincesIds: { [key: string]: number } = {};
let citiesIds: { [key: string]: number } = {};
let districtIds: { [key: string]: number } = {};
let ruralIds: { [key: string]: number } = {};

export interface ProvinceInterface {
    id: number,
    name: string,
    slug: string,
    tel_prefix: string,
}
let provincesOutput: ProvinceInterface[] = [];

export interface CityInterface {
    id: number,
    name: string,
    slug: string,
    province_id: number,
}
let citiesOutput: CityInterface[] = [];

export interface DistrictInterface {
    id: number,
    name: string,
    slug: string,
    province_id: number,
    city_id: number,
}
let districtsOutput: DistrictInterface[] = [];

export interface RuralInterface {
    id: number,
    name: string,
    slug: string,
    province_id: number,
    city_id: number,
    district_id: number,
}
let ruralsOutput: RuralInterface[] = [];

(list as ListInterface[]).forEach((item: ListInterface, index: number) => {
    if (item.type == "استان") {
        provincesIds[item.name] = item.national_id;
        provincesOutput.push({
            id: item.national_id,
            name: item.name,
            slug: generateSlug(item.name),
            tel_prefix: telPrefixorProvince(item.name)
        })
    } else if (item.type == "شهرستان") {
        citiesIds[item.name] = item.national_id;
        citiesOutput.push({
            id: item.national_id,
            name: item.name,
            slug: generateSlug(item.name),
            province_id: provincesIds[item.province as string]
        })
    } else if (item.type == "بخش") {
        districtIds[item.name] = item.national_id;
        districtsOutput.push({
            id: item.national_id,
            name: item.name,
            slug: generateSlug(item.name),
            province_id: provincesIds[item.province as string],
            city_id: citiesIds[item.city as string]
        })
    } else if (item.type == "دهستان") {
        ruralIds[item.name] = item.national_id;
        ruralsOutput.push({
            id: item.national_id,
            name: item.name,
            slug: generateSlug(item.name),
            province_id: provincesIds[item.province as string],
            city_id: citiesIds[item.city as string],
            district_id: districtIds[item.district as string]
        })
    }
});

export interface AllInterface {
    id: number,
    name: string,
    slug: string,
    province_id?: number,
    city_id?: number,
    district_id?: number,
    tel_prefix?: string,
}
const allOutput: AllInterface[] = [
    ...provincesOutput,
    ...citiesOutput,
    ...districtsOutput,
    ...ruralsOutput,
];

fs.mkdirSync(path.join(__dirname, '../json'), { recursive: true });

const provincesOutputPath = path.join(__dirname, '../json/provinces.json');
fs.writeFileSync(provincesOutputPath, JSON.stringify(provincesOutput, null, 2), 'utf-8');
const citiesOutputPath = path.join(__dirname, '../json/cities.json');
fs.writeFileSync(citiesOutputPath, JSON.stringify(citiesOutput, null, 2), 'utf-8');
const districtsOutputPath = path.join(__dirname, '../json/districts.json');
fs.writeFileSync(districtsOutputPath, JSON.stringify(districtsOutput, null, 2), 'utf-8');
const ruralsOutputtPath = path.join(__dirname, '../json/rurals.json');
fs.writeFileSync(ruralsOutputtPath, JSON.stringify(ruralsOutput, null, 2), 'utf-8');
const outputPath = path.join(__dirname, '../json/all.json');
fs.writeFileSync(outputPath, JSON.stringify(allOutput, null, 2), 'utf-8');


function generateSlug(item: string): string {
    return item.replace(/[\u200C\u200B]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[-]+/g, '-')
        .replace(/[^\w\-آ-ی\u0600-\u06FF]+/g, '');
}

function telPrefixorProvince(name: string): string {
    const list: { [key: string]: string } = {
        "آذربایجان شرقی": "041",
        "آذربایجان غربی": "044",
        "اردبیل": "045",
        "اصفهان": "031",
        "البرز": "026",
        "ایلام": "084",
        "بوشهر": "077",
        "تهران": "021",
        "چهارمحال و بختیاری": "038",
        "خراسان جنوبی": "056",
        "خراسان رضوی": "051",
        "خراسان شمالی": "058",
        "خوزستان": "061",
        "زنجان": "024",
        "سمنان": "023",
        "سیستان و بلوچستان": "054",
        "فارس": "071",
        "قزوین": "028",
        "قم": "025",
        "کردستان": "087",
        "کرمان": "034",
        "کرمانشاه": "083",
        "کهگیلویه و بویراحمد": "074",
        "گلستان": "017",
        "لرستان": "066",
        "گیلان": "013",
        "مازندران": "011",
        "مرکزی": "086",
        "هرمزگان": "076",
        "همدان": "081",
        "یزد": "035"
    };

    return list[name] || "---";
}