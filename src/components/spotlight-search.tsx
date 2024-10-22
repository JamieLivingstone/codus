import { ActionIcon, rem } from '@mantine/core';
import { Spotlight, type SpotlightActionData, spotlight } from '@mantine/spotlight';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { tools } from '../tools';

const actions: SpotlightActionData[] = tools.map((tool) => ({
  id: tool.id,
  label: tool.nameKey,
  description: tool.descriptionKey,
  leftSection: <tool.icon style={{ width: rem(24), height: rem(24) }} stroke={1.5} />,
}));

interface SpotlightSearchProps {
  icon: ReactNode;
}

export function SpotlightSearch({ icon }: SpotlightSearchProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <ActionIcon onClick={spotlight.open} variant="default" size="lg" aria-label="Open spotlight search">
        {icon}
      </ActionIcon>

      <Spotlight
        actions={actions.map((action) => ({
          ...action,
          label: t(action.label ?? ''),
          description: t(action.description ?? ''),
          onClick: () => navigate({ to: tools.find((tool) => tool.id === action.id)?.path ?? '/' }),
        }))}
        nothingFound={t('components.spotlight-search.no-results')}
        highlightQuery
        searchProps={{
          leftSection: <IconSearch style={{ width: rem(20), height: rem(20) }} stroke={1.5} />,
          placeholder: t('components.spotlight-search.placeholder'),
        }}
      />
    </>
  );
}
