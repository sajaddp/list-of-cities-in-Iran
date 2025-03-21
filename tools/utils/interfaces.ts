export interface ListInterface {
  "کد استان": string;
  "نام استان": string;
  "کد شهرستان"?: string;
  "نام شهرستان"?: string;
  "کد بخش"?: string;
  "نام بخش"?: string;
  "کد دهستان/ شهر"?: string;
  "نام دهستان/ شهر"?: string;
  CODEREC?: number;
  نام: string;
  FARICODE?: string;
  DIAG?: string;
}
export interface ProvinceInterface {
  id: number;
  name: string;
  slug: string;
  tel_prefix: string;
}

export interface CountyInterface {
  id: number;
  name: string;
  slug: string;
  province_id: number;
}
export interface DistrictInterface {
  id: number;
  name: string;
  slug: string;
  province_id: number;
  county_id: number;
}

export interface CityInterface {
  id: number;
  name: string;
  slug: string;
  province_id: number;
  county_id: number;
}

export interface RuralInterface {
  id: number;
  name: string;
  slug: string;
  province_id: number;
  county_id: number;
}

export interface AllInterface {
  id: number;
  type: "province" | "county" | "district" | "city" | "rural";
  name: string;
  slug: string;
  province_id?: number;
  county_id?: number;
  tel_prefix?: string;
}

export interface ProcessedDataInterface {
  provinces: { [key: number]: ProvinceInterface };
  counties: { [key: number]: CountyInterface };
  districts: { [key: number]: DistrictInterface };
  cities: { [key: number]: CityInterface };
  rurals: { [key: number]: RuralInterface };
  all: { [key: number]: AllInterface };
}
