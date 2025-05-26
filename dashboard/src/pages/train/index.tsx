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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Progress,
  Badge,
  Icon,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { FiUpload, FiDatabase, FiCpu, FiPlusCircle, FiPlay } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';

const TrainPage: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Sample training jobs
  const trainingJobs = [
    { 
      id: '1', 
      name: 'Customer Support Fine-tuning', 
      model: 'GPT-3.5 Turbo',
      status: 'completed',
      progress: 100,
      dataset: 'Customer Support Dataset',
      created: '2025-05-15',
      duration: '4h 23m'
    },
    { 
      id: '2', 
      name: 'Product Knowledge Base Training', 
      model: 'Claude-2',
      status: 'in_progress',
      progress: 65,
      dataset: 'Product Documentation',
      created: '2025-05-23',
      duration: '2h 40m'
    },
    { 
      id: '3', 
      name: 'Technical Support Specialization', 
      model: 'GPT-4',
      status: 'queued',
      progress: 0,
      dataset: 'Technical Support Tickets',
      created: '2025-05-26',
      duration: '-'
    }
  ];

  // Sample datasets
  const datasets = [
    { id: '1', name: 'Customer Support Dataset', records: 2500, format: 'JSON', size: '4.2 MB' },
    { id: '2', name: 'Product Documentation', records: 1200, format: 'CSV', size: '2.8 MB' },
    { id: '3', name: 'Technical Support Tickets', records: 1800, format: 'JSON', size: '3.5 MB' }
  ];

  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Heading size="lg" mb={6}>Train</Heading>
        
        <Tabs colorScheme="blue" mb={6}>
          <TabList>
            <Tab>Training Jobs</Tab>
            <Tab>New Training Job</Tab>
            <Tab>Datasets</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                {trainingJobs.map(job => (
                  <Card key={job.id} bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                    <CardHeader pb={0}>
                      <Heading size="md">{job.name}</Heading>
                      <Text fontSize="sm" color="gray.500" mt={1}>Model: {job.model}</Text>
                    </CardHeader>
                    <CardBody py={3}>
                      <VStack align="start" spacing={2}>
                        <HStack justify="space-between" w="100%">
                          <Text fontSize="sm" fontWeight="medium">Status:</Text>
                          <Badge 
                            colorScheme={
                              job.status === 'completed' ? 'green' : 
                              job.status === 'in_progress' ? 'blue' : 'gray'
                            }
                          >
                            {job.status}
                          </Badge>
                        </HStack>
                        
                        {job.status === 'in_progress' && (
                          <Box w="100%">
                            <Progress value={job.progress} size="sm" colorScheme="blue" borderRadius="full" />
                            <Text fontSize="xs" textAlign="right" mt={1}>{job.progress}%</Text>
                          </Box>
                        )}
                        
                        <HStack justify="space-between" w="100%">
                          <Text fontSize="sm" fontWeight="medium">Dataset:</Text>
                          <Text fontSize="sm">{job.dataset}</Text>
                        </HStack>
                        
                        <HStack justify="space-between" w="100%">
                          <Text fontSize="sm" fontWeight="medium">Created:</Text>
                          <Text fontSize="sm">{job.created}</Text>
                        </HStack>
                        
                        <HStack justify="space-between" w="100%">
                          <Text fontSize="sm" fontWeight="medium">Duration:</Text>
                          <Text fontSize="sm">{job.duration}</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                    <CardFooter pt={0}>
                      {job.status === 'completed' ? (
                        <Button colorScheme="blue" size="sm" w="100%">Use Model</Button>
                      ) : job.status === 'in_progress' ? (
                        <Button colorScheme="red" variant="outline" size="sm" w="100%">Cancel Training</Button>
                      ) : (
                        <Button colorScheme="blue" leftIcon={<FiPlay />} size="sm" w="100%">Start Training</Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
                
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" borderStyle="dashed">
                  <CardBody display="flex" alignItems="center" justifyContent="center" py={10}>
                    <VStack spacing={3}>
                      <Icon as={FiPlusCircle} boxSize={10} color="gray.400" />
                      <Button colorScheme="blue">Create New Training Job</Button>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel px={0}>
              <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                <CardHeader>
                  <Heading size="md">Create New Training Job</Heading>
                  <Text color="gray.500" mt={1}>Set up a new training job for a model</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Job Name</FormLabel>
                      <Input placeholder="Enter a name for this training job" />
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Select Base Model</FormLabel>
                      <Select placeholder="Choose a base model">
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                        <option value="gpt-4">GPT-4</option>
                        <option value="claude-2">Claude-2</option>
                      </Select>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        The base model that will be fine-tuned with your dataset
                      </Text>
                    </FormControl>
                    
                    <FormControl isRequired>
                      <FormLabel>Training Dataset</FormLabel>
                      <Select placeholder="Choose a dataset">
                        <option value="customer-support">Customer Support Dataset (2,500 records)</option>
                        <option value="product-docs">Product Documentation (1,200 records)</option>
                        <option value="tech-support">Technical Support Tickets (1,800 records)</option>
                      </Select>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Training Parameters</FormLabel>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm">Number of Epochs</FormLabel>
                          <Input type="number" defaultValue={3} />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Learning Rate</FormLabel>
                          <Input type="number" defaultValue={0.0001} step={0.0001} />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Batch Size</FormLabel>
                          <Input type="number" defaultValue={4} />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Max Tokens</FormLabel>
                          <Input type="number" defaultValue={2048} />
                        </FormControl>
                      </SimpleGrid>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Training Objective</FormLabel>
                      <Textarea 
                        placeholder="Describe the purpose of this training job and what you want the model to learn"
                        rows={3}
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
                <CardFooter>
                  <Button colorScheme="blue" leftIcon={<FiPlay />}>Start Training</Button>
                </CardFooter>
              </Card>
            </TabPanel>
            
            <TabPanel px={0}>
              <HStack justify="space-between" mb={4}>
                <Heading size="md">Available Datasets</Heading>
                <Button leftIcon={<FiUpload />} colorScheme="blue">Upload Dataset</Button>
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                {datasets.map(dataset => (
                  <Card key={dataset.id} bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                    <CardHeader pb={0}>
                      <Heading size="md">{dataset.name}</Heading>
                    </CardHeader>
                    <CardBody py={3}>
                      <VStack align="start" spacing={2}>
                        <HStack justify="space-between" w="100%">
                          <Text fontSize="sm" fontWeight="medium">Records:</Text>
                          <Text fontSize="sm">{dataset.records.toLocaleString()}</Text>
                        </HStack>
                        
                        <HStack justify="space-between" w="100%">
                          <Text fontSize="sm" fontWeight="medium">Format:</Text>
                          <Text fontSize="sm">{dataset.format}</Text>
                        </HStack>
                        
                        <HStack justify="space-between" w="100%">
                          <Text fontSize="sm" fontWeight="medium">Size:</Text>
                          <Text fontSize="sm">{dataset.size}</Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                    <CardFooter pt={0}>
                      <HStack spacing={2} w="100%">
                        <Button colorScheme="blue" variant="outline" size="sm" flex={1}>
                          Preview
                        </Button>
                        <Button colorScheme="blue" size="sm" flex={1}>
                          Use for Training
                        </Button>
                      </HStack>
                    </CardFooter>
                  </Card>
                ))}
                
                <Card bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm" borderStyle="dashed">
                  <CardBody display="flex" alignItems="center" justifyContent="center" py={10}>
                    <VStack spacing={3}>
                      <Icon as={FiDatabase} boxSize={10} color="gray.400" />
                      <Button colorScheme="blue" leftIcon={<FiUpload />}>Upload New Dataset</Button>
                    </VStack>
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

export default TrainPage;
