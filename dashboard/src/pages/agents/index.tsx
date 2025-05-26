import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  HStack, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Badge,
  useColorModeValue,
  Container,
  Flex,
  Spacer,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton
} from '@chakra-ui/react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Agent } from '@/lib/storage';
import { proxyClient } from '@/lib/graphql-client';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

const AgentsPage: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await proxyClient.getAgents();
        setAgents(data);
        setFilteredAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast({
          title: 'Error fetching agents',
          description: 'Unable to load agents. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, [toast]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredAgents(agents);
    } else {
      const filtered = agents.filter(agent => 
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        agent.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredAgents(filtered);
    }
  };

  const confirmDelete = (agent: Agent) => {
    setAgentToDelete(agent);
    onOpen();
  };

  const handleDelete = async () => {
    if (!agentToDelete) return;
    
    try {
      await proxyClient.deleteAgent(agentToDelete.id);
      setAgents(prevAgents => prevAgents.filter(a => a.id !== agentToDelete.id));
      setFilteredAgents(prevAgents => prevAgents.filter(a => a.id !== agentToDelete.id));
      
      toast({
        title: 'Agent deleted',
        description: `${agentToDelete.name} has been deleted successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: 'Error deleting agent',
        description: 'Failed to delete agent. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setAgentToDelete(null);
    }
  };

  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Flex alignItems="center" mb={6}>
          <Heading size="lg">Agents</Heading>
          <Spacer />
          <HStack>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input 
                placeholder="Search agents..." 
                value={searchQuery}
                onChange={handleSearch}
              />
            </InputGroup>
            <Button leftIcon={<FiPlus />} colorScheme="blue" as={Link} href="/agents/new">
              Create Agent
            </Button>
          </HStack>
        </Flex>

        <Box borderWidth="1px" borderRadius="lg" borderColor={borderColor} overflow="hidden">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th width="100px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={4}>
                    <Text textAlign="center" py={4}>Loading agents...</Text>
                  </Td>
                </Tr>
              ) : filteredAgents.length > 0 ? (
                filteredAgents.map((agent) => (
                  <Tr key={agent.id} _hover={{ bg: hoverBg }} cursor="pointer">
                    <Td fontWeight="medium">{agent.name}</Td>
                    <Td>{agent.description}</Td>
                    <Td>
                      <Badge colorScheme={agent.status === 'active' ? 'green' : 'gray'}>
                        {agent.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit agent"
                          icon={<FiEdit2 />}
                          size="sm"
                          variant="ghost"
                          as={Link}
                          href={`/agents/${agent.id}/edit`}
                        />
                        <IconButton
                          aria-label="Delete agent"
                          icon={<FiTrash2 />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => confirmDelete(agent)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4}>
                    <Flex direction="column" align="center" py={6}>
                      <FiAlertCircle size={24} color="gray" />
                      <Text mt={2} color="gray.500">
                        {searchQuery.trim() ? 'No agents match your search' : 'No agents found'}
                      </Text>
                      <Button 
                        mt={4} 
                        leftIcon={<FiPlus />} 
                        colorScheme="blue" 
                        size="sm"
                        as={Link} 
                        href="/agents/new"
                      >
                        Create your first agent
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Container>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Agent
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {agentToDelete?.name}? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
};

export default AgentsPage;
