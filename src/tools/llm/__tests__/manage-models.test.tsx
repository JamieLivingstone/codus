import { mockModels } from '../../../test/mocks';
import { fireEvent, render, screen } from '../../../test/test-utils';
import ManageModels from '../manage-models';

describe('ManageModels', () => {
  test('displays model cards', async () => {
    await render(<ManageModels />);

    const modelVariants = screen.getAllByLabelText('tools.manage-models.select-variant');

    mockModels.forEach((model, index) => {
      // Check model name and author link
      const modelName = screen.getByText(`${model.name} (${model.author.name})`);
      expect(modelName).toBeInTheDocument();
      expect(modelName).toHaveAttribute('href', model.author.url);

      // Check description
      expect(screen.getByText(model.description)).toBeInTheDocument();

      // Check variant select options
      expect(modelVariants[index]).toBeInTheDocument();

      // Open the variant select
      fireEvent.click(modelVariants[index]);

      // Check that all variant options are available in select
      for (const variant of model.variants) {
        const optionText = `${variant.parameter_size.toUpperCase()} (${variant.disk_space})`;
        expect(screen.getByRole('option', { name: optionText })).toBeInTheDocument();
      }
    });
  });

  test('download button is disabled until a variant is selected', async () => {
    await render(<ManageModels />);

    const variantSelect = screen.getAllByLabelText('tools.manage-models.select-variant')[0];

    // Initially disabled
    expect(screen.getAllByRole('button', { name: 'common.download' })[0]).toBeDisabled();

    // Enable after selecting variant
    fireEvent.click(variantSelect);
    const variant = mockModels[0].variants[0];
    fireEvent.click(
      screen.getByRole('option', { name: `${variant.parameter_size.toUpperCase()} (${variant.disk_space})` }),
    );

    expect(screen.getAllByRole('button', { name: 'common.download' })[0]).toBeEnabled();
  });
});
