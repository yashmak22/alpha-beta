import React from 'react';
import { 
  Box, 
  Heading, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel, 
  Card, 
  CardHeader, 
  CardBody, 
  SimpleGrid, 
  Text, 
  Button, 
  Icon, 
  Flex, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { FiDatabase, FiTool, FiPlusCircle } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';

const MemoryToolsPage: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const memoryItems = [
    { id: 1, name: 'Vector Memory', description: 'Semantic search and retrieval using vector embeddings', count: 234, type: 'memory' },
    { id: 2, name: 'Graph Memory', description: 'Store relationships between entities using graph database', count: 45, type: 'memory' },
    { id: 3, name: 'Cache Memory', description: 'Fast key-value storage for temporary information', count: 512, type: 'memory' },
  ];

  const toolItems = [
    { id: 1, name: 'Web Search', description: 'Search the web for real-time information', count: 103, type: 'tool' },
    { id: 2, name: 'URL Fetcher', description: 'Retrieve and extract content from web pages', count: 76, type: 'tool' },
    { id: 3, name: 'Calculator', description: 'Perform calculations and mathematical operations', count: 58, type: 'tool' },
    { id: 4, name: 'API Connector', description: 'Connect to external APIs and services', count: 24, type: 'tool' },
  ];

  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Heading size="lg" mb={6}>Memory & Tools</Heading>
        
        <Tabs colorScheme="blue" isFitted variant="enclosed" mb={6}>
          <TabList>
            <Tab><Icon as={FiDatabase} mr={2} /> Memory</Tab>
            <Tab><Icon as={FiTool} mr={2} /> Tools</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="lg" fontWeight="medium">Memory Types</Text>
                <Button leftIcon={<FiPlusCircle />} colorScheme="blue" size="sm">Add Memory Record</Button>
              </Flex>
              
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                {memoryItems.map(item => (
                  <Card key={item.id} bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                    <CardHeader pb={0}>
                      <Heading size="md">{item.name}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text mb={4} color="gray.500">{item.description}</Text>
                      <Stat>
                        <StatLabel>Records</StatLabel>
                        <StatNumber>{item.count}</StatNumber>
                        <StatHelpText>Active</StatHelpText>
                      </Stat>
                      <Button size="sm" colorScheme="blue" variant="outline" mt={2}>View Records</Button>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel px={0}>
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontSize="lg" fontWeight="medium">Available Tools</Text>
                <Button leftIcon={<FiPlusCircle />} colorScheme="blue" size="sm">Create Custom Tool</Button>
              </Flex>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5}>
                {toolItems.map(item => (
                  <Card key={item.id} bg={cardBg} border="1px" borderColor={borderColor} boxShadow="sm">
                    <CardHeader pb={0}>
                      <Heading size="md">{item.name}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text mb={4} color="gray.500">{item.description}</Text>
                      <Stat>
                        <StatLabel>Uses</StatLabel>
                        <StatNumber>{item.count}</StatNumber>
                        <StatHelpText>Past 30 days</StatHelpText>
                      </Stat>
                      <Button size="sm" colorScheme="blue" variant="outline" mt={2}>Configure</Button>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default MemoryToolsPage;
