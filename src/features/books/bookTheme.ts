import { ClassificationKey, BookEntry } from '@/features/books/types';
import { colors } from '@/theme/colors';

export const getClassificationColor = (classificationKey: ClassificationKey): string => {
  switch (classificationKey) {
    case 'law':
      return colors.lavender;
    case 'historical':
    case 'historical_nt':
      return colors.yellowSoft;
    case 'poetic':
      return colors.skySoft;
    case 'major_prophets':
      return colors.coralSoft;
    case 'minor_prophets':
      return colors.mintSoft;
    case 'gospels':
      return colors.coralSoft;
    case 'pauline_letters':
      return colors.mint;
    case 'general_letters':
      return colors.lavenderSoft;
    case 'prophetic':
      return colors.sky;
    default:
      return colors.surface;
  }
};

export const getBookColor = (book: BookEntry): string =>
  getClassificationColor(book.classificationKey);
