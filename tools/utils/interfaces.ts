export interface ListInterface {
  type: string;
  name: string;
  national_id: number;
  province?: string;
  city?: string;
  district?: string;
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
  city_id?: number;
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
  name: string;
  slug: string;
  province_id?: number;
  city_id?: number;
  district_id?: number;
  tel_prefix?: string;
}
