import { fireEvent, render, screen } from '../../../test/test-utils';
import MarkdownEditor from '../markdown-editor';

vi.mock('@tauri-apps/api/clipboard', () => ({
  writeText: vi.fn(),
}));

describe('MarkdownEditor', () => {
  const getTextareaInput = () => screen.getByRole('textbox');
  const getPreviewPane = () => screen.getByTestId('markdown-editor-preview');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the editor and preview panes', async () => {
    await render(<MarkdownEditor />);
    expect(getTextareaInput()).toBeInTheDocument();
    expect(getPreviewPane()).toBeInTheDocument();
  });

  test('updates the preview when text is entered', async () => {
    await render(<MarkdownEditor />);
    const textarea = getTextareaInput();
    fireEvent.change(textarea, { target: { value: '# Hello World' } });
    expect(getPreviewPane()).toHaveTextContent('Hello World');
  });
});
