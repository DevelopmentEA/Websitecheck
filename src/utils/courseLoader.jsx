// 1. Scan alle config.json bestanden (Eager = direct geladen bij start)
const configGlob = import.meta.glob('../data/**/config.json', { eager: true });

// 2. Scan alle vragen json's (Lazy = pas geladen als nodig)
const questionsGlob = import.meta.glob('../data/**/*.json');

/**
 * Haal de configuratie op basis van de foldernaam (bijv. 'BestuursrechtLU')
 */
export const getCourseConfig = (folderName) => {
  // We zoeken de key in de glob die overeenkomt met de foldernaam
  const path = Object.keys(configGlob).find(p => p.includes(`/data/${folderName}/config.json`));
  return path ? configGlob[path].default : null;
};

/**
 * Laad alle vragen voor één specifiek vak en bouw de database structuur
 */
export const getCourseQuestions = async (folderName) => {
  const data = {};
  
  // Filter alleen de JSON bestanden van dit specifieke vak (exclusief config.json)
  const relevantPaths = Object.keys(questionsGlob).filter(p => 
    p.includes(`/data/${folderName}/`) && !p.endsWith('config.json')
  );

  if (relevantPaths.length === 0) return null;

  // Loop door de bestanden en bouw het object: data[Week][Type] = inhoud
  for (const path of relevantPaths) {
    const parts = path.split('/');
    // We gaan ervan uit dat de structuur is: .../data/VakNaam/Week_X/Type.json
    const week = parts[parts.length - 2]; // bijv. 'Week_1'
    const type = parts[parts.length - 1].replace('.json', ''); // bijv. 'MK', 'Open', 'TrueFalse'

    if (!data[week]) data[week] = {};
    
    // De import functie uitvoeren om de data daadwerkelijk op te halen
    const module = await questionsGlob[path]();
    data[week][type] = module.default;
  }
  
  return data;
};