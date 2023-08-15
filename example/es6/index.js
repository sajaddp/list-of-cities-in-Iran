import cities from "./../../json/cities.json";
import provinces from "./../../json/provinces.json";

/**
 * Author: Sajad Dehshiri <sajaddp71@gmail.com>
 * GitHub: https://github.com/sajaddp/list-of-cities-in-Iran
 * If you find this useful, please consider starring the repository on GitHub.
 */

// Return all cities
export function getAllCities() {
  return cities;
}

// Return all provinces
export function getAllProvinces() {
  return provinces;
}

// Return all the cities of a specific province based on province's name
export function getCitiesByProvinceName(name) {
  const province = provinces.find((p) => p.name === name);
  if (!province) return [];
  return cities.filter((city) => city.province_id === province.id);
}

// Return all the cities of a specific province based on province's ID
export function getCitiesByProvinceId(id) {
  return cities.filter((city) => city.province_id === id);
}

// Return all the cities of a specific province based on province's slug
export function getCitiesByProvinceSlug(slug) {
  const province = provinces.find((p) => p.slug === slug);
  if (!province) return [];
  return cities.filter((city) => city.province_id === province.id);
}

// Find city information by name
export function getCityByName(name) {
  return cities.filter((city) => city.name === name);
}

// Find city information by ID
export function getCityById(id) {
  return cities.filter((city) => city.id === id);
}

// Find city information by slug
export function getCityBySlug(slug) {
  return cities.filter((city) => city.slug === slug);
}
