import list from "../offical/list.json";
import {
  AllInterface,
  CityInterface,
  DistrictInterface,
  generateSlug,
  generateJsonFiles,
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
  استان: (item) => {
    provincesIds.set(item.name, item.national_id);
    provincesOutput.push({
      id: item.national_id,
      name: item.name,
      slug: generateSlug(item.name),
      tel_prefix: getTelPrefixForProvince(item.name),
    });
  },
  شهرستان: (item) => {
    citiesIds.set(item.name, item.national_id);
    citiesOutput.push({
      id: item.national_id,
      name: item.name,
      slug: generateSlug(item.name),
      province_id: provincesIds.get(item.province as string) || 0,
    });
  },
  بخش: (item) => {
    districtIds.set(item.name, item.national_id);
    districtsOutput.push({
      id: item.national_id,
      name: item.name,
      slug: generateSlug(item.name),
      province_id: provincesIds.get(item.province as string) || 0,
      city_id: citiesIds.get(item.city as string) || 0,
    });
  },
  دهستان: (item) => {
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

generateJsonFiles(
  allOutput,
  provincesOutput,
  citiesOutput,
  districtsOutput,
  ruralsOutput,
);
