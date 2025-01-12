import userEvent from '@testing-library/user-event';

import { render, screen, waitFor } from '../../../test/test-utils';
import Chat from '../chat';

describe('Chat', () => {
  test('displays welcome message on initial render', async () => {
    await render(<Chat />);
    expect(screen.getByText('tools.chat.welcome-message')).toBeInTheDocument();
  });

  test('displays warning when no AI model is selected', async () => {
    await render(<Chat />, { modelContext: { activeModel: null } });
    expect(screen.getByText('tools.chat.no-model-selected-warning-title')).toBeInTheDocument();
    expect(screen.getByText('tools.chat.no-model-selected-warning-message')).toBeInTheDocument();
  });

  test('hides warning when AI model is selected', async () => {
    await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
    expect(screen.queryByText('tools.chat.no-model-selected-warning-title')).not.toBeInTheDocument();
    expect(screen.queryByText('tools.chat.no-model-selected-warning-message')).not.toBeInTheDocument();
  });

  test('disables message input when no AI model is selected', async () => {
    await render(<Chat />, { modelContext: { activeModel: null } });
    expect(screen.getByPlaceholderText('tools.chat.input-placeholder')).toBeDisabled();
    expect(screen.getByTestId('send-message-button')).toBeDisabled();
  });

  test('enables message input when AI model is selected', async () => {
    await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
    expect(screen.getByPlaceholderText('tools.chat.input-placeholder')).toBeEnabled();
  });

  test('disables send button when message input is empty', async () => {
    await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
    expect(screen.getByTestId('send-message-button')).toBeDisabled();
  });

  test('disables send button when input contains only whitespace', async () => {
    await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
    await userEvent.type(screen.getByPlaceholderText('tools.chat.input-placeholder'), '   ');
    expect(screen.getByTestId('send-message-button')).toBeDisabled();
  });

  test('enables send button when message input has content', async () => {
    await render(<Chat />, { modelContext: { activeModel: 'llama3:11b' } });
    await userEvent.type(screen.getByPlaceholderText('tools.chat.input-placeholder'), 'Hello');
    expect(screen.getByTestId('send-message-button')).toBeEnabled();
  });

  test('successfully sends message and displays response', async () => {
    const sendMessage = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ role: 'assistant', content: 'Hello from the assistant' });
          }, 100);
        }),
    );

    await render(<Chat />, { modelContext: { activeModel: 'llama3:11b', sendMessage } });

    const input = screen.getByPlaceholderText('tools.chat.input-placeholder');
    await userEvent.type(input, 'Hello from the user');
    await userEvent.click(screen.getByTestId('send-message-button'));

    expect(screen.getByText('Hello from the user')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(input).toHaveValue('');
    expect(sendMessage).toHaveBeenCalledWith([{ role: 'user', content: 'Hello from the user' }]);

    expect(screen.getByText('tools.chat.thinking-message')).toBeInTheDocument();
    expect(input).toBeDisabled();
    expect(screen.getByTestId('send-message-button')).toBeDisabled();

    await waitFor(() => expect(screen.queryByText('tools.chat.thinking-message')).not.toBeInTheDocument());
    expect(screen.getByText('Hello from the assistant')).toBeInTheDocument();
    expect(input).toBeEnabled();
  });

  test('displays error message when sending fails', async () => {
    const sendMessage = vi.fn().mockRejectedValue(new Error('Failed to send'));
    await render(<Chat />, { modelContext: { activeModel: 'llama3:11b', sendMessage } });

    const input = screen.getByPlaceholderText('tools.chat.input-placeholder');
    await userEvent.type(input, 'Hello');
    await userEvent.click(screen.getByTestId('send-message-button'));
    await waitFor(() => expect(screen.getByText('tools.chat.error-sending-message')).toBeInTheDocument());
  });

  test('sends message on Enter but preserves newline on Shift+Enter', async () => {
    const sendMessage = vi.fn().mockResolvedValue({ role: 'assistant', content: 'Response' });
    await render(<Chat />, { modelContext: { activeModel: 'llama3:11b', sendMessage } });

    const input = screen.getByPlaceholderText('tools.chat.input-placeholder');
    await userEvent.type(input, 'Hello{enter}');
    expect(sendMessage).toHaveBeenCalledTimes(1);

    await userEvent.type(input, 'Hello{shift>}{enter}{/shift}');
    expect(sendMessage).toHaveBeenCalledTimes(1);
  });
});
