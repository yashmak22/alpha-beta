import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  Stack, 
  Card, 
  CardHeader, 
  CardBody, 
  SimpleGrid, 
  Switch, 
  Select, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel,
  HStack,
  VStack,
  Icon,
  Link,
  Container,
  Badge,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { FiKey, FiSettings, FiDatabase, FiServer, FiExternalLink, FiSave } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';

const SettingsPage: React.FC = () => {
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    searchApi: '',
    huggingface: ''
  });

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedKeys = localStorage.getItem('alpha_api_keys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeys({
      ...apiKeys,
      [name]: value
    });
  };

  const saveApiKeys = () => {
    localStorage.setItem('alpha_api_keys', JSON.stringify(apiKeys));
    toast({
      title: 'Settings saved',
      description: 'Your API keys have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Heading size="lg" mb={6}>Settings</Heading>
        
        <Tabs colorScheme="blue" mb={6}>
          <TabList>
            <Tab><Icon as={FiKey} mr={2} /> API Keys</Tab>
            <Tab><Icon as={FiDatabase} mr={2} /> Database</Tab>
            <Tab><Icon as={FiServer} mr={2} /> Services</Tab>
            <Tab><Icon as={FiSettings} mr={2} /> General</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={5}>
                <CardHeader>
                  <Heading size="md">API Keys</Heading>
                  <Text color="gray.500" mt={1}>
                    Configure API keys for external services
                  </Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>
                        <HStack>
                          <Text>OpenAI API Key</Text>
                          <Badge colorScheme="red">Required</Badge>
                        </HStack>
                      </FormLabel>
                      <Input 
                        type="password" 
                        name="openai" 
                        value={apiKeys.openai} 
                        onChange={handleInputChange}
                        placeholder="Enter your OpenAI API key" 
                      />
                      <HStack mt={1}>
                        <Text fontSize="sm" color="gray.500">
                          Used for embeddings and language model inference
                        </Text>
                        <Link href="https://platform.openai.com/api-keys" isExternal color="blue.500" fontSize="sm">
                          Get an API key <Icon as={FiExternalLink} mx="2px" />
                        </Link>
                      </HStack>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>
                        <HStack>
                          <Text>Search API Key</Text>
                          <Badge colorScheme="gray">Optional</Badge>
                        </HStack>
                      </FormLabel>
                      <Input 
                        type="password" 
                        name="searchApi" 
                        value={apiKeys.searchApi} 
                        onChange={handleInputChange}
                        placeholder="Enter your Search API key (SerpAPI)" 
                      />
                      <HStack mt={1}>
                        <Text fontSize="sm" color="gray.500">
                          Used for web search capabilities
                        </Text>
                        <Link href="https://serpapi.com/" isExternal color="blue.500" fontSize="sm">
                          Get an API key <Icon as={FiExternalLink} mx="2px" />
                        </Link>
                      </HStack>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>
                        <HStack>
                          <Text>Hugging Face API Token</Text>
                          <Badge colorScheme="gray">Optional</Badge>
                        </HStack>
                      </FormLabel>
                      <Input 
                        type="password" 
                        name="huggingface" 
                        value={apiKeys.huggingface} 
                        onChange={handleInputChange}
                        placeholder="Enter your Hugging Face API token" 
                      />
                      <HStack mt={1}>
                        <Text fontSize="sm" color="gray.500">
                          Used for accessing Hugging Face models
                        </Text>
                        <Link href="https://huggingface.co/settings/tokens" isExternal color="blue.500" fontSize="sm">
                          Get a token <Icon as={FiExternalLink} mx="2px" />
                        </Link>
                      </HStack>
                    </FormControl>
                    
                    <Box>
                      <Button leftIcon={<FiSave />} colorScheme="blue" onClick={saveApiKeys}>
                        Save API Keys
                      </Button>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel px={0}>
              <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={5}>
                <CardHeader>
                  <Heading size="md">Database Settings</Heading>
                  <Text color="gray.500" mt={1}>
                    Configure database connections
                  </Text>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>PostgreSQL Connection</FormLabel>
                      <Input 
                        defaultValue="postgresql://postgres:postgres@localhost:5432/alpha" 
                        readOnly
                      />
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Used by agent-service and prompt-service
                      </Text>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>MongoDB Connection</FormLabel>
                      <Input 
                        defaultValue="mongodb://localhost:27017/alpha" 
                        readOnly
                      />
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Used by memory-service
                      </Text>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Neo4j Connection</FormLabel>
                      <Input 
                        defaultValue="neo4j://localhost:7687" 
                        readOnly
                      />
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Used for graph-based memory
                      </Text>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Redis Connection</FormLabel>
                      <Input 
                        defaultValue="redis://localhost:6379" 
                        readOnly
                      />
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        Used for caching and session management
                      </Text>
                    </FormControl>
                  </SimpleGrid>
                  
                  <Text mt={6} color="gray.500">
                    These connection strings are configured in the environment files of each service.
                    To modify them, please update the .env files directly.
                  </Text>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel px={0}>
              <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={5}>
                <CardHeader>
                  <Heading size="md">Service Configuration</Heading>
                  <Text color="gray.500" mt={1}>
                    Configure Alpha Platform microservices
                  </Text>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel>Agent Service</FormLabel>
                      <Input defaultValue="http://localhost:3001" readOnly />
                      <HStack mt={1} justify="space-between">
                        <Text fontSize="sm" color="gray.500">
                          Status: 
                        </Text>
                        <Badge colorScheme="green">Running</Badge>
                      </HStack>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Prompt Service</FormLabel>
                      <Input defaultValue="http://localhost:3002" readOnly />
                      <HStack mt={1} justify="space-between">
                        <Text fontSize="sm" color="gray.500">
                          Status: 
                        </Text>
                        <Badge colorScheme="green">Running</Badge>
                      </HStack>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Memory Service</FormLabel>
                      <Input defaultValue="http://localhost:3003" readOnly />
                      <HStack mt={1} justify="space-between">
                        <Text fontSize="sm" color="gray.500">
                          Status: 
                        </Text>
                        <Badge colorScheme="green">Running</Badge>
                      </HStack>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Tools Service</FormLabel>
                      <Input defaultValue="http://localhost:3004" readOnly />
                      <HStack mt={1} justify="space-between">
                        <Text fontSize="sm" color="gray.500">
                          Status: 
                        </Text>
                        <Badge colorScheme="green">Running</Badge>
                      </HStack>
                    </FormControl>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel px={0}>
              <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" mb={5}>
                <CardHeader>
                  <Heading size="md">General Settings</Heading>
                </CardHeader>
                <CardBody>
                  <Stack spacing={6}>
                    <FormControl display="flex" alignItems="center">
                      <Switch id="dark-mode" colorScheme="blue" />
                      <FormLabel htmlFor="dark-mode" mb="0" ml={2}>
                        Dark Mode
                      </FormLabel>
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <Switch id="analytics" colorScheme="blue" defaultChecked />
                      <FormLabel htmlFor="analytics" mb="0" ml={2}>
                        Usage Analytics
                      </FormLabel>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Default LLM Model</FormLabel>
                      <Select defaultValue="gpt-4">
                        <option value="gpt-4">GPT-4</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="claude-2">Claude 2</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Default Embedding Model</FormLabel>
                      <Select defaultValue="text-embedding-ada-002">
                        <option value="text-embedding-ada-002">text-embedding-ada-002 (OpenAI)</option>
                        <option value="e5-large">E5-large (HuggingFace)</option>
                      </Select>
                    </FormControl>
                  </Stack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default SettingsPage;
