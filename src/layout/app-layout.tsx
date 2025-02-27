import { Accordion, ActionIcon, AppShell, Burger, Code, Group, ScrollArea, useMantineColorScheme } from '@mantine/core';
import { IconBrandGithub, IconHome, IconMoon, IconSearch, IconSun } from '@tabler/icons-react';
import { Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ActionIconLink, TextLink } from '../components/link';
import { ModelSwitcher } from '../components/model-switcher';
import { SpotlightSearch } from '../components/spotlight-search';
import { toolCategories } from '../tools';
import classes from './app-layout.module.css';

interface AppLayoutProps {
  version: string;
}

export function AppLayout({ version }: AppLayoutProps) {
  const [mobileOpened, setMobileOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { t } = useTranslation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group w="33%">
            <Burger opened={mobileOpened} onClick={() => setMobileOpened((o) => !o)} hiddenFrom="sm" size="sm" />
            <TextLink size="xl" fw="bold" to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Codus
            </TextLink>
            <Code fw={700}>v{version}</Code>
          </Group>

          <Group w="33%" justify="center">
            <ModelSwitcher />
          </Group>

          <Group w="33%" justify="flex-end">
            <ActionIconLink variant="default" to="/" size="lg" aria-label="Home">
              <IconHome size={20} />
            </ActionIconLink>
            <SpotlightSearch icon={<IconSearch size={20} />} />
            <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? (
                <IconSun data-testid="toggle-light" size={20} />
              ) : (
                <IconMoon data-testid="toggle-dark" size={20} />
              )}
            </ActionIcon>
            <ActionIcon
              variant="default"
              component="a"
              href="https://github.com/JamieLivingstone/codus"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              aria-label="GitHub repository"
            >
              <IconBrandGithub size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p={0} className={classes.sidebar}>
        <ScrollArea>
          <Accordion chevronPosition="right" chevronSize={14} classNames={{ chevron: classes.chevron }}>
            {toolCategories.map((category) => (
              <Accordion.Item key={category.id} value={category.id}>
                <Accordion.Control icon={<category.icon size={22} stroke={1.5} />}>
                  {t(category.nameKey)}
                </Accordion.Control>
                <Accordion.Panel>
                  {category.tools.map((tool, index) => (
                    <TextLink
                      key={tool.id}
                      to={tool.path}
                      className={classes.toolLink}
                      activeProps={{ className: classes.toolLinkActive }}
                      mb={index === category.tools.length - 1 ? 0 : 4}
                    >
                      <tool.icon size={22} stroke={1.5} />
                      <span>{t(tool.nameKey)}</span>
                    </TextLink>
                  ))}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main className={classes.main}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
