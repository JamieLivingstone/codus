import { invoke } from '@tauri-apps/api/core';
import userEvent from '@testing-library/user-event';

import { render, screen, waitFor } from '../../../test/test-utils';
import Chat from '../chat';

vi.mock('@tauri-apps/api/event', () => ({
  listen: vi.fn().mockReturnValue(Promise.resolve(vi.fn())),
}));

vi.mock('@tauri-apps/api/core', () => {
  return {
    invoke: vi.fn().mockImplementation((command) => {
      if (command === 'send_message') {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ content: 'Hello from the assistant' });
          }, 10);
        });
      }
      return Promise.resolve({});
    }),
  };
});

describe('Chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('displays welcome message on initial render', async () => {
    await render(<Chat />);
    expect(screen.getByText('tools.chat.welcome-message')).toBeInTheDocument();
  });

  describe('Model Selection', () => {
    test('displays warning when no model is selected', async () => {
      await render(<Chat />, { modelContext: { activeModel: null } });
      expect(screen.getByText('tools.chat.no-model-selected-warning-title')).toBeInTheDocument();
      expect(screen.getByText('tools.chat.no-model-selected-warning-message')).toBeInTheDocument();
    });

    test('hides warning when model is selected', async () => {
      await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
      expect(screen.queryByText('tools.chat.no-model-selected-warning-title')).not.toBeInTheDocument();
      expect(screen.queryByText('tools.chat.no-model-selected-warning-message')).not.toBeInTheDocument();
    });
  });

  describe('Input Controls', () => {
    test('disables message input and send button when no model is selected', async () => {
      await render(<Chat />, { modelContext: { activeModel: null } });
      const input = screen.getByPlaceholderText('tools.chat.input-placeholder');
      const sendButton = screen.getByTestId('send-message-button');

      expect(input).toBeDisabled();
      expect(sendButton).toBeDisabled();
    });

    test('enables message input when model is selected', async () => {
      await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
      expect(screen.getByPlaceholderText('tools.chat.input-placeholder')).toBeEnabled();
    });

    test('send button state changes based on input content', async () => {
      await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
      const input = screen.getByPlaceholderText('tools.chat.input-placeholder');
      const sendButton = screen.getByTestId('send-message-button');

      // Initially disabled
      expect(sendButton).toBeDisabled();

      // Still disabled with only whitespace
      await userEvent.type(input, '   ');
      expect(sendButton).toBeDisabled();

      // Enabled with valid content
      await userEvent.clear(input);
      await userEvent.type(input, 'Hello');
      expect(sendButton).toBeEnabled();
    });
  });

  describe('Message Sending', () => {
    test('successfully sends message and displays response', async () => {
      const modelId = 'llama3';
      const parameterSize = '11b';
      const userMessage = 'Hello from the user';

      await render(<Chat />, { modelContext: { activeModel: `${modelId}:${parameterSize}` } });
      const input = screen.getByPlaceholderText('tools.chat.input-placeholder');
      const sendButton = screen.getByTestId('send-message-button');

      // Type message and click send
      await userEvent.type(input, userMessage);
      await userEvent.click(sendButton);

      // Check UI state during sending
      expect(screen.getByText(userMessage)).toBeInTheDocument();
      expect(screen.getByText('tools.chat.you')).toBeInTheDocument();
      expect(input).toHaveValue('');

      // Verify API call
      expect(invoke).toHaveBeenCalledWith('send_message', {
        modelId,
        parameterSize,
        messageId: expect.any(String),
        messages: [{ role: 'user', content: userMessage }],
      });

      // Verify response
      await waitFor(() => {
        expect(screen.getByText('Hello from the assistant')).toBeInTheDocument();
      });

      // Verify controls are re-enabled
      expect(input).toBeEnabled();
      expect(sendButton).toBeDisabled(); // Still disabled because input is empty
    });

    test('displays error message when sending fails', async () => {
      const error = new Error('Failed to send');
      vi.mocked(invoke).mockRejectedValueOnce(error);

      await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
      const input = screen.getByPlaceholderText('tools.chat.input-placeholder');
      const sendButton = screen.getByTestId('send-message-button');

      await userEvent.type(input, 'Hello');
      await userEvent.click(sendButton);

      await waitFor(() => {
        expect(screen.getByText('tools.chat.error-sending-message')).toBeInTheDocument();
      });

      // Verify controls are re-enabled after error
      expect(input).toBeEnabled();
    });

    describe('Keyboard Interactions', () => {
      test('sends message on Enter but preserves newline on Shift+Enter', async () => {
        await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
        const input = screen.getByPlaceholderText('tools.chat.input-placeholder');

        // Test Enter key sends message
        await userEvent.type(input, 'Hello{enter}');
        expect(invoke).toHaveBeenCalledTimes(1);

        // Test Shift+Enter preserves newline
        await userEvent.type(input, 'Hello{shift>}{enter}{/shift}');
        expect(invoke).toHaveBeenCalledTimes(1);
      });
    });
  });
});
