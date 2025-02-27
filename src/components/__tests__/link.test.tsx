import { render, screen } from '../../test/test-utils';
import { ActionIconLink, TextLink } from '../link';

describe('Link Components', () => {
  describe('TextLink', () => {
    test('renders a text component as anchor with correct props', async () => {
      await render(<TextLink to="/test">Test Text Link</TextLink>);

      const link = screen.getByText('Test Text Link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('ActionIconLink', () => {
    test('renders an action icon as a button with correct props', async () => {
      await render(
        <ActionIconLink to="/test" aria-label="Test Action">
          <span>Icon</span>
        </ActionIconLink>,
      );

      const link = screen.getByLabelText('Test Action');
      expect(link.tagName).toBe('BUTTON');
      expect(link).toHaveAttribute('href', '/test');
    });
  });
});
