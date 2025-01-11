import { render, screen } from '../../../test/test-utils';
import { OllamaServiceGuard } from '../ollama-service-guard';

describe('OllamaServiceGuard', () => {
  test('renders children when Ollama is running', async () => {
    await render(<OllamaServiceGuard>Test Content</OllamaServiceGuard>, { modelContext: { isOllamaRunning: true } });

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders fallback when Ollama is not running', async () => {
    await render(<OllamaServiceGuard>Test Content</OllamaServiceGuard>, { modelContext: { isOllamaRunning: false } });
    expect(screen.getByText('tools.ollama-not-running.message')).toBeInTheDocument();
  });
});
