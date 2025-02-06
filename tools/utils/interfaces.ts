export interface ListInterface {
  row: number;
  type: string;
  name: string;
  province: string;
  county: string;
  district: string;
  rural: string;
  hierarchicalCode: number;
  nationalId: number;
}
export interface ProvinceInterface {
  id: number;
  name: string;
  slug: string;
  tel_prefix: string;
}

export interface CityInterface {
  id: number;
  name: string;
  slug: string;
  province_id: number;
  city_id: number;
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
  city_id: number;
}

export interface RuralInterface {
  id: number;
  name: string;
  slug: string;
  province_id: number;
  city_id: number;
  district_id: number;
}

export interface AllInterface {
  id: number;
  type?: "province" | "city" | "county" | "district" | "rural";
  name: string;
  slug: string;
  province_id?: number;
  county_id?: number;
  district_id?: number;
  tel_prefix?: string;
}
