import * as fs from 'fs';
import * as path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import * as XLSX from 'xlsx';

interface City {
  id: number;
  name: string;
  slug: string;
  province_id: number;
  county_id: number;
}

/**
 * Check if a slug contains dashes or underscores
 */
function hasDashOrUnderscore(slug: string): boolean {
  return slug.includes('-') || slug.includes('_');
}

/**
 * Filter cities by removing entries with dashes or underscores in slugs
 */
function filterCities(cities: City[]): City[] {
  return cities.filter(city => !hasDashOrUnderscore(city.slug));
}

/**
 * Process JSON file
 */
async function processJSON() {
  const inputPath = path.join(__dirname, '../dist/json/cities.json');
  const outputPath = path.join(__dirname, '../dist/json/cities-filtered.json');

  console.log('Processing JSON file...');
  
  const data = fs.readFileSync(inputPath, 'utf-8');
  const cities: City[] = JSON.parse(data);
  
  const originalCount = cities.length;
  const filteredCities = filterCities(cities);
  const filteredCount = filteredCities.length;
  
  fs.writeFileSync(outputPath, JSON.stringify(filteredCities, null, 2), 'utf-8');
  
  console.log(`JSON: ${originalCount} cities → ${filteredCount} cities (removed ${originalCount - filteredCount})`);
  console.log(`Output: ${outputPath}`);
}

/**
 * Process CSV file
 */
async function processCSV() {
  const inputPath = path.join(__dirname, '../dist/csv/cities.csv');
  const outputPath = path.join(__dirname, '../dist/csv/cities-filtered.csv');

  console.log('\nProcessing CSV file...');
  
  const data = fs.readFileSync(inputPath, 'utf-8');
  const lines = data.split('\n');
  const headers = lines[0].split(',');
  
  const cities: City[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    if (values.length >= 5) {
      cities.push({
        id: parseInt(values[0]),
        name: values[1],
        slug: values[2],
        province_id: parseInt(values[3]),
        county_id: parseInt(values[4])
      });
    }
  }
  
  const originalCount = cities.length;
  const filteredCities = filterCities(cities);
  const filteredCount = filteredCities.length;
  
  const csvWriter = createObjectCsvWriter({
    path: outputPath,
    header: [
      { id: 'id', title: 'id' },
      { id: 'name', title: 'name' },
      { id: 'slug', title: 'slug' },
      { id: 'province_id', title: 'province_id' },
      { id: 'county_id', title: 'county_id' }
    ]
  });
  
  await csvWriter.writeRecords(filteredCities);
  
  console.log(`CSV: ${originalCount} cities → ${filteredCount} cities (removed ${originalCount - filteredCount})`);
  console.log(`Output: ${outputPath}`);
}

/**
 * Process XLSX file
 */
async function processXLSX() {
  const inputPath = path.join(__dirname, '../dist/xlsx/cities.xlsx');
  const outputPath = path.join(__dirname, '../dist/xlsx/cities-filtered.xlsx');

  console.log('\nProcessing XLSX file...');
  
  const workbook = XLSX.readFile(inputPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const cities: City[] = XLSX.utils.sheet_to_json(worksheet);
  
  const originalCount = cities.length;
  const filteredCities = filterCities(cities);
  const filteredCount = filteredCities.length;
  
  const newWorkbook = XLSX.utils.book_new();
  const newWorksheet = XLSX.utils.json_to_sheet(filteredCities);
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
  
  XLSX.writeFile(newWorkbook, outputPath);
  
  console.log(`XLSX: ${originalCount} cities → ${filteredCount} cities (removed ${originalCount - filteredCount})`);
  console.log(`Output: ${outputPath}`);
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('City Filter Tool');
  console.log('Removing cities with dashes or underscores in slugs');
  console.log('='.repeat(60));
  
  try {
    await processJSON();
    await processCSV();
    await processXLSX();
    
    console.log('\n' + '='.repeat(60));
    console.log('✓ All files processed successfully!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n✗ Error processing files:', error);
    process.exit(1);
  }
}

main();
