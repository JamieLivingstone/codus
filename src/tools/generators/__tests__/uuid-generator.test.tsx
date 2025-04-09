import { randomUUID } from 'node:crypto';
import userEvent from '@testing-library/user-event';

import { invoke } from '@tauri-apps/api/core';
import { render, screen } from '../../../test/test-utils';
import UuidGenerator from '../uuid-generator';

const mockUuids = Array.from({ length: 10 }, () => randomUUID());

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockImplementation((command, args) => {
    if (command === 'generate_uuid') {
      return Promise.resolve(mockUuids.slice(0, args.numberOfUuids));
    }
    throw new Error(`Command not found: ${command}`);
  }),
}));

describe('UUIDGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('generates UUIDs with default parameters on initial render', async () => {
    await render(<UuidGenerator />);

    expect(invoke).toHaveBeenCalledWith('generate_uuid', {
      numberOfUuids: 50,
      hyphens: true,
      uppercase: true,
      version: 'V4',
    });
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('generated-uuids')).toHaveValue(mockUuids.join('\n'));
  });

  test('generates UUIDs with user-specified parameters', async () => {
    await render(<UuidGenerator />);

    const numberOfUuidsInput = screen.getByRole('textbox', { name: /tools\.uuid-generator\.count/i });
    const hyphensCheckbox = screen.getByLabelText('tools.uuid-generator.hyphens');
    const uppercaseCheckbox = screen.getByLabelText('tools.uuid-generator.uppercase');
    const versionSelect = screen.getByDisplayValue('tools.uuid-generator.v4');
    const generateButton = screen.getByText('common.generate');

    // Verify default values
    expect(numberOfUuidsInput).toHaveValue('50');
    expect(hyphensCheckbox).toBeChecked();
    expect(uppercaseCheckbox).toBeChecked();

    // Change parameters
    await userEvent.clear(numberOfUuidsInput);
    await userEvent.type(numberOfUuidsInput, '5');
    await userEvent.click(hyphensCheckbox);
    await userEvent.click(uppercaseCheckbox);
    await userEvent.click(versionSelect);
    await userEvent.click(screen.getByText('tools.uuid-generator.v7'));

    // Generate with new parameters
    await userEvent.click(generateButton);

    // Assert that the correct parameters were passed to the backend
    expect(invoke).toHaveBeenCalledTimes(2);
    expect(invoke).lastCalledWith('generate_uuid', {
      numberOfUuids: 5,
      hyphens: false,
      uppercase: false,
      version: 'V7',
    });

    // Verify displayed UUIDs
    expect(screen.getByTestId('generated-uuids')).toHaveTextContent(mockUuids.slice(0, 5).join(' '));
  });
});
