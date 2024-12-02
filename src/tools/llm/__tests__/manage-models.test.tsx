import { userEvent } from '@testing-library/user-event';

import { ModelContext, type ModelContextType } from '../../../hooks/use-model';
import { render, screen } from '../../../test/test-utils';
import ManageModels from '../manage-models';

describe('manage-models', () => {
  let context: ModelContextType;

  beforeEach(() => {
    context = {
      models: [
        {
          name: 'model1',
          author: 'author1',
          size: '1GB',
          state: { isDownloaded: true, isDownloading: false, downloadPercentage: 100 },
          source: { type: 'HuggingFace', repo: 'repo1', tensor_path: 'tensor_path1' },
        },
        {
          name: 'model2',
          author: 'author2',
          size: '2GB',
          state: { isDownloaded: false, isDownloading: false, downloadPercentage: 0 },
          source: { type: 'HuggingFace', repo: 'repo2', tensor_path: 'tensor_path2' },
        },
        {
          name: 'model3',
          author: 'author3',
          size: '3GB',
          state: { isDownloaded: false, isDownloading: true, downloadPercentage: 50 },
          source: { type: 'HuggingFace', repo: 'repo3', tensor_path: 'tensor_path3' },
        },
      ],
      downloadModel: vi.fn(),
      deleteModel: vi.fn(),
    };
  });

  it('lists all models with their details', async () => {
    await render(
      <ModelContext.Provider value={context}>
        <ManageModels />
      </ModelContext.Provider>,
    );

    for (const model of context.models) {
      expect(screen.getByText(model.name)).toBeInTheDocument();
      expect(screen.getByText(`Author: ${model.author}`)).toBeInTheDocument();
      expect(screen.getByText(`Size: ${model.size}`)).toBeInTheDocument();
    }
  });

  it('shows the correct download progress when downloading a model', async () => {
    await render(
      <ModelContext.Provider value={context}>
        <ManageModels />
      </ModelContext.Provider>,
    );

    const downloadingModel = context.models[2];
    expect(screen.getByText(`${downloadingModel.state.downloadPercentage}%`)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows download buttons only for non-downloaded models', async () => {
    await render(
      <ModelContext.Provider value={context}>
        <ManageModels />
      </ModelContext.Provider>,
    );

    const downloadButtons = screen.getAllByRole('button', { name: 'common.download' });
    expect(downloadButtons).toHaveLength(1);
    expect(downloadButtons[0]).toBeInTheDocument();
  });

  it('shows delete buttons only for downloaded models', async () => {
    await render(
      <ModelContext.Provider value={context}>
        <ManageModels />
      </ModelContext.Provider>,
    );

    const deleteButtons = screen.getAllByRole('button', { name: 'common.delete' });
    expect(deleteButtons).toHaveLength(1);
    expect(deleteButtons[0]).toBeInTheDocument();
  });

  it('downloads a model when clicking download button', async () => {
    await render(
      <ModelContext.Provider value={context}>
        <ManageModels />
      </ModelContext.Provider>,
    );

    const downloadButton = screen.getByRole('button', { name: 'common.download' });
    await userEvent.click(downloadButton);

    expect(context.downloadModel).toHaveBeenCalledTimes(1);
    expect(context.downloadModel).toHaveBeenCalledWith(context.models[1]);
  });

  it('deletes a model when clicking delete button', async () => {
    await render(
      <ModelContext.Provider value={context}>
        <ManageModels />
      </ModelContext.Provider>,
    );

    const deleteButton = screen.getByRole('button', { name: 'common.delete' });
    await userEvent.click(deleteButton);

    expect(context.deleteModel).toHaveBeenCalledTimes(1);
    expect(context.deleteModel).toHaveBeenCalledWith(context.models[0]);
  });
});
