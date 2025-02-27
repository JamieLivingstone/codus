import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

import { fireEvent, render, screen, waitFor } from '../../test/test-utils';
import { AIGenerator } from '../ai-generator';

// Mock data
const mockOnAccept = vi.fn();
const messageId = '123e4567-e89b-12d3-a456-426614174000';
const modelResponseText = 'Generated content';

// Mocks
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn().mockImplementation((command) => {
    switch (command) {
      case 'send_message':
        return Promise.resolve({ content: modelResponseText });
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  }),
}));

vi.mock('@tauri-apps/api/event', () => ({
  listen: vi.fn().mockImplementation((event, handler) => {
    if (event === 'chat-message-chunk') {
      handler({ payload: [messageId, modelResponseText] });
      return Promise.resolve(() => {});
    }
    throw new Error(`Unknown event: ${event}`);
  }),
}));

vi.stubGlobal('crypto', {
  randomUUID: () => messageId,
});

describe('AIGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('AI Generator is disabled when no model is selected', async () => {
    await render(<AIGenerator onAccept={mockOnAccept} />, { modelContext: { activeModel: null } });

    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('AI Generator is enabled when a model is selected', async () => {
    await render(<AIGenerator onAccept={mockOnAccept} />, { modelContext: { activeModel: 'llama2:7b' } });

    expect(screen.getByRole('button')).toBeEnabled();
  });

  test('AI Generator opens popover when clicked with model selected', async () => {
    await render(<AIGenerator onAccept={mockOnAccept} />, { modelContext: { activeModel: 'llama2:7b' } });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('components.ai-generator.prompt-placeholder')).toBeInTheDocument();
    });
  });

  test('handles generation flow correctly', async () => {
    const context = 'You are an expert at writing regular expressions';
    const testPrompt = 'Test prompt';

    await render(<AIGenerator onAccept={mockOnAccept} context={context} />, {
      modelContext: { activeModel: 'llama2:7b' },
    });

    // Open the popover
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('components.ai-generator.prompt-placeholder')).toBeInTheDocument();
    });

    // Enter the prompt
    fireEvent.change(screen.getByPlaceholderText('components.ai-generator.prompt-placeholder'), {
      target: { value: testPrompt },
    });

    // Click generate button
    fireEvent.click(screen.getByRole('button', { name: 'components.ai-generator.generate' }));

    // Verify invoke call
    await waitFor(() => {
      expect(invoke).toHaveBeenCalledTimes(1);
      expect(listen).toHaveBeenCalledTimes(1);
      expect(invoke).toHaveBeenCalledWith('send_message', {
        modelId: 'llama2',
        parameterSize: '7b',
        messageId,
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: testPrompt },
        ],
      });
    });

    // Wait for and verify response text
    await waitFor(() => {
      expect(screen.getByText(modelResponseText)).toBeInTheDocument();
    });

    // Accept the generated content
    fireEvent.click(screen.getByRole('button', { name: 'components.ai-generator.accept' }));

    expect(mockOnAccept).toHaveBeenCalledWith(modelResponseText);
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });
});
