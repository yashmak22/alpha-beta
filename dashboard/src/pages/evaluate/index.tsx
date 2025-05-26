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
  Flex,
  Stack,
  HStack,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { FiBarChart2, FiCheckCircle, FiPlusCircle, FiPlay, FiDownload } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';

const EvaluatePage: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Sample evaluation data
  const evaluations = [
    { 
      id: '1', 
      name: 'Customer Support Evaluation', 
      agent: 'Customer Support Agent',
      status: 'completed',
      date: '2025-05-20',
      score: 92,
      accuracy: 89,
      relevance: 94
    },
    { 
      id: '2', 
      name: 'Product Recommendation Test', 
      agent: 'Sales Assistant',
      status: 'in_progress',
      date: '2025-05-24',
      score: 78,
      accuracy: 75,
      relevance: 81
    },
    { 
      id: '3', 
      name: 'Technical Support Evaluation', 
      agent: 'Technical Support Agent',
      status: 'scheduled',
      date: '2025-05-28',
      score: null,
      accuracy: null,
      relevance: null
    }
  ];

  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Flex justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Evaluate Agents</Heading>
          <Button leftIcon={<FiPlusCircle />} colorScheme="blue">
            New Evaluation
          </Button>
        </Flex>

        <Tabs colorScheme="blue" mb={6}>
          <TabList>
            <Tab>All Evaluations</Tab>
            <Tab>Create Evaluation</Tab>
            <Tab>Evaluation Datasets</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              <Box borderWidth="1px" borderRadius="lg" borderColor={borderColor} overflow="hidden">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Agent</Th>
                      <Th>Date</Th>
                      <Th>Status</Th>
                      <Th>Score</Th>
                      <Th width="100px">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {evaluations.map((evaluation) => (
                      <Tr key={evaluation.id}>
                        <Td fontWeight="medium">{evaluation.name}</Td>
                        <Td>{evaluation.agent}</Td>
                        <Td>{evaluation.date}</Td>
                        <Td>
                          <Badge 
                            colorScheme={
                              evaluation.status === 'completed' ? 'green' : 
                              evaluation.status === 'in_progress' ? 'blue' : 'gray'
                            }
                          >
                            {evaluation.status === 'completed' ? 'Completed' : 
                             evaluation.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
                          </Badge>
                        </Td>
                        <Td>
                          {evaluation.score ? (
                            <HStack spacing={2}>
                              <Text fontWeight="bold">{evaluation.score}%</Text>
                              <Progress 
                                value={evaluation.score} 
                                size="sm" 
                                width="100px" 
                                colorScheme={evaluation.score >= 90 ? 'green' : evaluation.score >= 70 ? 'yellow' : 'red'} 
                                borderRadius="full"
                              />
                            </HStack>
                          ) : (
                            <Text color="gray.500">-</Text>
                          )}
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            {evaluation.status === 'completed' ? (
                              <Button size="sm" leftIcon={<FiBarChart2 />} colorScheme="blue" variant="ghost">
                                View Report
                              </Button>
                            ) : evaluation.status === 'scheduled' ? (
                              <Button size="sm" leftIcon={<FiPlay />} colorScheme="blue" variant="ghost">
                                Start
                              </Button>
                            ) : (
                              <Button size="sm" leftIcon={<FiCheckCircle />} colorScheme="blue" variant="ghost">
                                Complete
                              </Button>
                            )}
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
            
            <TabPanel px={0}>
              <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardHeader>
                  <Heading size="md">Create New Evaluation</Heading>
                  <Text mt={2} color="gray.500">Set up an evaluation for your agent with a specific dataset or test case</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Evaluation Name</FormLabel>
                      <Input placeholder="Enter a name for this evaluation" />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Select Agent</FormLabel>
                      <Select placeholder="Choose an agent to evaluate">
                        <option value="customer-support">Customer Support Agent</option>
                        <option value="sales-assistant">Sales Assistant</option>
                        <option value="technical-support">Technical Support Agent</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Evaluation Dataset</FormLabel>
                      <Select placeholder="Choose a dataset">
                        <option value="customer-queries">Customer Queries (50 samples)</option>
                        <option value="product-questions">Product Questions (32 samples)</option>
                        <option value="technical-issues">Technical Issues (45 samples)</option>
                        <option value="custom">Custom Dataset</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Evaluation Parameters</FormLabel>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm">Success Threshold (%)</FormLabel>
                          <Input type="number" defaultValue={80} />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Timeout (seconds)</FormLabel>
                          <Input type="number" defaultValue={30} />
                        </FormControl>
                      </SimpleGrid>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Additional Notes</FormLabel>
                      <Textarea placeholder="Add any specific instructions or notes for this evaluation" />
                    </FormControl>
                  </VStack>
                </CardBody>
                <CardFooter>
                  <Button leftIcon={<FiPlay />} colorScheme="blue">Run Evaluation</Button>
                </CardFooter>
              </Card>
            </TabPanel>
            
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                  <CardHeader>
                    <Heading size="md">Customer Queries</Heading>
                    <Text mt={1} color="gray.500">50 sample customer queries with expected responses</Text>
                  </CardHeader>
                  <CardBody>
                    <Text mb={4}>
                      This dataset contains common customer questions about products, services, and support issues. 
                      It includes a mix of simple and complex queries to test agent comprehension and response quality.
                    </Text>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                      <Button leftIcon={<FiDownload />} colorScheme="blue" variant="outline">Download Dataset</Button>
                      <Button colorScheme="blue">Use for Evaluation</Button>
                    </Stack>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                  <CardHeader>
                    <Heading size="md">Product Questions</Heading>
                    <Text mt={1} color="gray.500">32 sample questions about product features and specifications</Text>
                  </CardHeader>
                  <CardBody>
                    <Text mb={4}>
                      This dataset focuses on product-specific questions, features, comparisons, and technical specifications.
                      Ideal for testing product knowledge and recommendation capabilities.
                    </Text>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                      <Button leftIcon={<FiDownload />} colorScheme="blue" variant="outline">Download Dataset</Button>
                      <Button colorScheme="blue">Use for Evaluation</Button>
                    </Stack>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                  <CardHeader>
                    <Heading size="md">Technical Issues</Heading>
                    <Text mt={1} color="gray.500">45 sample technical support questions and troubleshooting scenarios</Text>
                  </CardHeader>
                  <CardBody>
                    <Text mb={4}>
                      This dataset contains technical support questions, error messages, and troubleshooting scenarios.
                      Tests the agent's ability to diagnose problems and provide step-by-step solutions.
                    </Text>
                    <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
                      <Button leftIcon={<FiDownload />} colorScheme="blue" variant="outline">Download Dataset</Button>
                      <Button colorScheme="blue">Use for Evaluation</Button>
                    </Stack>
                  </CardBody>
                </Card>
                
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                  <CardHeader>
                    <Heading size="md">Upload Custom Dataset</Heading>
                    <Text mt={1} color="gray.500">Upload your own evaluation dataset</Text>
                  </CardHeader>
                  <CardBody>
                    <Text mb={4}>
                      Create and upload your own custom evaluation dataset in CSV or JSON format.
                      Must include input queries and expected responses or evaluation criteria.
                    </Text>
                    <Button colorScheme="blue">Upload Dataset</Button>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default EvaluatePage;
