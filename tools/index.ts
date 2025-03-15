import list from "../offical/list.json";
import {
  AllInterface,
  CityInterface,
  CountyInterface,
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
  cities: {},
  rurals: {},
  all: {},
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
      const name = item["نام"];
      processedData.provinces[provinceId] = {
        id: provinceId,
        name: name,
        slug: generateSlug(name),
        tel_prefix: getTelPrefixForProvince(name),
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
        const name = item["نام"];
        processedData.counties[countyId] = {
          id: countyId,
          name: name,
          slug: generateSlug(name),
          province_id: provinceId,
        };
      }
    }
  },
  city: (item: ListInterface) => {
    if (
      item["کد دهستان/ شهر"] &&
      item["نام دهستان/ شهر"] &&
      item["CODEREC"] === 5
    ) {
      const provinceId = parseInt(100 + item["کد استان"]);
      const countyId = parseInt(
        provinceId.toString() + "000" + item["کد شهرستان"],
      );
      const cityId = parseInt(
        countyId.toString() + "00" + item["کد دهستان/ شهر"],
      );

      if (!processedData.cities[cityId]) {
        const name = item["نام"];
        processedData.cities[cityId] = {
          id: cityId,
          name: name,
          slug: generateSlug(name),
          province_id: provinceId,
          county_id: countyId,
        };
      }
    }
  },
  rural: (item: ListInterface) => {
    if (
      item["کد دهستان/ شهر"] &&
      item["نام دهستان/ شهر"] &&
      item["CODEREC"] === 4
    ) {
      const provinceId = parseInt(100 + item["کد استان"]);
      const countyId = parseInt(
        provinceId.toString() + "000" + item["کد شهرستان"],
      );
      const ruralId = parseInt(
        countyId.toString() + "00" + item["کد دهستان/ شهر"],
      );

      if (!processedData.rurals[ruralId]) {
        const name = item["نام"];
        processedData.rurals[ruralId] = {
          id: ruralId,
          name: name,
          slug: generateSlug(name),
          province_id: provinceId,
          county_id: countyId,
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
normalizedList.forEach((item: ListInterface) => {
  typeHandlers.city(item);
});
normalizedList.forEach((item: ListInterface) => {
  typeHandlers.rural(item);
});

generateJsonFiles(processedData);
generateCsvFiles(processedData);
generateXlsxFiles(processedData);
