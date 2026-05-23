/**
 * @file index.js
 * @description Public API barrel for the geo-engine module.
 */

export { COUNTRY_RULES, ALL_COUNTRIES, COUNTRIES_BY_CONTINENT, CONTINENTS,
         getRules, formatNumber, formatCurrency, formatDate } from './countryRules.js';

export { useGeoStore, initGeoDetection } from './geoStore.js';

export { useRegion, useRegionCurrency, useRegionTax, useRegionMeasure } from './useRegion.js';

export { FloatingRegionSwitcher } from './FloatingRegionSwitcher';
