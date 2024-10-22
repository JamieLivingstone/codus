import { Container, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export default function JwtDecoder() {
  const { t } = useTranslation();

  return (
    <Container size="xl">
      <Title>{t('tools.jwt-decoder.name')}</Title>
    </Container>
  );
}
