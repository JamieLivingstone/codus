import { userEvent } from '@testing-library/user-event';

import { type Model, ModelContext, type ModelContextType } from '../../../hooks/use-model';
import { render, screen } from '../../../test/test-utils';
import ManageModels from '../manage-models';

describe('manage-models', () => {
  const models: Model[] = [
    { name: 'model1', source: { type: 'HuggingFace', repo: 'repo1', tensor_path: 'tensor_path1' } },
    { name: 'model2', source: { type: 'HuggingFace', repo: 'repo2', tensor_path: 'tensor_path2' } },
  ];

  function renderWithContext(context: ModelContextType) {
    return render(
      <ModelContext.Provider value={context}>
        <ManageModels />
      </ModelContext.Provider>,
    );
  }

  it('lists models', async () => {
    await renderWithContext({
      models,
      downloadModel: vi.fn(),
    });

    expect(screen.getByText('tools.manage-models.title')).toBeInTheDocument();
    expect(screen.getByText('model1')).toBeInTheDocument();
    expect(screen.getByText('model2')).toBeInTheDocument();
  });

  it('downloads the selected model', async () => {
    const downloadModel = vi.fn();
    await renderWithContext({ models, downloadModel });

    const downloadButtons = screen.getAllByRole('button', { name: 'common.download' });
    await userEvent.click(downloadButtons[0]);

    expect(downloadButtons.length).toEqual(models.length);
    expect(downloadModel).toHaveBeenCalledTimes(1);
    expect(downloadModel).toHaveBeenCalledWith(models[0]);
  });
});
