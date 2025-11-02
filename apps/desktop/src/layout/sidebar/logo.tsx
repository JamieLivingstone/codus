import { Box, Link } from '@chakra-ui/react';
import { Tooltip } from '@components/tooltip.tsx';
import { useTranslation } from '@i18n/hooks';
import { Link as RouterLink } from '@tanstack/react-router';
import { LuCode } from 'react-icons/lu';

interface LogoProps {
  isCollapsed: boolean;
}

export function Logo({ isCollapsed }: LogoProps) {
  const { t } = useTranslation();

  const logoBox = (
    <Box
      w={10}
      h={10}
      bg="blue.500"
      borderRadius="lg"
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      _hover={{
        bg: 'blue.600',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
      }}
      _active={{
        transform: 'translateY(0)',
      }}
      transition="all 0.15s ease"
      border="1px solid"
      borderColor="blue.400"
    >
      <LuCode size={20} color="white" />
    </Box>
  );

  const content = (
    <Link asChild textDecoration="none" _hover={{ textDecoration: 'none' }}>
      <RouterLink to="/">{logoBox}</RouterLink>
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={t('layout.sidebar.home')} positioning={{ placement: 'right' }} showArrow>
        {content}
      </Tooltip>
    );
  }

  return content;
}
