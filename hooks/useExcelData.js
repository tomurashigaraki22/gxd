'use client';

import { useState, useEffect } from 'react';

export function useExcelData(type = 'all') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/biodiversity.json');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const jsonData = await response.json();
        
        if (type === 'all') {
          setData(jsonData);
        } else if (jsonData[type]) {
          setData(jsonData[type]);
        } else {
          setData([]);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    fetchData();
  }, [type]);
  
  return { data, loading, error };
}

export function useSearch(query, scope = 'all') {
  const { data: allData, loading, error } = useExcelData('all');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (loading || error || !query.trim()) {
      setResults([]);
      return;
    }
    
    const searchQuery = query.toLowerCase();
    let searchResults = [];
    
    if (scope === 'all' || scope === 'Plants') {
      const plants = allData.Plants || [];
      const matchedPlants = plants.filter(plant => 
        Object.values(plant).some(value => 
          String(value).toLowerCase().includes(searchQuery)
        )
      );
      searchResults = [...searchResults, ...matchedPlants.map(plant => ({...plant, type: 'plant'}))];
    }
    
    if (scope === 'all' || scope === 'Animals') {
      const animals = allData.Animals || [];
      const matchedAnimals = animals.filter(animal => 
        Object.values(animal).some(value => 
          String(value).toLowerCase().includes(searchQuery)
        )
      );
      searchResults = [...searchResults, ...matchedAnimals.map(animal => ({...animal, type: 'animal'}))];
    }
    
    if (scope === 'all' || scope === 'Parks') {
      const parks = allData.Parks || [];
      const matchedParks = parks.filter(park => 
        Object.values(park).some(value => 
          String(value).toLowerCase().includes(searchQuery)
        )
      );
      searchResults = [...searchResults, ...matchedParks.map(park => ({...park, type: 'park'}))];
    }
    
    if (scope === 'all' || scope === 'Threatened') {
      const threatened = allData.Threatened || [];
      const matchedThreatened = threatened.filter(species => 
        Object.values(species).some(value => 
          String(value).toLowerCase().includes(searchQuery)
        )
      );
      searchResults = [...searchResults, ...matchedThreatened.map(species => ({...species, type: 'threatened'}))];
    }
    
    setResults(searchResults);
  }, [query, scope, allData, loading, error]);
  
  return { results, loading, error };
}