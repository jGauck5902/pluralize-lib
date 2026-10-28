# pluralize-lib

A small, zero-dependency TypeScript library for pluralizing and singularizing English nouns, including irregular forms.

## Installation

```bash
npm install pluralize-lib
```

## Usage

```javascript
import { pluralize, singularize, countInflect } from 'pluralize-lib';

pluralize('cat');      // 'cats'
pluralize('child');    // 'children'
pluralize('mouse');    // 'mice'
pluralize('City');     // 'Cities' (case preserved)

singularize('dogs');         // 'dog'
singularize('people');       // 'person'
singularize('sandwiches');   // 'sandwich'

countInflect(1, 'apple');    // '1 apple'
countInflect(3, 'child');    // '3 children'
```

## Why this exists

English noun pluralization has enough irregular cases that a naive `+ 's'` approach fails visibly on common words. This library bundles a focused table of irregular nouns (child → children, cactus → cacti, analysis → analyses) alongside the standard suffix rules (-es after s/x/z/ch/sh, consonant+y → -ies, a known set of -o words → -oes). It also treats a curated list of nouns as uncountable (sheep, fish, information) so they pass through unchanged.

The trade-off: the irregular table is hand-maintained and deliberately finite. It covers the nouns that come up most often in general prose. It will not handle every loanword or domain-specific term. If you need to add a word, the tables in `src/core.js` are plain objects you can extend.

## Edge cases you will hit

**Mixed case.** Only Title Case (`City`) and ALL CAPS (`CITY`) are explicitly handled. A word like `iPHONE` will have its suffix portion changed but the interior casing of the stem is left alone, which may look odd. The library prioritises not corrupting input over guessing what you meant.

**Ambiguous -es stripping in singularize.** When singularizing a word ending in `-es`, the library strips only the trailing `s` unless the ending clearly matches a regular plural pattern (`-ses`, `-xes`, `-zes`, `-ches`, `-shes`). This means `singularize('horses')` returns `horse` (correct), but `singularize('boss')` returns `bos` — because `boss` is not a recognized plural form. Use `singularize` on actual plurals, not on words that merely end in `s`.

**Already-plural input.** Calling `pluralize` on an irregular plural (e.g. `children`) returns it unchanged. This avoids producing `childrens`, but it also means the function is not a reliable detector of whether a word is already plural.

## Exports

- `pluralize(word: string): string` — singular → plural
- `singularize(word: string): string` — plural → singular
- `countInflect(count: number, word: string): string` — returns `"<count> <word>"` with the word inflected based on whether count is exactly 1
