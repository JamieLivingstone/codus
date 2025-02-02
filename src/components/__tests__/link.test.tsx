import { render, screen } from '../../test/test-utils';
import { ActionIconLink, AnchorLink, TextLink } from '../link';

describe('Link Components', () => {
  describe('AnchorLink', () => {
    it('renders an anchor element with correct props', async () => {
      await render(<AnchorLink to="/test">Test Link</AnchorLink>);

      const link = screen.getByText('Test Link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('TextLink', () => {
    it('renders a text component as anchor with correct props', async () => {
      await render(<TextLink to="/test">Test Text Link</TextLink>);

      const link = screen.getByText('Test Text Link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('ActionIconLink', () => {
    it('renders an action icon as a button with correct props', async () => {
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
