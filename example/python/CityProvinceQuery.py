
"""
Author: Sajad Dehshiri <sajaddp71@gmail.com>
GitHub: https://github.com/sajaddp/list-of-cities-in-Iran
If you find this useful, please consider starring the repository on GitHub.
Python Version: 3.9 (Note: 3.11 features are not included as it hasn't been released as of September 2021)
"""

import json
import os


class CityProvinceQuery:

    def __init__(self):
        base_path = os.path.join(os.path.dirname(
            os.path.abspath(__file__)), '../../json')
        cities_file_path = os.path.join(base_path, 'cities.json')
        provinces_file_path = os.path.join(base_path, 'provinces.json')

        with open(cities_file_path, 'r', encoding='utf-8') as cities_file:
            self.cities = json.load(cities_file)

        with open(provinces_file_path, 'r', encoding='utf-8') as provinces_file:
            self.provinces = json.load(provinces_file)

    def get_all_cities(self):
        return self.cities

    def get_all_provinces(self):
        return self.provinces

    def get_cities_by_province_name(self, name):
        province = next((p for p in self.provinces if p['name'] == name), None)
        return [city for city in self.cities if city['province_id'] == province['id']] if province else []

    def get_cities_by_province_id(self, province_id):
        return [city for city in self.cities if city['province_id'] == province_id]

    def get_cities_by_province_slug(self, slug):
        province = next((p for p in self.provinces if p['slug'] == slug), None)
        return [city for city in self.cities if city['province_id'] == province['id']] if province else []

    def get_city_by_name(self, name):
        return [city for city in self.cities if city['name'] == name]

    def get_city_by_id(self, city_id):
        return [city for city in self.cities if city['id'] == city_id]

    def get_city_by_slug(self, slug):
        return [city for city in self.cities if city['slug'] == slug]
