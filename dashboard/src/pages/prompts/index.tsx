import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tag,
  Flex,
  useColorModeValue,
  useDisclosure,
  Text,
  Center,
  Spinner,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiMoreVertical, 
  FiEdit, 
  FiTrash2, 
  FiCopy,
  FiArrowRight,
  FiAlertCircle,
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';
import { setActivePanel } from '@/store/slices/uiSlice';
import { Prompt } from '@/lib/storage';
import { proxyClient } from '@/lib/graphql-client';

const PromptsPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);
  
  const tableBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    dispatch(setActivePanel('prompts'));
  }, [dispatch]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await proxyClient.getPrompts();
        setPrompts(data);
        setFilteredPrompts(data);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        toast({
          title: 'Error fetching prompts',
          description: 'Unable to load prompts. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompts();
  }, [toast]);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = prompts.filter(
        (prompt) =>
          prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPrompts(filtered);
    } else {
      setFilteredPrompts(prompts);
    }
  }, [searchQuery, prompts]);

  const confirmDelete = (prompt: Prompt) => {
    setPromptToDelete(prompt);
    onOpen();
  };

  const handleDelete = async () => {
    if (!promptToDelete) return;
    
    try {
      await proxyClient.deletePrompt(promptToDelete.id);
      setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== promptToDelete.id));
      setFilteredPrompts(prevPrompts => prevPrompts.filter(p => p.id !== promptToDelete.id));
      
      toast({
        title: 'Prompt deleted',
        description: `${promptToDelete.name} has been deleted successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast({
        title: 'Error deleting prompt',
        description: 'Failed to delete prompt. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setPromptToDelete(null);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Layout>
      <Box maxW="1600px" mx="auto">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h1" size="xl">
            Prompts
          </Heading>
          <Link href="/prompts/new" passHref>
            <Button 
              as="a" 
              leftIcon={<FiPlus />} 
              colorScheme="brand"
            >
              New Prompt
            </Button>
          </Link>
        </Flex>
        
        <Flex mb={6} gap={4} wrap={{ base: 'wrap', md: 'nowrap' }}>
          <InputGroup maxW={{ base: '100%', md: '400px' }}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Search prompts..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </InputGroup>
          
          <Menu>
            <MenuButton 
              as={Button} 
              leftIcon={<FiFilter />} 
              variant="outline"
            >
              Filter
            </MenuButton>
            <MenuList>
              <MenuItem>All Prompts</MenuItem>
              <MenuItem>Recently Updated</MenuItem>
              <MenuItem>My Prompts</MenuItem>
              <MenuItem>Shared with Me</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        
        <Box
          border="1px"
          borderColor={borderColor}
          borderRadius="lg"
          overflow="hidden"
          boxShadow="sm"
        >
          <Table variant="simple" bg={tableBg}>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Tags</Th>
                <Th>Version</Th>
                <Th>Last Updated</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={6}>
                    <Center py={6}>
                      <Spinner size="lg" />
                    </Center>
                  </Td>
                </Tr>
              ) : filteredPrompts.length > 0 ? (
                filteredPrompts.map((prompt) => (
                  <Tr key={prompt.id}>
                    <Td fontWeight="medium">
                      <Link href={`/prompts/${prompt.id}`}>
                        <Box as="a" color="brand.500" _hover={{ textDecoration: 'underline' }}>
                          {prompt.name}
                        </Box>
                      </Link>
                    </Td>
                    <Td maxW="300px" isTruncated>{prompt.description}</Td>
                    <Td>
                      <HStack spacing={2}>
                        {prompt.tags?.slice(0, 2).map((tag, index) => (
                          <Tag key={index} size="sm" colorScheme="brand" variant="subtle">
                            {tag}
                          </Tag>
                        ))}
                        {prompt.tags && prompt.tags.length > 2 && (
                          <Tag size="sm" colorScheme="gray">
                            +{prompt.tags.length - 2}
                          </Tag>
                        )}
                      </HStack>
                    </Td>
                    <Td>v{prompt.version || 1}</Td>
                    <Td>{formatDate(prompt.updatedAt)}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Link href={`/prompts/${prompt.id}/edit`} passHref>
                          <IconButton
                            as="a"
                            aria-label="Edit"
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                          />
                        </Link>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="More options"
                            icon={<FiMoreVertical />}
                            size="sm"
                            variant="ghost"
                          />
                          <MenuList>
                            <MenuItem icon={<FiCopy />}>Duplicate</MenuItem>
                            <MenuItem icon={<FiArrowRight />}>Use in Agent</MenuItem>
                            <MenuItem 
                              icon={<FiTrash2 />} 
                              color="red.500"
                              onClick={() => confirmDelete(prompt)}
                            >
                              Delete
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6}>
                    <Flex direction="column" align="center" py={6}>
                      <FiAlertCircle size={24} color="gray" />
                      <Text mt={2} color="gray.500">
                        {searchQuery.trim() ? 'No prompts match your search' : 'No prompts found'}
                      </Text>
                      <Button 
                        mt={4} 
                        leftIcon={<FiPlus />} 
                        colorScheme="brand" 
                        size="sm"
                        as={Link} 
                        href="/prompts/new"
                      >
                        Create your first prompt
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Prompt
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete {promptToDelete?.name}? This action cannot be undone.
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
      </Box>
    </Layout>
  );
};

export default PromptsPage;
