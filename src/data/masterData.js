// --- 1. Importeer de databases van de verschillende vakken ---
// Zorg dat de paden kloppen met je mappenstructuur (bijv. src/data/ipr/index.js)
import { questionsDb as iprDb } from './BestuursrechtLU/index';
import { questionsDb as srDb } from './EURechtLU/index';
import { questionsDb as brDb } from './GrondslagenRechtLU/index';

// --- 2. Configureer de MasterData ---
export const masterData = {
  // VAK 1: Internationaal Privaatrecht
  "ipr-neo-2026": {
    title: "IPR",
    db: iprDb,
    accent: "#6EE7B7", // De Neo Groene kleur
    tag: "Lawbooks Neo 2026",
    path: "/course/ipr-module" // De Learnworlds URL voor extra path-check
  },

  // VAK 2: Strafrecht I
  "sr1-premium-k92": {
    title: "Strafrecht I",
    db: srDb,
    accent: "#6EE7B7", // Rood-achtig voor Strafrecht
    tag: "Lawbooks Premium 2026",
    path: "/course/strafrecht-1"
  },

  // VAK 3: Bestuursrecht
  "bestuursrecht-x72": {
    title: "Bestuursrecht",
    db: brDb,
    accent: "#6EE7B7", // Blauw-achtig voor Bestuursrecht
    tag: "Lawbooks Premium 2026",
    path: "/course/bestuursrecht"
  }
};

/**
 * HOE VOEG JE EEN NIEUW VAK TOE?
 * 1. Maak een nieuwe map aan in src/data/ (bijv. 'staatsrecht').
 * 2. Voeg de JSON bestanden en de index.js toe in die map.
 * 3. Importeer de database hierboven: import { questionsDb as staatsDb } from './staatsrecht/index';
 * 4. Voeg een nieuw object toe aan masterData met een unieke slug.
 */
