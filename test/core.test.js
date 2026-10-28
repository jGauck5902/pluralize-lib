import { test } from 'node:test';
import assert from 'node:assert/strict';

import { pluralize, singularize, countInflect } from '../src/index.js';

test('regular plurals add -s', () => {
  assert.equal(pluralize('cat'), 'cats');
  assert.equal(pluralize('dog'), 'dogs');
  assert.equal(pluralize('book'), 'books');
});

test('words ending in s, x, z, ch, sh add -es', () => {
  assert.equal(pluralize('bus'), 'buses');
  assert.equal(pluralize('box'), 'boxes');
  assert.equal(pluralize('buzz'), 'buzzes');
  assert.equal(pluralize('sandwich'), 'sandwiches');
  assert.equal(pluralize('wish'), 'wishes');
});

test('consonant + y becomes -ies', () => {
  assert.equal(pluralize('city'), 'cities');
  assert.equal(pluralize('party'), 'parties');
  assert.equal(pluralize('fly'), 'flies');
});

test('vowel + y just adds -s', () => {
  assert.equal(pluralize('day'), 'days');
  assert.equal(pluralize('key'), 'keys');
  assert.equal(pluralize('boy'), 'boys');
});

test('known -o words add -es', () => {
  assert.equal(pluralize('potato'), 'potatoes');
  assert.equal(pluralize('hero'), 'heroes');
  assert.equal(pluralize('tomato'), 'tomatoes');
});

test('irregular plurals are handled', () => {
  assert.equal(pluralize('child'), 'children');
  assert.equal(pluralize('person'), 'people');
  assert.equal(pluralize('man'), 'men');
  assert.equal(pluralize('woman'), 'women');
  assert.equal(pluralize('mouse'), 'mice');
  assert.equal(pluralize('goose'), 'geese');
  assert.equal(pluralize('foot'), 'feet');
  assert.equal(pluralize('tooth'), 'teeth');
  assert.equal(pluralize('ox'), 'oxen');
});

test('latin/greek irregulars', () => {
  assert.equal(pluralize('cactus'), 'cacti');
  assert.equal(pluralize('nucleus'), 'nuclei');
  assert.equal(pluralize('phenomenon'), 'phenomena');
  assert.equal(pluralize('criterion'), 'criteria');
  assert.equal(pluralize('analysis'), 'analyses');
  assert.equal(pluralize('crisis'), 'crises');
  assert.equal(pluralize('thesis'), 'theses');
});

test('f/fe -> ves irregulars', () => {
  assert.equal(pluralize('knife'), 'knives');
  assert.equal(pluralize('wife'), 'wives');
  assert.equal(pluralize('leaf'), 'leaves');
  assert.equal(pluralize('wolf'), 'wolves');
  assert.equal(pluralize('shelf'), 'shelves');
});

test('words that end in f but are regular', () => {
  assert.equal(pluralize('proof'), 'proofs');
});

test('uncountable words are returned unchanged', () => {
  assert.equal(pluralize('sheep'), 'sheep');
  assert.equal(pluralize('fish'), 'fish');
  assert.equal(pluralize('deer'), 'deer');
  assert.equal(pluralize('information'), 'information');
  assert.equal(pluralize('equipment'), 'equipment');
});

test('case is preserved for Title Case input', () => {
  assert.equal(pluralize('Cat'), 'Cats');
  assert.equal(pluralize('City'), 'Cities');
  assert.equal(pluralize('Child'), 'Children');
  assert.equal(pluralize('Person'), 'People');
  assert.equal(pluralize('Mouse'), 'Mice');
});

test('case is preserved for ALL CAPS input', () => {
  assert.equal(pluralize('CAT'), 'CATS');
  assert.equal(pluralize('CHILD'), 'CHILDREN');
  assert.equal(pluralize('CITY'), 'CITIES');
});

test('singularize reverses regular plurals', () => {
  assert.equal(singularize('cats'), 'cat');
  assert.equal(singularize('dogs'), 'dog');
  assert.equal(singularize('cities'), 'city');
  assert.equal(singularize('boxes'), 'box');
  assert.equal(singularize('sandwiches'), 'sandwich');
  assert.equal(singularize('parties'), 'party');
  assert.equal(singularize('potatoes'), 'potato');
});

test('singularize reverses irregular plurals', () => {
  assert.equal(singularize('children'), 'child');
  assert.equal(singularize('people'), 'person');
  assert.equal(singularize('men'), 'man');
  assert.equal(singularize('mice'), 'mouse');
  assert.equal(singularize('geese'), 'goose');
  assert.equal(singularize('feet'), 'foot');
  assert.equal(singularize('teeth'), 'tooth');
  assert.equal(singularize('cacti'), 'cactus');
  assert.equal(singularize('phenomena'), 'phenomenon');
  assert.equal(singularize('criteria'), 'criterion');
  assert.equal(singularize('analyses'), 'analysis');
});

test('singularize on uncountable words returns them unchanged', () => {
  assert.equal(singularize('sheep'), 'sheep');
  assert.equal(singularize('fish'), 'fish');
  assert.equal(singularize('deer'), 'deer');
  assert.equal(singularize('information'), 'information');
});

test('singularize preserves case', () => {
  assert.equal(singularize('Cats'), 'Cat');
  assert.equal(singularize('Children'), 'Child');
  assert.equal(singularize('Cities'), 'City');
  assert.equal(singularize('CATS'), 'CAT');
});

test('countInflect uses singular for 1, plural otherwise', () => {
  assert.equal(countInflect(1, 'cat'), '1 cat');
  assert.equal(countInflect(2, 'cat'), '2 cats');
  assert.equal(countInflect(0, 'cat'), '0 cats');
  assert.equal(countInflect(1, 'child'), '1 child');
  assert.equal(countInflect(3, 'child'), '3 children');
  assert.equal(countInflect(1, 'sheep'), '1 sheep');
  assert.equal(countInflect(5, 'sheep'), '5 sheep');
});

test('empty string is handled gracefully', () => {
  assert.equal(pluralize(''), '');
  assert.equal(singularize(''), '');
});

test('pluralizing an already-plural irregular returns it unchanged', () => {
  assert.equal(pluralize('children'), 'children');
  assert.equal(pluralize('people'), 'people');
  assert.equal(pluralize('mice'), 'mice');
});

test('singularizing an already-singular irregular returns it unchanged', () => {
  assert.equal(singularize('child'), 'child');
  assert.equal(singularize('person'), 'person');
  assert.equal(singularize('mouse'), 'mouse');
});

test('ss-ending words are not over-stripped by singularize', () => {
  // 'boss' is not a recognised plural form, so singularize leaves it unchanged.
  assert.equal(singularize('boss'), 'boss');
  // 'boss' pluralises to 'bosses', so singularize('bosses') -> 'boss'
  assert.equal(singularize('bosses'), 'boss');
});
