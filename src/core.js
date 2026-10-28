/**
 * Core pluralization engine for pluralize-lib.
 *
 * Design decision: this module returns pure functions with no shared mutable
 * state. The irregular and uncountable tables are module-level constants
 * so callers can rely on stable behaviour without injecting dictionaries.
 */

/**
 * Words whose plural is NOT formed by applying a regular suffix rule.
 * Stored lowercase; lookup is case-insensitive.
 */
const IRREGULAR = {
  // [singular, plural]
  child: 'children',
  person: 'people',
  man: 'men',
  woman: 'women',
  mouse: 'mice',
  goose: 'geese',
  foot: 'feet',
  tooth: 'teeth',
  ox: 'oxen',
  cactus: 'cacti',
  fungus: 'fungi',
  nucleus: 'nuclei',
  syllabus: 'syllabi',
  radius: 'radii',
  octopus: 'octopi',
  cactus: 'cacti',
  alumnus: 'alumni',
  phenomenon: 'phenomena',
  criterion: 'criteria',
  datum: 'data',
  medium: 'media',
  bacterium: 'bacteria',
  analysis: 'analyses',
  crisis: 'crises',
  thesis: 'theses',
  diagnosis: 'diagnoses',
  parenthesis: 'parentheses',
  prognosis: 'prognoses',
  schema: 'schemata',
  die: 'dice',
  index: 'indices',
  appendix: 'appendices',
  matrix: 'matrices',
  beau: 'beaux',
  tableau: 'tableaux',
  bureau: 'bureaux',
  goose: 'geese',
  louse: 'lice',
  life: 'lives',
  knife: 'knives',
  wife: 'wives',
  leaf: 'leaves',
  loaf: 'loaves',
  half: 'halves',
  self: 'selves',
  elf: 'elves',
  calf: 'calves',
  wolf: 'wolves',
  thief: 'thieves',
  shelf: 'shelves',
  hoof: 'hooves',
  proof: 'proofs'
};

/**
 * Words that do not change between singular and plural.
 * These are checked BEFORE irregular rules so they always win.
 */
const UNCOUNTABLE = new Set([
  'sheep', 'fish', 'deer', 'moose', 'species', 'series', 'aircraft',
  'information', 'equipment', 'news', 'rice', 'money', 'jeans',
  'police', 'poultry', 'cattle', 'offspring', 'data', 'metadata',
  'agenda', 'salt', 'sugar', 'water', 'milk', 'butter', 'cheese',
  'furniture', 'luggage', 'baggage', 'hardware', 'software',
  'poetry', 'art', 'music', 'research', 'knowledge', 'wisdom',
  'advice', 'evidence', 'homework', 'housework', 'scenery',
  'traffic', 'weather', 'nature', 'space', 'time', 'sunshine'
]);

/**
 * Reverse lookup: irregular plural -> singular form.
 */
const IRREGULAR_REVERSE = {};
for (const [s, p] of Object.entries(IRREGULAR)) {
  IRREGULAR_REVERSE[p] = s;
}

/**
 * Determines whether a word is capitalised (first letter upper, rest lower).
 */
function isCapitalized(word) {
  return word.length > 0 &&
    word[0] === word[0].toUpperCase() &&
    word[0] !== word[0].toLowerCase();
}

/**
 * Preserves the capitalisation pattern of `original` on `target`.
 * Handles Title Case and ALL CAPS; otherwise returns target unchanged.
 */
function matchCase(original, target) {
  if (original === original.toUpperCase() && original.length > 0) {
    return target.toUpperCase();
  }
  if (isCapitalized(original)) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
  return target;
}

/**
 * Applies the standard English plural suffix rules.
 * Order matters: -ch/-sh/-x/-ss/-z take -es; consonant+y takes -ies;
 * some -f/-fe take -ves; -o takes -es for a known set; otherwise -s.
 */
function regularPlural(lower) {
  // -us -> -i handled by IRREGULAR table, not here.

  if (/(?:s|x|z|ch|sh)$/.test(lower)) {
    return lower + 'es';
  }

  // consonant + y -> ies
  const yMatch = lower.match(/([^aeiou])y$/i);
  if (yMatch) {
    return lower.slice(0, -1) + 'ies';
  }

  // Known -o words that take -es
  const oEsSet = ['potato', 'tomato', 'hero', 'echo', 'torpedo', 'veto', 'domino', 'mosquito', 'tornado', 'volcano', 'buffalo', 'go'];
  if (lower.endsWith('o') && oEsSet.includes(lower)) {
    return lower + 'es';
  }

  return lower + 's';
}

/**
 * Applies regular de-pluralisation rules.
 */
function regularSingular(lower) {
  if (lower.endsWith('ies') && lower.length > 3) {
    return lower.slice(0, -3) + 'y';
  }
  if (lower.endsWith('ses') || lower.endsWith('xes') || lower.endsWith('zes') || lower.endsWith('ches') || lower.endsWith('shes')) {
    return lower.slice(0, -2);
  }
  if (lower.endsWith('oes') && lower.length > 3) {
    return lower.slice(0, -2);
  }
  if (lower.endsWith('es') && lower.length > 2) {
    // Only strip if singular would not end in 'e' (to avoid turning 'rose' -> 'ros')
    // We check the letter before 'es': if it's s/x/z/ch/sh we already handled.
    // Default: strip 's' only for -es when ambiguous, to be conservative.
    return lower.slice(0, -1);
  }
  if (lower.endsWith('s') && !lower.endsWith('ss')) {
    return lower.slice(0, -1);
  }
  return lower;
}

/**
 * Converts a singular English word to its plural form.
 *
 * Handles irregular nouns (child -> children), uncountable nouns (sheep -> sheep),
 * and the common regular suffix rules. Case is preserved for Title Case and ALL CAPS
 * input; mixed-case input is left untouched on the non-suffix portion.
 *
 * @param {string} word - The singular word to pluralise.
 * @returns {string} The plural form.
 */
export function pluralize(word) {
  if (!word || word.length === 0) return word;

  const lower = word.toLowerCase();

  if (UNCOUNTABLE.has(lower)) {
    return word;
  }

  if (Object.prototype.hasOwnProperty.call(IRREGULAR, lower)) {
    return matchCase(word, IRREGULAR[lower]);
  }

  // If the word IS already an irregular plural, return as-is.
  if (Object.prototype.hasOwnProperty.call(IRREGULAR_REVERSE, lower)) {
    return word;
  }

  return matchCase(word, regularPlural(lower));
}

/**
 * Converts a plural English word to its singular form.
 *
 * Mirrors the pluralize function: uncountable words are returned unchanged,
 * irregular plurals map back to their singular forms, and regular suffix
 * rules are reversed.
 *
 * @param {string} word - The plural word to singularise.
 * @returns {string} The singular form.
 */
export function singularize(word) {
  if (!word || word.length === 0) return word;

  const lower = word.toLowerCase();

  if (UNCOUNTABLE.has(lower)) {
    return word;
  }

  if (Object.prototype.hasOwnProperty.call(IRREGULAR_REVERSE, lower)) {
    return matchCase(word, IRREGULAR_REVERSE[lower]);
  }

  // If the word IS already an irregular singular, return as-is.
  if (Object.prototype.hasOwnProperty.call(IRREGULAR, lower)) {
    return word;
  }

  return matchCase(word, regularSingular(lower));
}

/**
 * Returns `count` followed by the appropriately inflected form of `word`.
 *
 * Uses singularize when count === 1, pluralize otherwise. This is a convenience
 * wrapper; the inflection decision is intentionally strict about === 1 rather
 * than checking truthiness, so that 0 correctly yields a plural.
 *
 * @param {number} count - The quantity.
 * @param {string} word - The noun to inflect.
 * @returns {string} A string like "2 dogs" or "1 dog".
 */
export function countInflect(count, word) {
  const inflected = (count === 1) ? singularize(word) : pluralize(word);
  return count + ' ' + inflected;
}
