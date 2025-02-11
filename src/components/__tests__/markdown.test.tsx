import { render, screen } from '../../test/test-utils';
import { Markdown } from '../markdown';

describe('Markdown', () => {
  test('renders basic markdown content', async () => {
    await render(<Markdown content="Hello, world!" />);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  test('renders markdown tables', async () => {
    await render(
      <Markdown
        content={`
|  Name  |  Age  |
| ------ | ------ |
| Alice  |   25   |
| Bob    |   30   |
`}
      />,
    );

    // Verify table elements are rendered
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check table headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();

    // Check table data
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();

    // Verify table structure
    expect(table.querySelector('thead')).toBeInTheDocument();
    expect(table.querySelector('tbody')).toBeInTheDocument();
    expect(table.querySelectorAll('tr').length).toBe(3); // Header row + 2 data rows
    expect(table.querySelectorAll('th').length).toBe(2);
    expect(table.querySelectorAll('td').length).toBe(4);
  });

  test('renders unordered markdown lists', async () => {
    await render(
      <Markdown
        content={`
- Item 1
- Item 2
`}
      />,
    );

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(2);
    expect(listItems[0]).toHaveTextContent('Item 1');
    expect(listItems[1]).toHaveTextContent('Item 2');
  });

  test('renders ordered markdown lists', async () => {
    await render(
      <Markdown
        content={`
1. Item 1
2. Item 2
`}
      />,
    );

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(2);
    expect(listItems[0]).toHaveTextContent('Item 1');
    expect(listItems[1]).toHaveTextContent('Item 2');
  });

  test('renders headings with correct hierarchy', async () => {
    const headingContent = `
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
`;
    await render(<Markdown content={headingContent} />);

    expect(screen.getByRole('heading', { level: 1, name: 'Heading 1' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Heading 2' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Heading 3' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Heading 4' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 5, name: 'Heading 5' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 6, name: 'Heading 6' })).toBeInTheDocument();
  });

  test('renders links with correct attributes', async () => {
    await render(
      <Markdown
        content={`
[Visit GitHub](https://github.com)
`}
      />,
    );

    const link = screen.getByRole('link', { name: 'Visit GitHub' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://github.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders code blocks with syntax highlighting', async () => {
    await render(
      <Markdown
        content={`
\`\`\`javascript
const hello = "world";
\`\`\`
`}
      />,
    );

    // Find the code highlight component
    const codeElement = screen.getByText(/const/);
    const codeHighlightElement = codeElement.closest('pre');
    expect(codeHighlightElement).toBeInTheDocument();

    // Check for syntax highlighting
    const keywordElement = screen.getByText('const');
    expect(keywordElement).toHaveAttribute('class', expect.stringContaining('hljs-keyword'));

    const stringElement = screen.getByText('"world"');
    expect(stringElement).toHaveAttribute('class', expect.stringContaining('hljs-string'));
  });

  test('renders inline code', async () => {
    await render(<Markdown content="Use the `console.log()` function" />);

    const codeElement = screen.getByText('console.log()');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement.tagName.toLowerCase()).toBe('code');
  });

  test('renders bold and italic text correctly', async () => {
    await render(<Markdown content="**Bold text** and *italic text*" />);

    const boldElement = screen.getByText('Bold text');
    expect(boldElement).toBeInTheDocument();
    expect(boldElement.tagName.toLowerCase()).toBe('strong');

    const italicElement = screen.getByText('italic text');
    expect(italicElement).toBeInTheDocument();
    expect(italicElement.tagName.toLowerCase()).toBe('em');
  });

  test('renders blockquotes correctly', async () => {
    await render(<Markdown content="> This is a blockquote" />);

    const blockquoteElement = screen.getByText('This is a blockquote');
    expect(blockquoteElement).toBeInTheDocument();
    expect(blockquoteElement.closest('blockquote')).toBeInTheDocument();
  });

  test('handles line breaks with remark-breaks plugin', async () => {
    await render(
      <Markdown
        content={`
Line 1
Line 2
`}
      />,
    );

    expect(screen.getByText(/Line 1/)).toBeInTheDocument();
    expect(screen.getByText(/Line 2/)).toBeInTheDocument();

    // Check for the presence of a <br> element
    const textElement = screen.getByText(/Line 1/);
    expect(textElement.innerHTML).toContain('<br>');
  });

  test('renders empty content without errors', async () => {
    await render(<Markdown content="" />);
  });
});
