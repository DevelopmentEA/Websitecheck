// --- 1. Importeer de databases ---
import { questionsDb as bestuursDb } from './BestuursrechtLU/index';
import { questionsDb as euDb } from './EURechtLU/index';
import { questionsDb as grondslagenDb } from './GrondslagenRechtLU/index';

// --- 2. Configureer de MasterData ---
export const masterData = {
  // VAK 1: EU Recht
  "EU-neo-2026": {
    title: "EU Recht",
    db: euDb,
    accent: "#6EE7B7",
    tag: "Lawbooks Premium 2026",
    path: "/course/eu-recht"
  },

  // VAK 2: Grondslagen Recht - GEFIXT: komt nu overeen met sr1-premium-k92
  "sr1-premium-k92": {
    title: "Grondslagen Recht",
    db: grondslagenDb,
    accent: "#6EE7B7",
    tag: "Lawbooks Premium 2026",
    path: "/course/grondslagen"
  },

  // VAK 3: Bestuursrecht
  "bestuursrecht-x72": {
    title: "Bestuursrecht",
    db: bestuursDb,
    accent: "#6EE7B7",
    tag: "Lawbooks Premium 2026",
    path: "/course/bestuursrecht"
  },

  // VAK 4: Goederenrecht
  "Goederen-premium-k92": {
    title: "Goederenrecht",
    db: grondslagenDb, 
    accent: "#6EE7B7",
    tag: "Lawbooks Premium 2026",
    path: "/course/goederenrecht"
  }
};

/**
 * HOE VOEG JE EEN NIEUW VAK TOE?
 * 1. Maak een nieuwe map aan in src/data/ (bijv. 'staatsrecht').
 * 2. Voeg de JSON bestanden en de index.js toe in die map.
 * 3. Importeer de database hierboven: import { questionsDb as staatsDb } from './staatsrecht/index';
 * 4. Voeg een nieuw object toe aan masterData met een unieke slug.
 */