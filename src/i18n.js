// Lightweight localization. Supported languages: English, Italian, Spanish, Dutch.
export const LANGS = ['en', 'it', 'es', 'nl'];
const LANG_NAMES = { en: 'English', it: 'Italiano', es: 'Español', nl: 'Nederlands' };

const STRINGS = {
  en: {
    paused: 'PAUSED',
    resume: 'Resume',
    save: 'Save game',
    reload: 'Reload last save',
    newGame: 'New game',
    language: 'Language',
    saved: '✓ Saved',
    pauseHint: '↑↓ select   ENTER pick   SPACE resume',
    openDoors: 'Open all doors first!',
    groundFloor: 'Ground floor!',
    floorClear: 'FLOOR CLEAR!',
    bank: 'Bank',
    splashSubtitle: 'a math maze adventure',
    floor: 'FLOOR',
    room: 'Room',
    buildFloor: 'Floor',
    locked: '(locked)',
    nextFloor: 'NEXT FLOOR',
    buildHint: '↑↓ navigate   SPACE/ENTER select',
    confirmReload: 'Reload your last saved game? Anything since your last save will be lost.',
    confirmNew: 'Start a new game? This erases your hotel, coins and progress.',
  },
  it: {
    paused: 'IN PAUSA',
    resume: 'Riprendi',
    save: 'Salva partita',
    reload: 'Ricarica salvataggio',
    newGame: 'Nuova partita',
    language: 'Lingua',
    saved: '✓ Salvato',
    pauseHint: '↑↓ scegli   ENTER conferma   SPACE riprendi',
    openDoors: 'Apri prima tutte le porte!',
    groundFloor: 'Piano terra!',
    floorClear: 'PIANO COMPLETATO!',
    bank: 'Banca',
    splashSubtitle: 'un labirinto matematico',
    floor: 'PIANO',
    room: 'Stanza',
    buildFloor: 'Piano',
    locked: '(bloccato)',
    nextFloor: 'PROSSIMO PIANO',
    buildHint: '↑↓ naviga   SPACE/ENTER scegli',
    confirmReload: "Ricaricare l'ultimo salvataggio? I progressi non salvati andranno persi.",
    confirmNew: 'Iniziare una nuova partita? Cancellerai hotel, monete e progressi.',
  },
  es: {
    paused: 'EN PAUSA',
    resume: 'Continuar',
    save: 'Guardar partida',
    reload: 'Cargar partida',
    newGame: 'Nueva partida',
    language: 'Idioma',
    saved: '✓ Guardado',
    pauseHint: '↑↓ elegir   ENTER aceptar   SPACE continuar',
    openDoors: '¡Abre todas las puertas primero!',
    groundFloor: '¡Planta baja!',
    floorClear: '¡PISO COMPLETADO!',
    bank: 'Banco',
    splashSubtitle: 'un laberinto matemático',
    floor: 'PISO',
    room: 'Habitación',
    buildFloor: 'Piso',
    locked: '(bloqueado)',
    nextFloor: 'SIGUIENTE PISO',
    buildHint: '↑↓ navegar   SPACE/ENTER elegir',
    confirmReload: '¿Cargar la última partida guardada? Se perderá lo no guardado.',
    confirmNew: '¿Empezar una nueva partida? Se borrarán hotel, monedas y progreso.',
  },
  nl: {
    paused: 'GEPAUZEERD',
    resume: 'Hervatten',
    save: 'Spel opslaan',
    reload: 'Laatste opslag laden',
    newGame: 'Nieuw spel',
    language: 'Taal',
    saved: '✓ Opgeslagen',
    pauseHint: '↑↓ kiezen   ENTER bevestigen   SPACE hervatten',
    openDoors: 'Open eerst alle deuren!',
    groundFloor: 'Begane grond!',
    floorClear: 'VERDIEPING KLAAR!',
    bank: 'Bank',
    splashSubtitle: 'een rekendoolhof-avontuur',
    floor: 'VERDIEPING',
    room: 'Kamer',
    buildFloor: 'Verdieping',
    locked: '(op slot)',
    nextFloor: 'VOLGENDE VERDIEPING',
    buildHint: '↑↓ navigeren   SPACE/ENTER kiezen',
    confirmReload: 'Laatste opslag laden? Niet-opgeslagen voortgang gaat verloren.',
    confirmNew: 'Nieuw spel starten? Dit wist je hotel, munten en voortgang.',
  },
};

let current = 'en';

export function setLanguage(lang) {
  if (STRINGS[lang]) current = lang;
}

export function getLanguage() {
  return current;
}

export function nextLanguage() {
  const i = LANGS.indexOf(current);
  current = LANGS[(i + 1) % LANGS.length];
  return current;
}

export function langName(lang = current) {
  return LANG_NAMES[lang] || lang;
}

// Best-effort match of the browser language to a supported one.
export function detectLanguage() {
  const nav = (typeof navigator !== 'undefined' && navigator.language) || 'en';
  const code = nav.slice(0, 2).toLowerCase();
  return LANGS.includes(code) ? code : 'en';
}

export function t(key) {
  return (STRINGS[current] && STRINGS[current][key]) || STRINGS.en[key] || key;
}
