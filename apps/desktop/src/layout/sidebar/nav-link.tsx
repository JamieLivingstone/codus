import { Box, Link, Text } from '@chakra-ui/react';
import { Tooltip } from '@components/tooltip.tsx';
import { Link as RouterLink, useLocation } from '@tanstack/react-router';
import type { ComponentType } from 'react';

interface NavLinkProps {
  path: string;
  icon: ComponentType<{ size: number }>;
  label: string;
  isCollapsed: boolean;
}

export function NavLink({ path, icon: Icon, label, isCollapsed }: NavLinkProps) {
  const location = useLocation();
  const isActive = location.pathname === path;

  const linkContent = (
    <Link
      asChild
      w={isCollapsed ? '44px' : 'full'}
      p={isCollapsed ? 2.5 : 3}
      textDecoration="none"
      display="flex"
      alignItems="center"
      justifyContent={isCollapsed ? 'center' : 'flex-start'}
      gap={3}
      borderRadius="xl"
      bg={isActive ? 'blue.500/10' : 'transparent'}
      color={isActive ? 'blue.500' : 'fg.muted'}
      border="1px solid"
      borderColor={isActive ? 'blue.500/20' : 'transparent'}
      _hover={{
        textDecoration: 'none',
        bg: isActive ? 'blue.500/15' : 'bg.subtle',
        color: isActive ? 'blue.500' : 'fg',
        borderColor: isActive ? 'blue.500/25' : 'border.subtle',
      }}
      _active={{
        bg: isActive ? 'blue.500/20' : 'bg.muted',
      }}
      cursor="pointer"
      transition="all 0.15s ease"
      position="relative"
      overflow="hidden"
      minH="44px"
      fontWeight={isActive ? 'semibold' : 'medium'}
    >
      <RouterLink to={path}>
        {isActive && !isCollapsed && (
          <Box
            position="absolute"
            left={0}
            top="50%"
            transform="translateY(-50%)"
            w="3px"
            h="60%"
            bg="blue.500"
            borderRadius="full"
            transition="all 0.2s ease"
          />
        )}

        <Box
          display="flex"
          alignItems="center"
          gap={isCollapsed ? 0 : 3}
          w="full"
          position="relative"
          zIndex={1}
          justifyContent={isCollapsed ? 'center' : 'flex-start'}
        >
          <Box display="flex" alignItems="center" justifyContent="center" w={5} h={5}>
            <Icon size={18} />
          </Box>
          {!isCollapsed && (
            <Text fontSize="sm" fontWeight="inherit" lineHeight="shorter">
              {label}
            </Text>
          )}
        </Box>
      </RouterLink>
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={label} positioning={{ placement: 'right' }} openDelay={300} showArrow>
        {linkContent}
      </Tooltip>
    );
  }

  return linkContent;
}
