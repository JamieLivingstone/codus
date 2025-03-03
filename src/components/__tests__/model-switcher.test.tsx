import { mockModels } from '../../test/mocks';
import { fireEvent, render, screen } from '../../test/test-utils';
import { ModelSwitcher } from '../model-switcher';

describe('ModelSwitcher', () => {
  const getModelSwitcher = () => screen.getByPlaceholderText('components.model-switcher.select-model-placeholder');

  test('displays ollama not running message when ollama is not running', async () => {
    await render(<ModelSwitcher />, { modelContext: { activeModel: null, models: {}, isOllamaRunning: false } });
    expect(screen.getByText('components.model-switcher.select-model-variant-ollama-not-running')).toBeInTheDocument();
  });

  test('displays no results message when no models are available', async () => {
    await render(<ModelSwitcher />, { modelContext: { activeModel: null, models: {}, isOllamaRunning: true } });
    expect(screen.getByText('components.model-switcher.select-model-variant-no-search-results')).toBeInTheDocument();
  });

  test('displays available models and triggers selection callback', async () => {
    const mockSetActiveModel = vi.fn();
    const mockModel = { ...mockModels[0], variants: [{ ...mockModels[0].variants[0], downloaded: true }] };
    const expectedModelId = `${mockModel.id}:${mockModel.variants[0].parameter_size}`;

    await render(<ModelSwitcher />, {
      modelContext: {
        isOllamaRunning: true,
        setActiveModel: mockSetActiveModel,
        models: { [mockModel.id]: mockModel },
      },
    });

    fireEvent.click(getModelSwitcher());

    const option = screen.getByText(`${mockModel.name} (${mockModel.variants[0].parameter_size.toUpperCase()})`);
    expect(mockSetActiveModel).not.toHaveBeenCalled();

    fireEvent.click(option);

    expect(option).toBeInTheDocument();
    expect(mockSetActiveModel).toHaveBeenCalledWith(expectedModelId);
    expect(mockSetActiveModel).toHaveBeenCalledTimes(1);
  });
});
