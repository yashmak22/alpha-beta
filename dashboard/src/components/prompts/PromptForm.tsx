import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Textarea,
  VStack,
  Text,
  useColorModeValue,
  useToast,
  FormHelperText,
  Flex,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FiSave, FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { proxyClient } from '@/lib/graphql-client';
import { Prompt } from '@/lib/storage';

interface PromptFormProps {
  prompt?: Prompt;
  isEdit?: boolean;
}

interface PromptParameter {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ prompt, isEdit = false }) => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tagBg = useColorModeValue('blue.50', 'blue.900');

  // Parameter modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state
  const [promptData, setPromptData] = useState<Partial<Prompt>>({
    name: '',
    description: '',
    templateType: 'chat',
    content: '',
    tags: [],
    parameters: [],
    version: 1,
  });

  // Tag input state
  const [tagInput, setTagInput] = useState('');

  // Parameter input state
  const [paramInput, setParamInput] = useState<PromptParameter>({
    name: '',
    type: 'string',
    description: '',
    optional: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Load prompt data if editing
  useEffect(() => {
    if (prompt && isEdit) {
      setPromptData({
        ...prompt,
      });
    }
  }, [prompt, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPromptData({
      ...promptData,
      [name]: value,
    });
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleParamInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>, field: keyof PromptParameter) => {
    setParamInput({
      ...paramInput,
      [field]: e.target.value,
    });
  };

  const handleParamOptionalChange = () => {
    setParamInput({
      ...paramInput,
      optional: !paramInput.optional,
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !promptData.tags?.includes(tagInput.trim())) {
      setPromptData({
        ...promptData,
        tags: [...(promptData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setPromptData({
      ...promptData,
      tags: promptData.tags?.filter(t => t !== tag) || [],
    });
  };

  const addParameter = () => {
    if (paramInput.name.trim()) {
      setPromptData({
        ...promptData,
        parameters: [...(promptData.parameters || []), paramInput],
      });
      setParamInput({
        name: '',
        type: 'string',
        description: '',
        optional: false,
      });
      onClose();
    }
  };

  const removeParameter = (name: string) => {
    setPromptData({
      ...promptData,
      parameters: promptData.parameters?.filter(p => p.name !== name) || [],
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate form
      if (!promptData.name?.trim()) {
        toast({
          title: 'Error',
          description: 'Prompt name is required',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }

      if (!promptData.content?.trim()) {
        toast({
          title: 'Error',
          description: 'Prompt content is required',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }

      // Add a dummy user ID for now
      const dataToSave = {
        ...promptData,
        lastEditedBy: 'user-123',
      };

      if (isEdit && prompt) {
        // Add version tracking if editing
        const updatedPrompt = {
          ...dataToSave,
          version: (prompt.version || 0) + 1,
          versions: [
            ...(prompt.versions || []),
            {
              id: Date.now().toString(),
              content: prompt.content,
              createdAt: new Date().toISOString(),
            }
          ],
        };
        
        // Update existing prompt
        await proxyClient.updatePrompt(prompt.id, updatedPrompt);
        toast({
          title: 'Prompt updated',
          description: `${promptData.name} has been updated successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new prompt
        await proxyClient.createPrompt(dataToSave);
        toast({
          title: 'Prompt created',
          description: `${promptData.name} has been created successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      // Redirect to prompts list
      router.push('/prompts');
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to save prompt. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPromptPlaceholderText = () => {
    switch (promptData.templateType) {
      case 'chat':
        return 'You are a helpful assistant. Your task is to {{task}}.\n\nUser: {{input}}\n\nAssistant:';
      case 'completion':
        return 'Write a {{style}} article about {{topic}} that is {{length}} words long. Include the following points: {{points}}.';
      case 'embedding':
        return '{{input}}';
      case 'function':
        return 'def main({{input}}):\n    # Function to {{task}}\n    return {{output}}';
      default:
        return 'Enter your prompt template here...';
    }
  };

  return (
    <>
      <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={6}>
        <CardHeader pb={0}>
          <Heading size="md">Basic Information</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Prompt Name</FormLabel>
              <Input 
                name="name"
                value={promptData.name}
                onChange={handleInputChange}
                placeholder="Enter a name for your prompt"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea 
                name="description"
                value={promptData.description}
                onChange={handleInputChange}
                placeholder="Describe what this prompt does"
                rows={3}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Template Type</FormLabel>
              <Select 
                name="templateType"
                value={promptData.templateType}
                onChange={handleInputChange}
              >
                <option value="chat">Chat</option>
                <option value="completion">Completion</option>
                <option value="embedding">Embedding</option>
                <option value="function">Function</option>
              </Select>
              <FormHelperText>
                The type of prompt template you're creating
              </FormHelperText>
            </FormControl>
            
            <FormControl>
              <FormLabel>Tags</FormLabel>
              <HStack mb={2}>
                <Input 
                  value={tagInput}
                  onChange={handleTagInputChange}
                  placeholder="Add tags..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button onClick={addTag}>Add</Button>
              </HStack>
              
              <Flex wrap="wrap" gap={2} mt={2}>
                {promptData.tags?.map(tag => (
                  <Tag
                    key={tag}
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                    bg={tagBg}
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeTag(tag)} />
                  </Tag>
                ))}
              </Flex>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>
      
      <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={6}>
        <CardHeader pb={0} display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="md">Template Content</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <Textarea 
                name="content"
                value={promptData.content}
                onChange={handleInputChange}
                placeholder={getPromptPlaceholderText()}
                rows={12}
                fontFamily="monospace"
              />
              <FormHelperText>
                Use {`{{}}`} to define variables, such as {`{{input}}`}, {`{{context}}`}
              </FormHelperText>
            </FormControl>
          </VStack>
        </CardBody>
      </Card>
      
      <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={6}>
        <CardHeader pb={0} display="flex" justifyContent="space-between" alignItems="center">
          <Heading size="md">Parameters</Heading>
          <Button size="sm" leftIcon={<FiPlus />} onClick={onOpen}>
            Add Parameter
          </Button>
        </CardHeader>
        <CardBody>
          {promptData.parameters && promptData.parameters.length > 0 ? (
            <Accordion allowToggle>
              {promptData.parameters.map((param, index) => (
                <AccordionItem key={index} border="1px" borderColor={borderColor} borderRadius="md" mb={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {param.name} {param.optional && <Text as="span" fontSize="sm" color="gray.500">(Optional)</Text>}
                      </Box>
                      <IconButton
                        aria-label="Remove parameter"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeParameter(param.name);
                        }}
                      />
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel>Type</FormLabel>
                        <Text>{param.type}</Text>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Text>{param.description}</Text>
                      </FormControl>
                    </SimpleGrid>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Text color="gray.500" textAlign="center" py={4}>
              No parameters defined yet. Add parameters to make your prompt template more flexible.
            </Text>
          )}
        </CardBody>
      </Card>
      
      {isEdit && prompt?.versions && prompt.versions.length > 0 && (
        <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={6}>
          <CardHeader pb={0}>
            <Heading size="md">Version History</Heading>
          </CardHeader>
          <CardBody>
            <Accordion allowToggle>
              {prompt.versions.map((version, index) => (
                <AccordionItem key={index} border="1px" borderColor={borderColor} borderRadius="md" mb={2}>
                  <h2>
                    <AccordionButton>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        Version {prompt.versions!.length - index} - {new Date(version.createdAt).toLocaleString()}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Textarea 
                      value={version.content}
                      readOnly
                      rows={6}
                      fontFamily="monospace"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                    />
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>
      )}
      
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justifyContent="flex-end">
        <Button size="lg" variant="outline" onClick={() => router.push('/prompts')}>
          Cancel
        </Button>
        <Button 
          size="lg" 
          leftIcon={<FiSave />} 
          colorScheme="blue" 
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          {isEdit ? 'Update Prompt' : 'Create Prompt'}
        </Button>
      </Stack>

      {/* Parameter Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Parameter</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Parameter Name</FormLabel>
                <Input 
                  value={paramInput.name}
                  onChange={(e) => handleParamInputChange(e, 'name')}
                  placeholder="e.g., input, topic, style"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Type</FormLabel>
                <Select 
                  value={paramInput.type}
                  onChange={(e) => handleParamInputChange(e, 'type')}
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="array">Array</option>
                  <option value="object">Object</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  value={paramInput.description}
                  onChange={(e) => handleParamInputChange(e, 'description')}
                  placeholder="Describe what this parameter is for"
                />
              </FormControl>
              
              <FormControl display="flex" alignItems="center">
                <input
                  type="checkbox"
                  id="optional"
                  checked={paramInput.optional}
                  onChange={handleParamOptionalChange}
                  style={{ marginRight: '8px' }}
                />
                <FormLabel htmlFor="optional" mb="0">
                  Optional parameter
                </FormLabel>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={addParameter} isDisabled={!paramInput.name.trim()}>
              Add Parameter
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PromptForm;
