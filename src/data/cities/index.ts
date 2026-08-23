import type { CityInfo } from '../../types';
import { ZAGAZIG_CITY } from './zagazig';
import { CAIRO_CITY } from './cairo';

/** سجل المدن التي تحتوي على بيانات مفعّلة داخل التطبيق. */
export const CITIES: CityInfo[] = [ZAGAZIG_CITY, CAIRO_CITY];
export const DEFAULT_CITY_ID = 'cairo';
export { ZAGAZIG_CITY, CAIRO_CITY };
