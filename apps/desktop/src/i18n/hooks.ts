import { useTranslation as useI18nTranslation } from 'react-i18next';
import type { NestedTranslationKey } from './types';

export function useTranslation() {
  const { t } = useI18nTranslation();

  return {
    t: (key: NestedTranslationKey) => t(key),
  };
}
