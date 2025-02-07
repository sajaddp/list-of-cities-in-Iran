import list from "../offical/list.json";
import {
  AllInterface,
  CityInterface,
  CountyInterface,
  DistrictInterface,
  generateCsvFiles,
  generateJsonFiles,
  generateSlug,
  generateXlsxFiles,
  getTelPrefixForProvince,
  ListInterface,
  ProvinceInterface,
  RuralInterface,
} from "./utils";

const provincesIds = new Map<string, number>();
const provincesOutput: ProvinceInterface[] = [];

const countiesIds = new Map<string, number>();
const countiesOutput: CountyInterface[] = [];

const citiesIds = new Map<string, number>();
const citiesOutput: CityInterface[] = [];

const districtIds = new Map<string, number>();
const districtsOutput: DistrictInterface[] = [];

const ruralsOutput: RuralInterface[] = [];
const allOutput: AllInterface[] = [];

const typeHandlers: { [key: string]: (item: ListInterface) => void } = {
  استان: (item) => {
    provincesIds.set(item.name, item.nationalId);
    const result = {
      id: item.nationalId,
      name: item.name,
      slug: generateSlug(item.name),
      tel_prefix: getTelPrefixForProvince(item.name),
    };
    provincesOutput.push(result);
    allOutput.push({ type: "province", ...result });
  },
  شهرستان: (item) => {
    const provinceId = provincesIds.get(item.province as string) || 0;
    if (!provinceId) {
      throw new Error(`Province not found for County: ${item.name}`);
    }
    countiesIds.set(item.name + "p" + provinceId, item.nationalId);
    const result = {
      id: item.nationalId,
      name: item.name,
      slug: generateSlug(item.name),
      province_id: provinceId,
    };
    countiesOutput.push(result);
    allOutput.push({ type: "county", ...result });
  },
  شهر: (item) => {
    const provinceId = provincesIds.get(item.province as string) || 0;
    if (!provinceId) {
      throw new Error(`Province not found for City: ${item.name}`);
    }
    const countyId =
      countiesIds.get((item.county + "p" + provinceId) as string) || 0;
    if (!countyId) {
      throw new Error(`County not found for City: ${item.name}`);
    }
    citiesIds.set(
      item.name + "p" + provinceId + "c" + countyId,
      item.nationalId,
    );
    const result = {
      id: item.nationalId,
      name: item.name,
      slug: generateSlug(item.name),
      county_id: countyId,
      province_id: provinceId,
    };
    citiesOutput.push(result);
    allOutput.push({ type: "city", ...result });
  },
  بخش: (item) => {
    const provinceId = provincesIds.get(item.province as string) || 0;
    if (!provinceId) {
      throw new Error(`Province not found for District: ${item.name}`);
    }
    const countyId =
      countiesIds.get((item.county + "p" + provinceId) as string) || 0;
    if (!countyId) {
      throw new Error(`County not found for District: ${item.name}`);
    }
    districtIds.set(
      item.name + "p" + provinceId + "c" + countyId,
      item.nationalId,
    );
    const result = {
      id: item.nationalId,
      name: item.name,
      slug: generateSlug(item.name),
      province_id: provinceId,
      county_id: countyId,
    };
    districtsOutput.push(result);
    allOutput.push({ type: "district", ...result });
  },
  دهستان: (item) => {
    const provinceId = provincesIds.get(item.province as string) || 0;
    if (!provinceId) {
      console.log(item);

      throw new Error(`Province not found for Rural: ${item.name}`);
    }
    const countyId =
      countiesIds.get((item.county + "p" + provinceId) as string) || 0;
    if (!countyId) {
      throw new Error(`County not found for Rural: ${item.name}`);
    }
    const districtId =
      districtIds.get(
        (item.district + "p" + provinceId + "c" + countyId) as string,
      ) || 0;
    if (!districtId) {
      throw new Error(`District not found for Rural: ${item.name}`);
    }
    const result = {
      id: item.nationalId,
      name: item.name,
      slug: generateSlug(item.name),
      province_id: provinceId,
      county_id: countyId,
      district_id: districtId,
    };
    ruralsOutput.push(result);
    allOutput.push({ type: "rural", ...result });
  },
};

(list as ListInterface[]).forEach((item: ListInterface) => {
  const handler = typeHandlers[item.type];
  if (handler) {
    handler(item);
  }
});

console.table({
  provincesOutput: provincesOutput.length,
  countiesOutput: countiesOutput.length,
  citiesOutput: citiesOutput.length,
  districtsOutput: districtsOutput.length,
  ruralsOutput: ruralsOutput.length,
  allOutput: allOutput.length,
  listLength: list.length,
});

generateJsonFiles(
  allOutput,
  provincesOutput,
  countiesOutput,
  citiesOutput,
  districtsOutput,
  ruralsOutput,
);

generateCsvFiles(
  allOutput,
  provincesOutput,
  countiesOutput,
  citiesOutput,
  districtsOutput,
  ruralsOutput,
);

generateXlsxFiles(
  allOutput,
  provincesOutput,
  countiesOutput,
  citiesOutput,
  districtsOutput,
  ruralsOutput,
);
