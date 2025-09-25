import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export async function parseExcelData() {
  try {
    const filePath = path.join(process.cwd(), 'Nigeria_Biodiversity_Data.xlsx');
    const workbook = XLSX.readFile(filePath);
    
    // Parse each sheet
    const sheets = workbook.SheetNames;
    const result = {};
    
    sheets.forEach(sheet => {
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      result[sheet] = data;
    });
    
    return result;
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return {};
  }
}

export async function getPlants() {
  const data = await parseExcelData();
  return data.Plants || [];
}

export async function getAnimals() {
  const data = await parseExcelData();
  return data.Animals || [];
}

export async function getParks() {
  const data = await parseExcelData();
  return data.Parks || [];
}

export async function getThreatenedSpecies() {
  const data = await parseExcelData();
  return data.Threatened || [];
}

export async function searchData(query, scope = 'all') {
  const data = await parseExcelData();
  const searchQuery = query.toLowerCase();
  
  let results = [];
  
  if (scope === 'all' || scope === 'plants') {
    const plants = data.Plants || [];
    const matchedPlants = plants.filter(plant => 
      Object.values(plant).some(value => 
        String(value).toLowerCase().includes(searchQuery)
      )
    );
    results = [...results, ...matchedPlants.map(plant => ({...plant, type: 'plant'}))];
  }
  
  if (scope === 'all' || scope === 'animals') {
    const animals = data.Animals || [];
    const matchedAnimals = animals.filter(animal => 
      Object.values(animal).some(value => 
        String(value).toLowerCase().includes(searchQuery)
      )
    );
    results = [...results, ...matchedAnimals.map(animal => ({...animal, type: 'animal'}))];
  }
  
  if (scope === 'all' || scope === 'parks') {
    const parks = data.Parks || [];
    const matchedParks = parks.filter(park => 
      Object.values(park).some(value => 
        String(value).toLowerCase().includes(searchQuery)
      )
    );
    results = [...results, ...matchedParks.map(park => ({...park, type: 'park'}))];
  }
  
  if (scope === 'all' || scope === 'threatened') {
    const threatened = data.Threatened || [];
    const matchedThreatened = threatened.filter(species => 
      Object.values(species).some(value => 
        String(value).toLowerCase().includes(searchQuery)
      )
    );
    results = [...results, ...matchedThreatened.map(species => ({...species, type: 'threatened'}))];
  }
  
  return results;
}