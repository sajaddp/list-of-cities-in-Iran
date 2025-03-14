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
  normalizePersianText,
  ProcessedDataInterface,
  ProvinceInterface,
  RuralInterface,
  sortAllInterfaceArray,
} from "./utils";

const processedData: ProcessedDataInterface = {
  provinces: {},
  counties: {},
};

const listTyped: ListInterface[] = list as ListInterface[];

const normalizedList = listTyped.map((item: ListInterface) => {
  let normalizedItem: ListInterface = item;

  normalizedItem["نام استان"] = normalizePersianText(item["نام استان"]);
  if (item["نام شهرستان"] !== undefined) {
    normalizedItem["نام شهرستان"] = normalizePersianText(item["نام شهرستان"]);
  }
  if (item["نام بخش"] !== undefined) {
    normalizedItem["نام بخش"] = normalizePersianText(item["نام بخش"]);
  }
  if (item["نام دهستان/ شهر"] !== undefined) {
    normalizedItem["نام دهستان/ شهر"] = normalizePersianText(
      item["نام دهستان/ شهر"],
    );
  }
  if (item["نام"] !== undefined) {
    normalizedItem["نام"] = normalizePersianText(item["نام"]);
  }

  return normalizedItem;
});

const typeHandlers: { [key: string]: (item: ListInterface) => void } = {
  province: (item: ListInterface) => {
    const provinceId = parseInt(100 + item["کد استان"]);
    if (!processedData.provinces[provinceId]) {
      processedData.provinces[provinceId] = {
        id: provinceId,
        name: item["نام"],
        slug: generateSlug(item["نام استان"]),
        tel_prefix: getTelPrefixForProvince(item["نام استان"]),
      };
    }
  },
  county: (item: ListInterface) => {
    if (item["کد شهرستان"] && item["نام شهرستان"]) {
      const provinceId = parseInt(100 + item["کد استان"]);
      const countyId = parseInt(
        provinceId.toString() + "000" + item["کد شهرستان"],
      );

      if (!processedData.counties[countyId]) {
        processedData.counties[countyId] = {
          id: countyId,
          name: item["نام"],
          slug: generateSlug(item["نام شهرستان"]),
          province_id: provinceId,
        };
      }
    }
  },
};

normalizedList.forEach((item: ListInterface) => {
  typeHandlers.province(item);
});
normalizedList.forEach((item: ListInterface) => {
  typeHandlers.county(item);
});

// console.log(JSON.stringify(processedData.counties, null, 2));

generateJsonFiles(processedData);
generateCsvFiles(processedData);
generateXlsxFiles(processedData);
