import { mockModels } from '../../test/mocks';
import { fireEvent, render, screen } from '../../test/test-utils';
import { ModelSwitcher } from '../model-switcher';

describe('ModelSwitcher', () => {
  const getModelSwitcher = () => screen.getByPlaceholderText('components.model-switcher.select-model-placeholder');

  test('is disabled when ollama is not running', async () => {
    await render(<ModelSwitcher />, { modelContext: { isOllamaRunning: false } });
    expect(getModelSwitcher()).toBeDisabled();
  });

  test('is enabled when ollama is running', async () => {
    await render(<ModelSwitcher />, { modelContext: { isOllamaRunning: true } });
    expect(getModelSwitcher()).toBeEnabled();
  });

  test('displays available models and triggers selection callback', async () => {
    const mockModel = mockModels[0];
    const mockVariant = mockModel.variants[0];
    const expectedModelId = `${mockModel.id}:${mockVariant.parameter_size}`;
    const mockSetActiveModel = vi.fn();

    const mockModelContext = {
      isOllamaRunning: true,
      setActiveModel: mockSetActiveModel,
      models: { [mockModel.id]: mockModel },
      downloadStates: {
        [expectedModelId]: {
          modelId: mockModel.id,
          parameterSize: mockVariant.parameter_size,
          downloaded: true,
          progress: 0,
        },
      },
    };

    await render(<ModelSwitcher />, { modelContext: mockModelContext });

    // Open model selection dropdown
    const select = getModelSwitcher();
    fireEvent.click(select);

    // Find and click model variant
    const expectedOptionText = `${mockModel.name} (${mockVariant.parameter_size.toUpperCase()})`;
    const option = screen.getByText(expectedOptionText);

    // Verify callback not called before selection
    expect(mockSetActiveModel).not.toHaveBeenCalled();

    // Select option
    fireEvent.click(option);

    // Verify option exists and callback called correctly
    expect(option).toBeInTheDocument();
    expect(mockSetActiveModel).toHaveBeenCalledWith(expectedModelId);
    expect(mockSetActiveModel).toHaveBeenCalledTimes(1);
  });
});
