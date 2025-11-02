import { Box, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from '@i18n/hooks';
import { Logo, NavLink, SidebarDivider, SidebarToggle, ThemeToggle } from '@layout/sidebar';
import { Outlet } from '@tanstack/react-router';
import { getVersion } from '@tauri-apps/api/app';
import { useEffect, useState } from 'react';
import { LuCpu, LuMessageCircle, LuSettings, LuWrench } from 'react-icons/lu';

export function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [version, setVersion] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      try {
        const version = await getVersion();
        setVersion(version);
      } catch {
        setVersion('0.0.0');
      }
    })();
  }, []);

  const navigationItems = [
    { icon: LuMessageCircle, label: t('navigation.chat'), path: '/chat' },
    { icon: LuCpu, label: t('navigation.models'), path: '/models' },
    { icon: LuWrench, label: t('navigation.tools'), path: '/tools' },
    { icon: LuSettings, label: t('navigation.settings'), path: '/settings' },
  ];

  return (
    <Flex h="100vh" bg="bg" color="fg" overflow="hidden">
      {/* Sidebar */}
      <Box
        w={isCollapsed ? '64px' : '240px'}
        h="full"
        bg="bg.panel"
        borderRight="1px solid"
        borderColor="border.subtle"
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        position="relative"
        boxShadow="sm"
        zIndex={10}
        flexShrink={0}
        data-testid="sidebar"
      >
        <VStack gap={0} h="full">
          <Box w="full" p={isCollapsed ? 3 : 4} position="relative">
            {!isCollapsed ? (
              <HStack justify="space-between" alignItems="center">
                <HStack gap={3}>
                  <Logo isCollapsed={false} />
                  <VStack gap={0} alignItems="flex-start">
                    <Text fontSize="md" fontWeight="bold" lineHeight="shorter" letterSpacing="tight">
                      Codus
                    </Text>
                    <Text fontSize="xs" color="fg.muted" lineHeight="shorter" fontWeight="medium">
                      v{version}
                    </Text>
                  </VStack>
                </HStack>
                <SidebarToggle isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)} />
              </HStack>
            ) : (
              <VStack gap={3} alignItems="center">
                <Logo isCollapsed={true} />
                <SidebarToggle isCollapsed={isCollapsed} onClick={() => setIsCollapsed(!isCollapsed)} />
              </VStack>
            )}
          </Box>

          <SidebarDivider />

          <VStack
            gap={1}
            p={isCollapsed ? 2 : 3}
            pt={3}
            w="full"
            flex={1}
            alignItems={isCollapsed ? 'center' : 'stretch'}
          >
            {!isCollapsed && (
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="fg.muted"
                mb={2}
                textTransform="uppercase"
                letterSpacing="wider"
                px={2}
              >
                {t('layout.sidebar.navigation')}
              </Text>
            )}
            {navigationItems.map((item) => (
              <NavLink key={item.path} path={item.path} icon={item.icon} label={item.label} isCollapsed={isCollapsed} />
            ))}
          </VStack>

          <Box w="full" p={isCollapsed ? 2 : 3} pt={2}>
            <SidebarDivider />
            <Box mt={3} display="flex" justifyContent={isCollapsed ? 'center' : 'flex-start'}>
              <ThemeToggle isCollapsed={isCollapsed} />
            </Box>
          </Box>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} bg="bg" position="relative" overflow="hidden">
        <Box h="full" overflowY="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
}
