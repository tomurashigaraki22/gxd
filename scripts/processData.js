// Use CommonJS syntax instead of ESM
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

function processData() {
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
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'public/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write the data to a JSON file
    fs.writeFileSync(
      path.join(dataDir, 'biodiversity.json'),
      JSON.stringify(result, null, 2)
    );
    
    console.log('Excel data processed and saved to public/data/biodiversity.json');
  } catch (error) {
    console.error('Error processing Excel data:', error);
  }
}

processData();