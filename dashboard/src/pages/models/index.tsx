import React from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  SimpleGrid, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter,
  Badge,
  HStack,
  VStack,
  Icon,
  Flex,
  Container,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel
} from '@chakra-ui/react';
import { FiPlusCircle, FiCpu, FiExternalLink, FiSettings, FiActivity } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';

const ModelsPage: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Sample data for models
  const models = [
    { 
      id: '1', 
      name: 'GPT-4', 
      provider: 'OpenAI', 
      type: 'LLM',
      status: 'active',
      contextWindow: '8k tokens',
      costPer1kTokens: '$0.06',
      usage: '12,453 tokens' 
    },
    { 
      id: '2', 
      name: 'Claude 2', 
      provider: 'Anthropic', 
      type: 'LLM',
      status: 'active',
      contextWindow: '100k tokens',
      costPer1kTokens: '$0.08',
      usage: '8,245 tokens' 
    },
    { 
      id: '3', 
      name: 'text-embedding-ada-002', 
      provider: 'OpenAI', 
      type: 'Embeddings',
      status: 'active',
      contextWindow: 'N/A',
      costPer1kTokens: '$0.0001',
      usage: '25,640 tokens' 
    },
    { 
      id: '4', 
      name: 'Falcon-40B', 
      provider: 'HuggingFace', 
      type: 'LLM',
      status: 'inactive',
      contextWindow: '2k tokens',
      costPer1kTokens: 'Free',
      usage: '0 tokens' 
    }
  ];

  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Models</Heading>
          <Button leftIcon={<FiPlusCircle />} colorScheme="blue">
            Add Model
          </Button>
        </Flex>

        <Tabs colorScheme="blue" mb={6}>
          <TabList>
            <Tab>All Models</Tab>
            <Tab>LLMs</Tab>
            <Tab>Embeddings</Tab>
            <Tab>Usage & Costs</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              <Box borderWidth="1px" borderRadius="lg" borderColor={borderColor} overflow="hidden">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Provider</Th>
                      <Th>Type</Th>
                      <Th>Context Window</Th>
                      <Th>Cost (1K tokens)</Th>
                      <Th>Status</Th>
                      <Th width="100px">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {models.map((model) => (
                      <Tr key={model.id}>
                        <Td fontWeight="medium">{model.name}</Td>
                        <Td>{model.provider}</Td>
                        <Td>{model.type}</Td>
                        <Td>{model.contextWindow}</Td>
                        <Td>{model.costPer1kTokens}</Td>
                        <Td>
                          <Badge colorScheme={model.status === 'active' ? 'green' : 'gray'}>
                            {model.status}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button size="sm" leftIcon={<FiSettings />} variant="ghost">
                              Configure
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
            
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                {models.filter(m => m.type === 'LLM').map(model => (
                  <Card key={model.id} bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">{model.name}</Heading>
                        <Badge colorScheme={model.status === 'active' ? 'green' : 'gray'}>
                          {model.status}
                        </Badge>
                      </Flex>
                      <Text fontSize="sm" color="gray.500">{model.provider}</Text>
                    </CardHeader>
                    <CardBody py={2}>
                      <VStack align="start" spacing={1}>
                        <Text><strong>Context Window:</strong> {model.contextWindow}</Text>
                        <Text><strong>Cost:</strong> {model.costPer1kTokens} per 1K tokens</Text>
                        <Text><strong>Usage:</strong> {model.usage}</Text>
                      </VStack>
                    </CardBody>
                    <CardFooter pt={0}>
                      <HStack spacing={2}>
                        <Button size="sm" leftIcon={<FiSettings />} colorScheme="blue" variant="outline">
                          Configure
                        </Button>
                        <Button size="sm" leftIcon={<FiActivity />} colorScheme="blue" variant="ghost">
                          View Usage
                        </Button>
                      </HStack>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                {models.filter(m => m.type === 'Embeddings').map(model => (
                  <Card key={model.id} bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                    <CardHeader>
                      <Flex justify="space-between" align="center">
                        <Heading size="md">{model.name}</Heading>
                        <Badge colorScheme={model.status === 'active' ? 'green' : 'gray'}>
                          {model.status}
                        </Badge>
                      </Flex>
                      <Text fontSize="sm" color="gray.500">{model.provider}</Text>
                    </CardHeader>
                    <CardBody py={2}>
                      <VStack align="start" spacing={1}>
                        <Text><strong>Cost:</strong> {model.costPer1kTokens} per 1K tokens</Text>
                        <Text><strong>Usage:</strong> {model.usage}</Text>
                      </VStack>
                    </CardBody>
                    <CardFooter pt={0}>
                      <HStack spacing={2}>
                        <Button size="sm" leftIcon={<FiSettings />} colorScheme="blue" variant="outline">
                          Configure
                        </Button>
                        <Button size="sm" leftIcon={<FiActivity />} colorScheme="blue" variant="ghost">
                          View Usage
                        </Button>
                      </HStack>
                    </CardFooter>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel>
              <Text mb={4}>
                Model usage statistics and cost information will be displayed here.
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default ModelsPage;
