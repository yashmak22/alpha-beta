import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  VStack,
  IconButton,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Spinner,
  Center,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import {
  FiUpload,
  FiDownload,
  FiSearch,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiFileText,
  FiFilter,
  FiAlertCircle,
} from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import FileUploader from '@/components/common/FileUploader';
import { fileStorageService, FileMetadata } from '@/lib/file-storage';
import { useDispatch } from 'react-redux';
import { setActivePanel } from '@/store/slices/uiSlice';

const DatasetsPage: React.FC = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  
  const [datasets, setDatasets] = useState<FileMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDatasets, setFilteredDatasets] = useState<FileMetadata[]>([]);
  const [datasetToDelete, setDatasetToDelete] = useState<FileMetadata | null>(null);
  
  const tableBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    dispatch(setActivePanel('datasets'));
    fetchDatasets();
  }, [dispatch]);
  
  const fetchDatasets = async () => {
    setIsLoading(true);
    try {
      const files = await fileStorageService.getFilesByCategory('dataset');
      setDatasets(files);
      setFilteredDatasets(files);
    } catch (error) {
      console.error('Error fetching datasets:', error);
      toast({
        title: 'Error fetching datasets',
        description: 'Unable to load datasets. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = datasets.filter(
        (dataset) =>
          dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dataset.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dataset.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredDatasets(filtered);
    } else {
      setFilteredDatasets(datasets);
    }
  }, [searchQuery, datasets]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleUploadComplete = (fileMetadata: FileMetadata) => {
    setDatasets([...datasets, fileMetadata]);
    onUploadClose();
  };
  
  const confirmDelete = (dataset: FileMetadata) => {
    setDatasetToDelete(dataset);
    onDeleteOpen();
  };
  
  const handleDelete = async () => {
    if (!datasetToDelete) return;
    
    try {
      const success = await fileStorageService.deleteFile(datasetToDelete.id);
      if (success) {
        setDatasets(datasets.filter(d => d.id !== datasetToDelete.id));
        toast({
          title: 'Dataset deleted',
          description: `${datasetToDelete.name} has been deleted successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting dataset:', error);
      toast({
        title: 'Error deleting dataset',
        description: 'Failed to delete dataset. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onDeleteClose();
      setDatasetToDelete(null);
    }
  };
  
  const handleDownload = async (id: string, name: string) => {
    try {
      const blob = await fileStorageService.downloadFile(id);
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading dataset:', error);
      toast({
        title: 'Download failed',
        description: 'An error occurred while downloading the dataset',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
    }
  };
  
  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Datasets</Heading>
          <Button leftIcon={<FiUpload />} colorScheme="blue" onClick={onUploadOpen}>
            Upload Dataset
          </Button>
        </Flex>
        
        <Flex mb={6} gap={4} wrap={{ base: 'wrap', md: 'nowrap' }}>
          <InputGroup maxW={{ base: '100%', md: '400px' }}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input 
              placeholder="Search datasets..." 
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
              <MenuItem>All Datasets</MenuItem>
              <MenuItem>Recently Added</MenuItem>
              <MenuItem>My Datasets</MenuItem>
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
                <Th>Size</Th>
                <Th>Type</Th>
                <Th>Uploaded</Th>
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
              ) : filteredDatasets.length > 0 ? (
                filteredDatasets.map((dataset) => (
                  <Tr key={dataset.id}>
                    <Td fontWeight="medium">{dataset.name}</Td>
                    <Td maxW="300px" isTruncated>{dataset.description || 'No description'}</Td>
                    <Td>{formatFileSize(dataset.size)}</Td>
                    <Td>
                      <Badge colorScheme={
                        dataset.type.includes('csv') ? 'green' :
                        dataset.type.includes('json') ? 'blue' :
                        dataset.type.includes('text') ? 'gray' : 'purple'
                      }>
                        {dataset.type.split('/')[1] || dataset.type}
                      </Badge>
                    </Td>
                    <Td>{formatDate(dataset.uploadedAt)}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Download dataset"
                          icon={<FiDownload />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownload(dataset.id, dataset.name)}
                        />
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="More options"
                            icon={<FiMoreVertical />}
                            size="sm"
                            variant="ghost"
                          />
                          <MenuList>
                            <MenuItem icon={<FiEye />}>Preview</MenuItem>
                            <MenuItem icon={<FiEdit />}>Edit Metadata</MenuItem>
                            <MenuItem 
                              icon={<FiTrash2 />} 
                              color="red.500"
                              onClick={() => confirmDelete(dataset)}
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
                        {searchQuery.trim() ? 'No datasets match your search' : 'No datasets found'}
                      </Text>
                      <Button 
                        mt={4} 
                        leftIcon={<FiUpload />} 
                        colorScheme="blue" 
                        size="sm"
                        onClick={onUploadOpen}
                      >
                        Upload your first dataset
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
        
        {/* Upload Dataset Modal */}
        <Modal isOpen={isUploadOpen} onClose={onUploadClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload Dataset</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FileUploader 
                onUploadComplete={handleUploadComplete}
                allowedFileTypes={['csv', 'json', 'text/csv', 'application/json']}
                maxFileSizeMB={50}
                initialCategory="dataset"
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onUploadClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={onDeleteClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Dataset
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to delete {datasetToDelete?.name}? This action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onDeleteClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </Layout>
  );
};

export default DatasetsPage;
