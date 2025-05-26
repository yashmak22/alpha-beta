import React from 'react';
import {
  HStack,
  IconButton,
  Tooltip,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiBold,
  FiItalic,
  FiList,
  FiCode,
  FiLink,
  FiImage,
  FiChevronsDown,
  FiTool,
  FiDatabase,
  FiHash,
  FiFileText,
  FiType,
  FiAlertCircle,
  FiHelpCircle,
} from 'react-icons/fi';

interface PromptToolbarProps {
  onInsert: (text: string) => void;
}

const PromptToolbar: React.FC<PromptToolbarProps> = ({ onInsert }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleFormat = (formatType: string) => {
    switch (formatType) {
      case 'bold':
        onInsert('**bold text**');
        break;
      case 'italic':
        onInsert('*italic text*');
        break;
      case 'list':
        onInsert('\n- Item 1\n- Item 2\n- Item 3\n');
        break;
      case 'code':
        onInsert('\n```\ncode block\n```\n');
        break;
      case 'inlineCode':
        onInsert('`code`');
        break;
      case 'link':
        onInsert('[link text](https://example.com)');
        break;
      case 'image':
        onInsert('![alt text](image-url.jpg)');
        break;
      case 'heading1':
        onInsert('\n# Heading 1\n');
        break;
      case 'heading2':
        onInsert('\n## Heading 2\n');
        break;
      case 'heading3':
        onInsert('\n### Heading 3\n');
        break;
      case 'quote':
        onInsert('\n> Quoted text\n');
        break;
      case 'divider':
        onInsert('\n---\n');
        break;
      default:
        break;
    }
  };

  const handleInsertTool = (toolName: string) => {
    onInsert(`{{tools.${toolName}}}`);
  };

  const handleInsertKnowledge = (knowledgeBase: string) => {
    onInsert(`{{knowledge.${knowledgeBase}}}`);
  };

  const handleInsertVariable = (variable: string) => {
    onInsert(`{{vars.${variable}}}`);
  };

  const handleInsertTemplate = (templateType: string) => {
    switch (templateType) {
      case 'system':
        onInsert(`# System Instructions
You are an AI assistant that specializes in [specific domain].

## Guidelines
- Guideline 1
- Guideline 2
- Guideline 3

## Capabilities and Limitations
- You can: [list capabilities]
- You cannot: [list limitations]
`);
        break;
      case 'examples':
        onInsert(`# Examples

Example 1:
User: [user query example]
Assistant: [ideal response example]

Example 2:
User: [another user query]
Assistant: [another ideal response]
`);
        break;
      case 'rag':
        onInsert(`# RAG Instructions

## Context Handling
When given context, analyze it carefully and:
1. Extract key information relevant to the user's query
2. Synthesize information from multiple sources if available
3. Acknowledge any contradictions or uncertainties in the context

## Context Provided
{{knowledge.retrievedDocuments}}
`);
        break;
      default:
        break;
    }
  };

  return (
    <Box
      p={2}
      borderWidth="1px"
      borderRadius="md"
      mb={3}
      bg={bgColor}
      borderColor={borderColor}
    >
      <HStack spacing={1} wrap="wrap">
        <Tooltip label="Bold">
          <IconButton
            aria-label="Bold"
            icon={<FiBold />}
            size="sm"
            variant="ghost"
            onClick={() => handleFormat('bold')}
          />
        </Tooltip>
        <Tooltip label="Italic">
          <IconButton
            aria-label="Italic"
            icon={<FiItalic />}
            size="sm"
            variant="ghost"
            onClick={() => handleFormat('italic')}
          />
        </Tooltip>
        <Tooltip label="List">
          <IconButton
            aria-label="List"
            icon={<FiList />}
            size="sm"
            variant="ghost"
            onClick={() => handleFormat('list')}
          />
        </Tooltip>
        <Tooltip label="Code Block">
          <IconButton
            aria-label="Code Block"
            icon={<FiCode />}
            size="sm"
            variant="ghost"
            onClick={() => handleFormat('code')}
          />
        </Tooltip>
        <Tooltip label="Link">
          <IconButton
            aria-label="Link"
            icon={<FiLink />}
            size="sm"
            variant="ghost"
            onClick={() => handleFormat('link')}
          />
        </Tooltip>
        <Tooltip label="Image">
          <IconButton
            aria-label="Image"
            icon={<FiImage />}
            size="sm"
            variant="ghost"
            onClick={() => handleFormat('image')}
          />
        </Tooltip>

        <Divider orientation="vertical" h="24px" mx={2} />

        <Menu>
          <MenuButton as={Button} rightIcon={<FiChevronsDown />} size="sm" variant="ghost">
            <FiHash /> Heading
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleFormat('heading1')}>Heading 1</MenuItem>
            <MenuItem onClick={() => handleFormat('heading2')}>Heading 2</MenuItem>
            <MenuItem onClick={() => handleFormat('heading3')}>Heading 3</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<FiChevronsDown />}
            size="sm"
            variant="ghost"
            colorScheme="brand"
          >
            <FiTool /> Tools
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleInsertTool('searchWeb')}>Web Search</MenuItem>
            <MenuItem onClick={() => handleInsertTool('accessCalendar')}>Calendar Access</MenuItem>
            <MenuItem onClick={() => handleInsertTool('readFile')}>File Reader</MenuItem>
            <MenuItem onClick={() => handleInsertTool('sendEmail')}>Email Sender</MenuItem>
            <MenuItem onClick={() => handleInsertTool('custom')}>Custom Tool...</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<FiChevronsDown />}
            size="sm"
            variant="ghost"
            colorScheme="brand"
          >
            <FiDatabase /> Knowledge
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleInsertKnowledge('companyInfo')}>Company Info</MenuItem>
            <MenuItem onClick={() => handleInsertKnowledge('productDocs')}>Product Docs</MenuItem>
            <MenuItem onClick={() => handleInsertKnowledge('faqs')}>FAQs</MenuItem>
            <MenuItem onClick={() => handleInsertKnowledge('retrievedDocuments')}>Retrieved Documents</MenuItem>
            <MenuItem onClick={() => handleInsertKnowledge('custom')}>Custom Knowledge...</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<FiChevronsDown />}
            size="sm"
            variant="ghost"
            colorScheme="brand"
          >
            <FiType /> Variables
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleInsertVariable('userName')}>User Name</MenuItem>
            <MenuItem onClick={() => handleInsertVariable('userRole')}>User Role</MenuItem>
            <MenuItem onClick={() => handleInsertVariable('date')}>Current Date</MenuItem>
            <MenuItem onClick={() => handleInsertVariable('agentName')}>Agent Name</MenuItem>
            <MenuItem onClick={() => handleInsertVariable('custom')}>Custom Variable...</MenuItem>
          </MenuList>
        </Menu>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<FiChevronsDown />}
            size="sm"
            variant="ghost"
            colorScheme="brand"
          >
            <FiFileText /> Templates
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleInsertTemplate('system')}>System Instructions</MenuItem>
            <MenuItem onClick={() => handleInsertTemplate('examples')}>Examples</MenuItem>
            <MenuItem onClick={() => handleInsertTemplate('rag')}>RAG Instructions</MenuItem>
          </MenuList>
        </Menu>

        <Divider orientation="vertical" h="24px" mx={2} />

        <Tooltip label="Help">
          <IconButton
            aria-label="Help"
            icon={<FiHelpCircle />}
            size="sm"
            variant="ghost"
          />
        </Tooltip>
      </HStack>
    </Box>
  );
};

export default PromptToolbar;
