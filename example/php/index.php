<?php

require_once 'CityProvinceQuery_v8.2.php';

$query = new CityProvinceQuery();

// Example 1: Get all cities
$cities = $query->getAllCities();
echo "All Cities:<br>";
print_r($cities);
echo "<br><br>";

// Example 2: Get all provinces
$provinces = $query->getAllProvinces();
echo "All Provinces:<br>";
print_r($provinces);
echo "<br><br>";

// Example 3: Get cities by province name
$cities_by_name = $query->getCitiesByProvinceName("کرمان");
echo "Cities by Province Name (کرمان):<br>";
print_r($cities_by_name);
echo "<br><br>";

// Example 4: Get cities by province ID
$cities_by_id = $query->getCitiesByProvinceId(1);
echo "Cities by Province ID (1):<br>";
print_r($cities_by_id);
echo "<br><br>";

// Example 5: Get cities by province slug
$cities_by_slug = $query->getCitiesByProvinceSlug("کرمان");
echo "Cities by Province Slug (کرمان):<br>";
print_r($cities_by_slug);
echo "<br><br>";

// Example 6: Get city information by name
$city_info_name = $query->getCityByName("رفسنجان");
echo "City Info by Name (رفسنجان):<br>";
print_r($city_info_name);
echo "<br><br>";

// Example 7: Get city information by ID
$city_info_id = $query->getCityById(1);
echo "City Info by ID (1):<br>";
print_r($city_info_id);
echo "<br><br>";

// Example 8: Get city information by slug
$city_info_slug = $query->getCityBySlug("رفسنجان");
echo "City Info by Slug (رفسنجان):<br>";
print_r($city_info_slug);
echo "<br><br>";

echo `
<br>
<hr>
<p>If you find this repository useful, please consider starring it on GitHub: <a href="https://github.com/sajaddp/list-of-cities-in-Iran" target="_blank">https://github.com/sajaddp/list-of-cities-in-Iran</a></p>
`;
