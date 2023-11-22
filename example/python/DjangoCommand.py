import csv
from django.core.management.base import BaseCommand

# Import your models here
from application.models import Province, City



class Command(BaseCommand):
    help = "Import provinces and cities data from CSV files"

    def add_arguments(self, parser):
        parser.add_argument('provinces_csv_path', type=str, help="Path to the provinces CSV file")
        parser.add_argument('cities_csv_path', type=str, help="Path to the cities CSV file")

    def handle(self, *args, **options):
        provinces_csv = options["provinces_csv_path"]
        cities_csv = options["cities_csv_path"]

        try:
            # Open the provinces CSV file
            with open(provinces_csv, "r", encoding="utf-8") as provinces_file:
                reader = csv.reader(provinces_file)
                # Skip the header row
                next(reader)
                # Create Province objects from the CSV data
                provinces = [Province(province_id=province[0], name=province[1]) for province in reader]
                # Bulk create all the Province objects in the database
                Province.objects.bulk_create(provinces)
                self.stdout.write(self.style.SUCCESS("Provinces Data Imported Successfully"))
        except FileNotFoundError:
            return self.stderr.write(f"File not found: {provinces_csv}")

        try:
            # Open the cities CSV file
            with open(cities_csv, "r", encoding="utf-8") as cities_file:
                reader = csv.reader(cities_file)
                # Skip the header row
                next(reader)
                # Create an empty list to hold the City objects
                cities = []
                for city in reader:
                    city_name = city[1]
                    province_id = city[3]
                    # Get the corresponding Province object from the database
                    province = Province.objects.get(province_id=province_id)
                    # Create a City object and add it to the list
                    cities.append(City(name=city_name, province=province))
                # Bulk create all the City objects in the database
                City.objects.bulk_create(cities)
                self.stdout.write(self.style.SUCCESS("Cities Data Imported Successfully"))
        except FileNotFoundError:
            return self.stderr.write(f"File not found: {cities_csv}")


"""
Usage: python manage.py import_data [provinces_csv_path] [cities_csv_path]

Don't forget to add a management/commands directory to the application and put this file into it.
source: https://docs.djangoproject.com/en/4.2/howto/custom-management-commands/

The province and city models needs at least two fields, name and province_id.

Example:
python manage.py import_data provinces.csv cities.csv
- This command imports provinces and cities data from "provinces.csv" and "cities.csv" respectively.

Make sure to provide the correct paths to the provinces and cities CSV files.
"""