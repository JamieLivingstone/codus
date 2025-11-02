import { Box, CodeBlock, createShikiAdapter, Separator } from '@chakra-ui/react';
import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const shikiAdapter = createShikiAdapter({
  async load() {
    const { createHighlighter } = await import('shiki');
    return createHighlighter({
      langs: [
        'tsx',
        'typescript',
        'javascript',
        'jsx',
        'html',
        'css',
        'scss',
        'json',
        'bash',
        'shell',
        'python',
        'java',
        'go',
        'rust',
        'sql',
        'yaml',
      ],
      themes: ['github-dark', 'github-light'],
    });
  },
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
});

interface ChatMessageProps {
  content: string;
  isUser: boolean;
}

function ChatMessage({ content, isUser }: ChatMessageProps) {
  return (
    <Box
      maxW={{ base: '90%', sm: '85%', md: '75%', lg: '70%' }}
      w="fit-content"
      bg={isUser ? 'blue.500' : 'bg.muted'}
      color={isUser ? 'white' : 'fg'}
      px={4}
      py={3}
      borderRadius="xl"
      borderTopLeftRadius={!isUser ? 'sm' : 'xl'}
      borderTopRightRadius={isUser ? 'sm' : 'xl'}
      fontSize="sm"
      lineHeight="1.6"
      overflow="hidden"
      wordBreak="break-word"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          code: ({ children, className }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match?.[1] || '';
            const codeValue = String(children).replace(/\n$/, '');

            // Inline code
            if (!className) {
              return (
                <Box
                  as="code"
                  bg={isUser ? 'blue.600' : 'bg.subtle'}
                  color={isUser ? 'blue.100' : 'fg'}
                  px={1}
                  py={0.5}
                  borderRadius="sm"
                  fontSize="sm"
                  fontFamily="mono"
                  whiteSpace="nowrap"
                >
                  {codeValue}
                </Box>
              );
            }

            // Code block
            return (
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <Box my={3} borderRadius="md" overflow="hidden" bg={isUser ? 'blue.600' : 'bg.subtle'}>
                  <CodeBlock.Root code={codeValue} language={language} size="sm" css={{ display: 'grid' }}>
                    <CodeBlock.Header bg={isUser ? 'blue.700' : 'bg.muted'}>
                      <CodeBlock.Title fontSize="xs" color={isUser ? 'blue.100' : 'fg.muted'}>
                        {language || 'text'}
                      </CodeBlock.Title>
                      <CodeBlock.CopyTrigger />
                    </CodeBlock.Header>
                    <CodeBlock.Content>
                      <CodeBlock.Code overflowX="auto" maxH="500px" overflowY="auto">
                        <CodeBlock.CodeText fontSize="xs" lineHeight="1.5" />
                      </CodeBlock.Code>
                    </CodeBlock.Content>
                  </CodeBlock.Root>
                </Box>
              </CodeBlock.AdapterProvider>
            );
          },

          hr: () => <Separator my={4} colorPalette={isUser ? 'blue' : 'gray'} variant="solid" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}

const MemoizedChatMessage = memo(ChatMessage);

export { MemoizedChatMessage as ChatMessage };
