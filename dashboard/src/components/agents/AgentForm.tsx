import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FiSave, FiPlayCircle, FiPlusCircle } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { proxyClient } from '@/lib/graphql-client';
import { Agent } from '@/lib/storage';

interface AgentFormProps {
  agent?: Agent;
  isEdit?: boolean;
}

const AgentForm: React.FC<AgentFormProps> = ({ agent, isEdit = false }) => {
  const router = useRouter();
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Test agent modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Form state
  const [agentConfig, setAgentConfig] = useState<Partial<Agent>>({
    name: '',
    description: '',
    type: 'single',
    status: 'draft',
    model: 'gpt-4',
    maxTokens: 2048,
    temperature: 0.7,
    promptTemplate: '',
    enableMemory: true,
    enableTools: true,
    memoryType: 'vector',
    embeddingModel: 'text-embedding-ada-002',
    memoryRetention: 'session',
    tools: [],
    systemMessage: '',
  });

  // Available tools
  const [availableTools, setAvailableTools] = useState([
    { id: 'web_search', name: 'Web Search', description: 'Search the web for information' },
    { id: 'url_fetcher', name: 'URL Fetcher', description: 'Fetch and extract content from URLs' },
    { id: 'calculator', name: 'Calculator', description: 'Perform mathematical calculations' },
    { id: 'api_connector', name: 'API Connector', description: 'Connect to external APIs' },
  ]);

  // Test prompt for agent testing
  const [testPrompt, setTestPrompt] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  
  // Load agent data if editing
  useEffect(() => {
    if (agent && isEdit) {
      setAgentConfig({
        ...agent,
      });
    }
  }, [agent, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAgentConfig({
      ...agentConfig,
      [name]: value,
    });
  };

  const handleNumberChange = (name: string, value: number) => {
    setAgentConfig({
      ...agentConfig,
      [name]: value,
    });
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setAgentConfig({
      ...agentConfig,
      [name]: checked,
    });
  };

  const handleToolToggle = (toolId: string) => {
    const currentTools = agentConfig.tools || [];
    const updatedTools = currentTools.includes(toolId)
      ? currentTools.filter(id => id !== toolId)
      : [...currentTools, toolId];
    
    setAgentConfig({
      ...agentConfig,
      tools: updatedTools,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Validate form
      if (!agentConfig.name?.trim()) {
        toast({
          title: 'Error',
          description: 'Agent name is required',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }

      if (isEdit && agent) {
        // Update existing agent
        await proxyClient.updateAgent(agent.id, agentConfig);
        toast({
          title: 'Agent updated',
          description: `${agentConfig.name} has been updated successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new agent
        await proxyClient.createAgent(agentConfig);
        toast({
          title: 'Agent created',
          description: `${agentConfig.name} has been created successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      // Redirect to agents list
      router.push('/agents');
    } catch (error) {
      console.error('Error saving agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to save agent. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestAgent = async () => {
    setTestLoading(true);
    try {
      // Simulate agent response for now
      setTestResponse('');
      
      // Typing effect simulation
      const fullResponse = "I'm sorry, but I don't have enough information to provide a specific answer to your question. However, I'd be happy to help if you could provide more details or context about what you're asking. Is there something specific you'd like to know about Alpha Platform or a particular topic you're interested in?";
      
      // Simulate streaming response
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < fullResponse.length) {
          setTestResponse(prev => prev + fullResponse.charAt(index));
          index++;
        } else {
          clearInterval(typingInterval);
          setTestLoading(false);
        }
      }, 30);
      
    } catch (error) {
      console.error('Error testing agent:', error);
      toast({
        title: 'Error',
        description: 'Failed to test agent. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setTestLoading(false);
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
              <FormLabel>Agent Name</FormLabel>
              <Input 
                name="name"
                value={agentConfig.name}
                onChange={handleInputChange}
                placeholder="Enter a name for your agent"
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea 
                name="description"
                value={agentConfig.description}
                onChange={handleInputChange}
                placeholder="Describe what this agent does"
                rows={3}
              />
            </FormControl>
            
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl>
                <FormLabel>Agent Type</FormLabel>
                <Select 
                  name="type"
                  value={agentConfig.type}
                  onChange={handleInputChange}
                >
                  <option value="single">Single Agent</option>
                  <option value="network">Agent Network</option>
                  <option value="supervisor">Supervisor Agent</option>
                </Select>
                <FormHelperText>
                  Type of agent architecture
                </FormHelperText>
              </FormControl>
              
              <FormControl>
                <FormLabel>Model</FormLabel>
                <Select 
                  name="model"
                  value={agentConfig.model}
                  onChange={handleInputChange}
                >
                  <option value="gpt-4">GPT-4</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-2">Claude 2</option>
                  <option value="llama-2">Llama 2</option>
                  <option value="falcon-40b">Falcon 40B</option>
                </Select>
                <FormHelperText>
                  LLM to use for this agent
                </FormHelperText>
              </FormControl>
              
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select 
                  name="status"
                  value={agentConfig.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </Select>
                <FormHelperText>
                  Current agent availability
                </FormHelperText>
              </FormControl>
            </SimpleGrid>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Max Tokens</FormLabel>
                <NumberInput
                  min={1}
                  max={32000}
                  value={agentConfig.maxTokens}
                  onChange={(_, value) => handleNumberChange('maxTokens', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>
                  Maximum response length
                </FormHelperText>
              </FormControl>
              
              <FormControl>
                <FormLabel>Temperature</FormLabel>
                <NumberInput
                  step={0.1}
                  min={0}
                  max={2}
                  value={agentConfig.temperature}
                  onChange={(_, value) => handleNumberChange('temperature', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormHelperText>
                  Controls randomness (0 = deterministic, 1 = creative)
                </FormHelperText>
              </FormControl>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>
      
      <Tabs colorScheme="blue" mb={6}>
        <TabList>
          <Tab>Prompt Template</Tab>
          <Tab>Memory</Tab>
          <Tab>Tools</Tab>
          <Tab>Advanced</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel px={0}>
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
              <CardHeader pb={0}>
                <Heading size="md">Prompt Template</Heading>
                <Text color="gray.500" mt={1}>
                  Define the instructions and behavior for your agent
                </Text>
              </CardHeader>
              <CardBody>
                <FormControl>
                  <Textarea 
                    name="promptTemplate"
                    value={agentConfig.promptTemplate}
                    onChange={handleInputChange}
                    placeholder="Enter the prompt template for your agent. Use {'{{input}}'} as a placeholder for user input."
                    rows={10}
                  />
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Use variables like {'{{input}}'} for user input, {'{{context}}'} for retrieved context, and {'{{history}}'} for conversation history.
                  </Text>
                </FormControl>
              </CardBody>
            </Card>
          </TabPanel>
          
          <TabPanel px={0}>
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
              <CardHeader pb={0}>
                <Heading size="md">Memory Configuration</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <Switch 
                      id="enableMemory" 
                      name="enableMemory"
                      isChecked={agentConfig.enableMemory}
                      onChange={handleSwitchChange}
                      colorScheme="blue" 
                    />
                    <FormLabel htmlFor="enableMemory" mb="0" ml={2}>
                      Enable Memory
                    </FormLabel>
                  </FormControl>
                  
                  <Divider />
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isDisabled={!agentConfig.enableMemory}>
                      <FormLabel>Memory Type</FormLabel>
                      <Select 
                        name="memoryType"
                        value={agentConfig.memoryType}
                        onChange={handleInputChange}
                        disabled={!agentConfig.enableMemory}
                      >
                        <option value="vector">Vector Memory</option>
                        <option value="graph">Graph Memory</option>
                        <option value="hybrid">Hybrid (Vector + Graph)</option>
                      </Select>
                      <FormHelperText>
                        How information is stored and retrieved
                      </FormHelperText>
                    </FormControl>
                    
                    <FormControl isDisabled={!agentConfig.enableMemory}>
                      <FormLabel>Embedding Model</FormLabel>
                      <Select 
                        name="embeddingModel"
                        value={agentConfig.embeddingModel}
                        onChange={handleInputChange}
                        disabled={!agentConfig.enableMemory}
                      >
                        <option value="text-embedding-ada-002">text-embedding-ada-002 (OpenAI)</option>
                        <option value="e5-large">E5-large (HuggingFace)</option>
                        <option value="instructor-xl">Instructor-XL (HuggingFace)</option>
                      </Select>
                      <FormHelperText>
                        Model used to create vector embeddings
                      </FormHelperText>
                    </FormControl>
                  </SimpleGrid>
                  
                  <FormControl isDisabled={!agentConfig.enableMemory}>
                    <FormLabel>Memory Retention</FormLabel>
                    <Select 
                      name="memoryRetention"
                      value={agentConfig.memoryRetention}
                      onChange={handleInputChange}
                      disabled={!agentConfig.enableMemory}
                    >
                      <option value="conversation">Conversation Only</option>
                      <option value="session">Session Persistence</option>
                      <option value="permanent">Permanent</option>
                    </Select>
                    <FormHelperText>
                      Determines how long memories are retained
                    </FormHelperText>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
          
          <TabPanel px={0}>
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
              <CardHeader pb={0}>
                <Heading size="md">Tools Configuration</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <Switch 
                      id="enableTools" 
                      name="enableTools"
                      isChecked={agentConfig.enableTools}
                      onChange={handleSwitchChange}
                      colorScheme="blue" 
                    />
                    <FormLabel htmlFor="enableTools" mb="0" ml={2}>
                      Enable Tools
                    </FormLabel>
                  </FormControl>
                  
                  <Divider />
                  
                  <Heading size="sm">Available Tools</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    {availableTools.map(tool => (
                      <FormControl 
                        key={tool.id} 
                        display="flex" 
                        alignItems="center"
                        isDisabled={!agentConfig.enableTools}
                      >
                        <Checkbox
                          id={`tool-${tool.id}`}
                          isChecked={agentConfig.tools?.includes(tool.id)}
                          onChange={() => handleToolToggle(tool.id)}
                          colorScheme="blue"
                          isDisabled={!agentConfig.enableTools}
                        />
                        <Box ml={2}>
                          <FormLabel htmlFor={`tool-${tool.id}`} mb="0">
                            {tool.name}
                          </FormLabel>
                          <Text fontSize="xs" color="gray.500">
                            {tool.description}
                          </Text>
                        </Box>
                      </FormControl>
                    ))}
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
          
          <TabPanel px={0}>
            <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
              <CardHeader pb={0}>
                <Heading size="md">Advanced Configuration</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Presence Penalty</FormLabel>
                      <NumberInput
                        step={0.1}
                        min={-2}
                        max={2}
                        defaultValue={0}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>
                        Penalty for repeating topics (-2 to 2)
                      </FormHelperText>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Frequency Penalty</FormLabel>
                      <NumberInput
                        step={0.1}
                        min={-2}
                        max={2}
                        defaultValue={0}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>
                        Penalty for repeating tokens (-2 to 2)
                      </FormHelperText>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Top P</FormLabel>
                      <NumberInput
                        step={0.1}
                        min={0}
                        max={1}
                        defaultValue={1}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>
                        Token selection: consider only top P% probability tokens
                      </FormHelperText>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Top K</FormLabel>
                      <NumberInput
                        min={1}
                        max={100}
                        defaultValue={50}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>
                        Token selection: consider only top K tokens
                      </FormHelperText>
                    </FormControl>
                  </SimpleGrid>
                  
                  <FormControl>
                    <FormLabel>System Message Override</FormLabel>
                    <Textarea 
                      name="systemMessage"
                      value={agentConfig.systemMessage}
                      onChange={handleInputChange}
                      placeholder="Optional: Override the system message for this agent"
                      rows={4}
                    />
                    <FormHelperText>
                      Overrides the default system message for the selected model
                    </FormHelperText>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justifyContent="flex-end">
        <Button size="lg" variant="outline" onClick={() => router.push('/agents')}>
          Cancel
        </Button>
        <Button 
          size="lg" 
          leftIcon={<FiPlayCircle />} 
          colorScheme="blue" 
          variant="outline"
          onClick={onOpen}
        >
          Test Agent
        </Button>
        <Button 
          size="lg" 
          leftIcon={<FiSave />} 
          colorScheme="blue" 
          onClick={handleSubmit}
          isLoading={isLoading}
        >
          {isEdit ? 'Update Agent' : 'Create Agent'}
        </Button>
      </Stack>

      {/* Test Agent Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Test Agent: {agentConfig.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text>
                Test your agent with a sample query to see how it responds.
              </Text>
              <Box
                p={4}
                borderWidth={1}
                borderRadius="md"
                borderColor={borderColor}
                h="300px"
                overflowY="auto"
              >
                {testResponse ? (
                  <Text whiteSpace="pre-wrap">{testResponse}</Text>
                ) : (
                  <Text color="gray.500" fontStyle="italic">
                    Agent response will appear here...
                  </Text>
                )}
              </Box>
              <Textarea
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                placeholder="Enter a test query for your agent..."
                rows={3}
              />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleTestAgent}
              isLoading={testLoading}
              isDisabled={!testPrompt.trim()}
            >
              Run Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AgentForm;
