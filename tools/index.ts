import list from "../offical/list.json";
import {
  generateCsvFiles,
  generateJsonFiles,
  generateSlug,
  generateXlsxFiles,
  getTelPrefixForProvince,
  ListInterface,
  normalizePersianText,
  ProcessedDataInterface,
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
      const data = {
        id: provinceId,
        name: name,
        slug: generateSlug(name),
        tel_prefix: getTelPrefixForProvince(name),
      };
      processedData.provinces[provinceId] = data;
      processedData.all[provinceId] = { ...data, type: "province" };
    }
  },
  county: (item: ListInterface) => {
    if (item["کد شهرستان"] && item["نام شهرستان"] && item["CODEREC"] === 2) {
      const provinceId = parseInt(100 + item["کد استان"]);
      const countyId = parseInt(
        provinceId.toString() + "000" + item["کد شهرستان"],
      );

      if (!processedData.counties[countyId]) {
        const name = item["نام"];
        const data = {
          id: countyId,
          name: name,
          slug: generateSlug(name),
          province_id: provinceId,
        };
        processedData.counties[countyId] = data;
        processedData.all[countyId] = { ...data, type: "county" };
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
        const data = {
          id: cityId,
          name: name,
          slug: generateSlug(name),
          province_id: provinceId,
          county_id: countyId,
        };
        processedData.cities[cityId] = data;
        processedData.all[cityId] = { ...data, type: "city" };
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
        const data = {
          id: ruralId,
          name: name,
          slug: generateSlug(name),
          province_id: provinceId,
          county_id: countyId,
        };
        processedData.rurals[ruralId] = data;
        processedData.all[ruralId] = { ...data, type: "rural" };
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
console.table({
  provinces: Object.keys(processedData.provinces).length,
  counties: Object.keys(processedData.counties).length,
  cities: Object.keys(processedData.cities).length,
  rurals: Object.keys(processedData.rurals).length,
  all: Object.keys(processedData.all).length,
});
generateJsonFiles(processedData);
generateCsvFiles(processedData);
generateXlsxFiles(processedData);
