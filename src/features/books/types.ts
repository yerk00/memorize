export type Testament = 'old' | 'new';

export type ClassificationKey =
  | 'law'
  | 'historical'
  | 'poetic'
  | 'major_prophets'
  | 'minor_prophets'
  | 'gospels'
  | 'historical_nt'
  | 'pauline_letters'
  | 'general_letters'
  | 'prophetic';

export type BookEntry = {
  id: string;
  testament: Testament;
  orderNumber: number;
  classificationKey: ClassificationKey;
  classificationLabel: string;
  name: string;
  chapterCount: number;
  keyPhrase: string;
};