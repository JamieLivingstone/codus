import { ActionIcon, Button, Text } from '@mantine/core';
import type { ActionIconProps, ButtonProps, TextProps } from '@mantine/core';
import { type LinkComponent, createLink } from '@tanstack/react-router';
import { forwardRef } from 'react';

const TextComponent = forwardRef<HTMLAnchorElement, TextProps>((props, ref) => (
  <Text component="a" ref={ref} {...props} />
));

const ActionIconComponent = forwardRef<HTMLButtonElement, ActionIconProps>((props, ref) => (
  <ActionIcon ref={ref} {...props} />
));

const ButtonLinkComponent = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => <Button ref={ref} {...props} />);

export const TextLink: LinkComponent<typeof TextComponent> = createLink(TextComponent);

export const ActionIconLink: LinkComponent<typeof ActionIconComponent> = createLink(ActionIconComponent);

export const ButtonLink: LinkComponent<typeof ButtonLinkComponent> = createLink(ButtonLinkComponent);
