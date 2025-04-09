import userEvent from '@testing-library/user-event';

import { invoke } from '@tauri-apps/api/core';
import { render, screen } from '../../../test/test-utils';
import LipsumGenerator from '../lipsum-generator';

const mockLipsumText = {
  words: 'Lorem ipsum dolor sit amet.',
  sentences: 'Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Tempor incididunt ut labore.',
  paragraphs:
    'Lorem ipsum dolor sit amet.\n' +
    'Consectetur adipiscing elit.\n' +
    'Duis aute irure dolor.\n' +
    'Excepteur sint occaecat cupidatat.',
};

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockImplementation((command, args) => {
    if (command === 'generate_lipsum') {
      if (args.lipsumType === 'Words') {
        return Promise.resolve(mockLipsumText.words);
      }
      if (args.lipsumType === 'Sentences') {
        return Promise.resolve(mockLipsumText.sentences);
      }
      if (args.lipsumType === 'Paragraphs') {
        return Promise.resolve(mockLipsumText.paragraphs);
      }

      throw new Error(`Invalid lipsum type: ${args.lipsumType}`);
    }
    throw new Error(`Command not found: ${command}`);
  }),
}));

describe('LipsumGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('generates Lorem Ipsum with default parameters on initial render', async () => {
    await render(<LipsumGenerator />);

    expect(invoke).toHaveBeenCalledWith('generate_lipsum', {
      count: 10,
      lipsumType: 'Paragraphs',
    });
    expect(invoke).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('lipsum-results')).toHaveValue(mockLipsumText.paragraphs);
  });

  test('generates Lorem Ipsum with user-specified parameters', async () => {
    await render(<LipsumGenerator />);

    const countInput = screen.getByRole('textbox', { name: /tools\.lipsum-generator\.count/i });
    const typeSelect = screen.getByRole('textbox', { name: /tools\.lipsum-generator\.type/i });
    const generateButton = screen.getByText('common.generate');

    // Verify default values
    expect(countInput).toHaveValue('10');
    expect(typeSelect).toHaveValue('tools.lipsum-generator.paragraphs');

    // Change parameters
    await userEvent.clear(countInput);
    await userEvent.type(countInput, '5');
    await userEvent.click(typeSelect);
    await userEvent.click(screen.getByText('tools.lipsum-generator.words'));

    // Generate with new parameters
    await userEvent.click(generateButton);

    // Assert that the correct parameters were passed to the backend
    expect(invoke).toHaveBeenCalledTimes(2);
    expect(invoke).lastCalledWith('generate_lipsum', {
      count: 5,
      lipsumType: 'Words',
    });

    // Verify displayed Lorem Ipsum text
    expect(screen.getByTestId('lipsum-results')).toHaveValue(mockLipsumText.words);
  });
});
