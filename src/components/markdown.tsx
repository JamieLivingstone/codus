import { CodeHighlight } from '@mantine/code-highlight';
import { Anchor, Code, List, Stack, Table, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  const { t } = useTranslation();

  return (
    <Stack>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ children, href, ...props }) => (
            <Anchor href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </Anchor>
          ),
          br: () => <br />,
          p: Text,
          ul: List,
          ol: ({ children }) => <List type="ordered">{children}</List>,
          li: List.Item,
          h1: ({ children }) => <Title order={1}>{children}</Title>,
          h2: ({ children }) => <Title order={2}>{children}</Title>,
          h3: ({ children }) => <Title order={3}>{children}</Title>,
          h4: ({ children }) => <Title order={4}>{children}</Title>,
          h5: ({ children }) => <Title order={5}>{children}</Title>,
          h6: ({ children }) => <Title order={6}>{children}</Title>,
          table: ({ children }) => <Table>{children}</Table>,
          thead: ({ children }) => <Table.Thead>{children}</Table.Thead>,
          tbody: ({ children }) => <Table.Tbody>{children}</Table.Tbody>,
          tr: ({ children }) => <Table.Tr>{children}</Table.Tr>,
          th: ({ children }) => <Table.Th>{children}</Table.Th>,
          td: ({ children }) => <Table.Td>{children}</Table.Td>,
          code(props) {
            const { children, className, node, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <CodeHighlight
                language={match[1]}
                code={String(children).replace(/\n$/, '')}
                copyLabel={t('common.copy')}
                copiedLabel={t('common.copied')}
              />
            ) : (
              <Code {...rest} className={className}>
                {children}
              </Code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </Stack>
  );
}
