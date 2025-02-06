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
const countiesIds = new Map<string, number>();
const citiesIds = new Map<string, number>();
const districtIds = new Map<string, number>();
const ruralIds = new Map<string, number>();

const provincesOutput: ProvinceInterface[] = [];
const citiesOutput: CityInterface[] = [];
const countiesOutput: CountyInterface[] = [];
const districtsOutput: DistrictInterface[] = [];
const ruralsOutput: RuralInterface[] = [];

const typeHandlers: { [key: string]: (item: ListInterface) => void } = {
  استان: (item) => {
    provincesIds.set(item.name, item.nationalId);
    provincesOutput.push({
      id: item.nationalId,
      name: item.name,
      slug: generateSlug(item.name),
      tel_prefix: getTelPrefixForProvince(item.name),
    });
  },
  // شهرستان: (item) => {
  //   const provinceId = provincesIds.get(item.province as string) || 0;
  //   if (!provinceId) {
  //     throw new Error(`Province not found for County: ${item.name}`);
  //   }
  //   countiesIds.set(item.name + "p" + provinceId, item.national_id);
  //   countiesOutput.push({
  //     id: item.national_id,
  //     name: item.name,
  //     slug: generateSlug(item.name),
  //     province_id: provinceId,
  //   });
  // },
  // شهر: (item) => {
  //   const provinceId = provincesIds.get(item.province as string) || 0;
  //   if (!provinceId) {
  //     throw new Error(`Province not found for city: ${item.name}`);
  //   }
  //   const cityId = citiesIds.get((item.city + "p" + provinceId) as string) || 0;
  //   if (!cityId) {
  //     throw new Error(`City not found for City: ${item.name}`);
  //   }
  //   citiesIds.set(
  //     item.name + "p" + provinceId + "c" + cityId,
  //     item.national_id,
  //   );
  //   citiesOutput.push({
  //     id: item.national_id,
  //     name: item.name,
  //     slug: generateSlug(item.name),
  //     city_id: cityId,
  //     province_id: provinceId,
  //   });
  // },
  // بخش: (item) => {
  //   const provinceId = provincesIds.get(item.province as string) || 0;
  //   if (!provinceId) {
  //     throw new Error(`Province not found for district: ${item.name}`);
  //   }
  //   const cityId = citiesIds.get((item.city + "p" + provinceId) as string) || 0;
  //   if (!cityId) {
  //     throw new Error(`City not found for district: ${item.name}`);
  //   }
  //   districtIds.set(
  //     item.name + "p" + provinceId + "c" + cityId,
  //     item.national_id,
  //   );
  //   districtsOutput.push({
  //     id: item.national_id,
  //     name: item.name,
  //     slug: generateSlug(item.name),
  //     province_id: provinceId,
  //     city_id: cityId,
  //   });
  // },
  // دهستان: (item) => {
  //   const provinceId = provincesIds.get(item.province as string) || 0;
  //   if (!provinceId) {
  //     throw new Error(`Province not found for rural: ${item.name}`);
  //   }
  //   const cityId = citiesIds.get((item.city + "p" + provinceId) as string) || 0;
  //   if (!cityId) {
  //     throw new Error(`City not found for rural: ${item.name}`);
  //   }
  //   const districtId =
  //     districtIds.get(
  //       (item.district + "p" + provinceId + "c" + cityId) as string,
  //     ) || 0;
  //   if (!districtId) {
  //     throw new Error(`District not found for rural: ${item.name}`);
  //   }
  //   ruralIds.set(
  //     item.name + "p" + provinceId + "c" + cityId + "d" + districtId,
  //     item.national_id,
  //   );
  //   ruralsOutput.push({
  //     id: item.national_id,
  //     name: item.name,
  //     slug: generateSlug(item.name),
  //     province_id: provinceId,
  //     city_id: cityId,
  //     district_id: districtId,
  //   });
  // },
};

(list as ListInterface[]).forEach((item: ListInterface) => {
  const handler = typeHandlers[item.type];
  if (handler) {
    handler(item);
  }
});

// const allOutput: AllInterface[] = [
//   ...provincesOutput,
//   ...countiesOutput,
//   ...citiesOutput,
//   ...districtsOutput,
//   ...ruralsOutput,
// ].map((item: AllInterface) => {
//   return {
//     id: item.id,
//     type: (() => {
//       if ("tel_prefix" in item) return "استان";
//       if ("province_id" in item && !("city_id" in item)) return "شهرستان";
//       if ("city_id" in item && !("district_id" in item)) return "شهر";
//       if ("district_id" in item && !("tel_prefix" in item)) return "بخش";
//       if ("district_id" in item && "tel_prefix" in item) return "دهستان";
//       return "unknown";
//     })(),
//     name: item.name,
//     slug: item.slug,
//     province_id: "province_id" in item ? item.province_id : undefined,
//     city_id: "city_id" in item ? item.city_id : undefined,
//     district_id: "district_id" in item ? item.district_id : undefined,
//     tel_prefix: "tel_prefix" in item ? item.tel_prefix : undefined,
//   };
// });

console.table({
  provincesOutput: provincesOutput.length,
  citiesOutput: citiesOutput.length,
  districtsOutput: districtsOutput.length,
  ruralsOutput: ruralsOutput.length,
  // allOutput: allOutput.length,
  listLength: list.length,
});

generateJsonFiles(
  // allOutput,
  provincesOutput,
  // citiesOutput,
  // districtsOutput,
  // ruralsOutput,
);

// generateCsvFiles(
//   allOutput,
//   provincesOutput,
//   citiesOutput,
//   districtsOutput,
//   ruralsOutput,
// );

// generateXlsxFiles(
//   allOutput,
//   provincesOutput,
//   citiesOutput,
//   districtsOutput,
//   ruralsOutput,
// );
