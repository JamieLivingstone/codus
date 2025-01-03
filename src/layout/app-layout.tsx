import {
  Accordion,
  ActionIcon,
  AppShell,
  Burger,
  Code,
  Group,
  ScrollArea,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconBrandGithub, IconHome, IconMoon, IconSun } from '@tabler/icons-react';
import { Link, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={mobileOpened} onClick={() => setMobileOpened((o) => !o)} hiddenFrom="sm" size="sm" />
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text size="xl" fw="bold">
                Codus
              </Text>
            </Link>
            <Code fw={700}>v{version}</Code>
          </Group>
          <Group>
            <ActionIcon variant="default" component={Link} to="/" size="lg" aria-label="Home">
              <IconHome size="1.2rem" />
            </ActionIcon>
            <ActionIcon
              variant="default"
              onClick={() => toggleColorScheme()}
              size="lg"
              aria-label="Toggle color scheme"
            >
              {colorScheme === 'dark' ? (
                <IconSun data-testid="toggle-light" size="1.2rem" />
              ) : (
                <IconMoon data-testid="toggle-dark" size="1.2rem" />
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
              <IconBrandGithub size="1.2rem" />
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p={0} className={classes.sidebar}>
        <ScrollArea>
          <Accordion chevronPosition="right" chevronSize={14} classNames={{ chevron: classes.chevron }}>
            {toolCategories.map((category) => (
              <Accordion.Item key={category.id} value={category.id}>
                <Accordion.Control icon={<category.icon size="1.2rem" stroke={1.5} />}>
                  {t(category.nameKey)}
                </Accordion.Control>
                <Accordion.Panel>
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.path}
                      className={classes.toolLink}
                      activeProps={{ className: classes.toolLinkActive }}
                    >
                      <tool.icon size="1.2rem" stroke={1.5} />
                      <span>{t(tool.nameKey)}</span>
                    </Link>
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
