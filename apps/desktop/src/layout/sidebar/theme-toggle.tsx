import { Box, HStack, Text } from '@chakra-ui/react';
import { Tooltip } from '@components/tooltip';
import { useTranslation } from '@i18n/hooks';
import { useTheme } from 'next-themes';
import { LuMoon, LuSun } from 'react-icons/lu';

interface ThemeToggleProps {
  isCollapsed?: boolean;
}

export function ThemeToggle({ isCollapsed = false }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = resolvedTheme === 'dark';

  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  const buttonContent = (
    <Box
      onClick={toggleColorMode}
      cursor="pointer"
      borderRadius="xl"
      p={isCollapsed ? 2.5 : 3}
      w={isCollapsed ? '44px' : 'full'}
      h={isCollapsed ? '44px' : 'auto'}
      minH="44px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      _hover={{
        bg: 'bg.subtle',
      }}
      _active={{
        bg: 'bg.muted',
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      userSelect="none"
      overflow="hidden"
      data-testid="theme-toggle"
    >
      {isCollapsed ? (
        <Box color={isDark ? 'yellow.500' : 'blue.500'}>{isDark ? <LuSun size={20} /> : <LuMoon size={20} />}</Box>
      ) : (
        <HStack gap={3} w="full">
          <Box
            w={8}
            h={8}
            bg={isDark ? 'yellow.500/10' : 'blue.500/10'}
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.2s ease"
            flexShrink={0}
          >
            <Box color={isDark ? 'yellow.500' : 'blue.500'}>{isDark ? <LuSun size={16} /> : <LuMoon size={16} />}</Box>
          </Box>

          <Box flex={1} overflow="hidden" whiteSpace="nowrap">
            <Text fontSize="sm" fontWeight="medium" color="fg" lineHeight="shorter">
              {isDark ? t('theme.dark') : t('theme.light')}
            </Text>
            <Text fontSize="xs" color="fg.muted" lineHeight="shorter">
              {t('theme.toggle')}
            </Text>
          </Box>

          <Box
            w={8}
            h={4}
            bg="bg.emphasized"
            borderRadius="full"
            position="relative"
            border="1px solid"
            borderColor="border.subtle"
            flexShrink={0}
          >
            <Box
              w={3}
              h={3}
              bg="fg"
              borderRadius="full"
              position="absolute"
              top="50%"
              transform={`translateY(-50%) translateX(${isDark ? '16px' : '2px'})`}
              transition="transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
              boxShadow="sm"
            />
          </Box>
        </HStack>
      )}
    </Box>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={t('theme.toggle')} openDelay={500} positioning={{ placement: 'right' }} showArrow>
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
}
