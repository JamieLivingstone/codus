import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render } from '../../test/test-utils';
import { tools } from '../../tools';
import { AllTools } from '../all-tools';

describe('AllTools', () => {
  test('displays all tools', async () => {
    await render(<AllTools />);
    const toolElements = tools.map((tool) => screen.getByTestId(tool.id));
    expect(toolElements).toHaveLength(tools.length);
  });

  test('navigates to tool on click', async () => {
    await render(<AllTools />);
    const tool = tools[0];
    await userEvent.click(screen.getByTestId(tool.id));
    expect(window.location.pathname).toBe(tool.path);
  });

  test('displays tool name and description', async () => {
    await render(<AllTools />);
    const tool = tools[0];
    const toolElement = screen.getByTestId(tool.id);
    expect(toolElement).toHaveTextContent(tool.nameKey);
    expect(toolElement).toHaveTextContent(tool.descriptionKey);
  });
});
