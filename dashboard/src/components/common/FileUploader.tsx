import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Progress,
  VStack,
  HStack,
  useToast,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  Textarea,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiUpload, FiFile, FiX, FiPlus, FiTag } from 'react-icons/fi';
import { fileStorageService, FileMetadata, UploadOptions } from '@/lib/file-storage';

interface FileUploaderProps {
  onUploadComplete?: (fileMetadata: FileMetadata) => void;
  allowedFileTypes?: string[];
  maxFileSizeMB?: number;
  initialCategory?: 'dataset' | 'model' | 'image' | 'document' | 'other';
  multipleFiles?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onUploadComplete,
  allowedFileTypes,
  maxFileSizeMB = 50,
  initialCategory = 'dataset',
  multipleFiles = false,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState<'dataset' | 'model' | 'image' | 'document' | 'other'>(initialCategory);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `Maximum file size is ${maxFileSizeMB}MB`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Check file type if restrictions are provided
      if (allowedFileTypes && allowedFileTypes.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const fileType = file.type;
        
        const isAllowed = allowedFileTypes.some(type => {
          // Check against mime type or extension
          return fileType.includes(type) || (fileExtension && type.includes(fileExtension));
        });
        
        if (!isAllowed) {
          toast({
            title: 'Invalid file type',
            description: `Allowed file types: ${allowedFileTypes.join(', ')}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }
      
      setSelectedFile(file);
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
      
      if (tagInputRef.current) {
        tagInputRef.current.focus();
      }
    }
  };

  const handleTagRemove = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const options: UploadOptions = {
        description,
        tags,
        category,
        onProgress: (progress) => {
          setUploadProgress(progress);
        },
      };

      const fileMetadata = await fileStorageService.uploadFile(selectedFile, options);
      
      toast({
        title: 'Upload complete',
        description: `${selectedFile.name} has been uploaded successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setSelectedFile(null);
      setDescription('');
      setTags([]);
      setTagInput('');
      setUploadProgress(0);
      
      // Notify parent component
      if (onUploadComplete) {
        onUploadComplete(fileMetadata);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'An error occurred while uploading the file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Check file size
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `Maximum file size is ${maxFileSizeMB}MB`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      // Check file type if restrictions are provided
      if (allowedFileTypes && allowedFileTypes.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const fileType = file.type;
        
        const isAllowed = allowedFileTypes.some(type => {
          // Check against mime type or extension
          return fileType.includes(type) || (fileExtension && type.includes(fileExtension));
        });
        
        if (!isAllowed) {
          toast({
            title: 'Invalid file type',
            description: `Allowed file types: ${allowedFileTypes.join(', ')}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }
      
      setSelectedFile(file);
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
    <Box>
      <VStack spacing={4} align="stretch">
        {/* File Drop Zone */}
        <Box
          border="2px dashed"
          borderColor={borderColor}
          borderRadius="md"
          p={6}
          textAlign="center"
          bg={bgColor}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            multiple={multipleFiles}
          />
          
          {selectedFile ? (
            <Flex direction="column" align="center">
              <Flex align="center" mb={2}>
                <FiFile size={24} />
                <Text ml={2} fontWeight="bold">{selectedFile.name}</Text>
                <IconButton
                  aria-label="Remove file"
                  icon={<FiX />}
                  size="sm"
                  variant="ghost"
                  ml={2}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                />
              </Flex>
              <Text color="gray.500">{formatFileSize(selectedFile.size)}</Text>
            </Flex>
          ) : (
            <Flex direction="column" align="center">
              <FiUpload size={32} />
              <Text mt={2} fontWeight="medium">
                Drag and drop a file here, or click to select
              </Text>
              <Text fontSize="sm" color="gray.500" mt={1}>
                {allowedFileTypes 
                  ? `Allowed file types: ${allowedFileTypes.join(', ')}`
                  : 'All file types supported'}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Max file size: {maxFileSizeMB}MB
              </Text>
            </Flex>
          )}
        </Box>

        {selectedFile && (
          <>
            {/* File Metadata Form */}
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
              >
                <option value="dataset">Dataset</option>
                <option value="model">Model</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for this file"
                rows={3}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <HStack mb={2}>
                <Input
                  ref={tagInputRef}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags..."
                  onKeyDown={handleTagInputKeyDown}
                />
                <IconButton
                  aria-label="Add tag"
                  icon={<FiTag />}
                  onClick={handleTagAdd}
                />
              </HStack>

              <Flex wrap="wrap" gap={2} mt={2}>
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => handleTagRemove(tag)} />
                  </Tag>
                ))}
              </Flex>
            </FormControl>

            {uploading && (
              <Box>
                <Text mb={1}>Uploading: {uploadProgress}%</Text>
                <Progress value={uploadProgress} size="sm" colorScheme="blue" />
              </Box>
            )}

            <Button
              leftIcon={<FiUpload />}
              colorScheme="blue"
              onClick={handleUpload}
              isLoading={uploading}
              loadingText="Uploading..."
              isDisabled={!selectedFile || uploading}
            >
              Upload File
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default FileUploader;
