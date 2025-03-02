import { ActionIcon, CopyButton as MantineCopyButton, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export type CopyButtonProps = {
  value: string;
  timeout?: number;
};

export function CopyButton({ value, timeout = 2000 }: CopyButtonProps) {
  const { t } = useTranslation();

  return (
    <MantineCopyButton value={value} timeout={timeout}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? t('common.copied') : t('common.copy')} withArrow position="left">
          <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      )}
    </MantineCopyButton>
  );
}
