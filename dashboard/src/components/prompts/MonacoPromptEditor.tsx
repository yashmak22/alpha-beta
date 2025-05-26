import React, { useRef, useState } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import Editor, { Monaco } from '@monaco-editor/react';
import type * as MonacoEditor from 'monaco-editor';

interface MonacoPromptEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const MonacoPromptEditor: React.FC<MonacoPromptEditorProps> = ({
  value,
  onChange,
  height = '70vh',
}) => {
  const { colorMode } = useColorMode();
  const editorRef = useRef<MonacoEditor.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Handle editor mounting
  const handleEditorDidMount = (
    editor: MonacoEditor.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Add custom commands for slash menu
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space,
      () => {
        // Show slash menu
        const position = editor.getPosition();
        if (position) {
          const wordAtPosition = editor.getModel()?.getWordAtPosition(position);
          if (wordAtPosition && wordAtPosition.word.startsWith('/')) {
            showSlashMenu(wordAtPosition.word, position);
          }
        }
      }
    );

    // Focus the editor initially
    editor.focus();
  };

  // Show slash menu with suggestions
  const showSlashMenu = (
    slashCommand: string,
    position: MonacoEditor.Position
  ) => {
    if (!editorRef.current || !monacoRef.current) return;

    const monaco = monacoRef.current;
    const editor = editorRef.current;

    // Slash command suggestions
    const suggestions: {
      label: string;
      kind: MonacoEditor.languages.CompletionItemKind;
      insertText: string;
      detail: string;
    }[] = [
      {
        label: '/tools',
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: '{{tools.${1:toolName}}}',
        detail: 'Insert a tool reference',
      },
      {
        label: '/knowledge',
        kind: monaco.languages.CompletionItemKind.Reference,
        insertText: '{{knowledge.${1:topic}}}',
        detail: 'Insert a knowledge base reference',
      },
      {
        label: '/vars',
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: '{{vars.${1:variableName}}}',
        detail: 'Insert a variable reference',
      },
      {
        label: '/examples',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '# Examples',
          'Example 1:',
          'User: ${1:user_input}',
          'Assistant: ${2:assistant_response}',
          '',
          'Example 2:',
          'User: ${3:user_input}',
          'Assistant: ${4:assistant_response}',
        ].join('\n'),
        detail: 'Insert example conversations',
      },
      {
        label: '/system',
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          '# System Prompt',
          'You are ${1:an AI assistant} that ${2:description of role and capabilities}.',
          '',
          '## Guidelines',
          '- ${3:guideline 1}',
          '- ${4:guideline 2}',
          '- ${5:guideline 3}',
        ].join('\n'),
        detail: 'Insert system prompt template',
      },
    ];

    // Register completion provider for slash commands
    monaco.languages.registerCompletionItemProvider('markdown', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: suggestions.map(s => ({
            ...s,
            range,
          })),
        };
      },
      triggerCharacters: ['/'],
    });

    // Trigger suggestions manually
    editor.trigger('slash', 'editor.action.triggerSuggest', {});
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      height={height}
      fontSize="sm"
    >
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'same',
          lineNumbers: 'on',
          renderLineHighlight: 'all',
          contextmenu: true,
          fontFamily: "'Fira Code', 'Droid Sans Mono', 'monospace'",
          fontSize: 14,
          tabSize: 2,
          automaticLayout: true,
          theme: colorMode === 'dark' ? 'vs-dark' : 'vs-light',
          scrollbar: {
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
          },
        }}
      />
    </Box>
  );
};

export default MonacoPromptEditor;
