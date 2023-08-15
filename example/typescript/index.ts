import cities from "./../../json/cities.json";
import provinces from "./../../json/provinces.json";

interface City {
    id: number;
    name: string;
    slug: string;
    province_id: number;
}

interface Province {
    id: number;
    name: string;
    slug: string;
}

// 1. Return all cities
export function getAllCities(): City[] {
    return cities;
}

// 2. Return all provinces
export function getAllProvinces(): Province[] {
    return provinces;
}

// 3. Return all the cities of a specific province based on province's name
export function getCitiesByProvinceName(name: string): City[] {
    const province = provinces.find(p => p.name === name);
    if (!province) return [];
    return cities.filter(city => city.province_id === province.id);
}

// 4. Return all the cities of a specific province based on province's ID
export function getCitiesByProvinceId(id: number): City[] {
    return cities.filter(city => city.province_id === id);
}

// 5. Return all the cities of a specific province based on province's slug
export function getCitiesByProvinceSlug(slug: string): City[] {
    const province = provinces.find(p => p.slug === slug);
    if (!province) return [];
    return cities.filter(city => city.province_id === province.id);
}

// 6. Find city information by name
export function getCityByName(name: string): City[] {
    return cities.filter(city => city.name === name);
}

// 7. Find city information by ID
export function getCityById(id: number): City[] {
    return cities.filter(city => city.id === id);
}

// 8. Find city information by slug
export function getCityBySlug(slug: string): City[] {
    return cities.filter(city => city.slug === slug);
}

