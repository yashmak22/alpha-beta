import React, { useState, useEffect } from 'react';
import { Container, Heading, Spinner, Center, Text } from '@chakra-ui/react';
import Layout from '@/components/layout/Layout';
import PromptForm from '@/components/prompts/PromptForm';
import { useRouter } from 'next/router';
import { proxyClient } from '@/lib/graphql-client';
import { Prompt } from '@/lib/storage';

const EditPromptPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await proxyClient.getPromptById(id as string);
        
        if (!data) {
          setError('Prompt not found');
        } else {
          setPrompt(data);
        }
      } catch (error) {
        console.error('Error fetching prompt:', error);
        setError('Failed to load prompt details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <Container maxW="container.xl" py={5}>
          <Center h="50vh">
            <Spinner size="xl" />
          </Center>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxW="container.xl" py={5}>
          <Center h="50vh" flexDirection="column">
            <Text fontSize="xl" fontWeight="bold" color="red.500">{error}</Text>
            <Text mt={2}>Please go back and try again</Text>
          </Center>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Heading size="lg" mb={6}>Edit Prompt: {prompt?.name}</Heading>
        {prompt && <PromptForm prompt={prompt} isEdit={true} />}
      </Container>
    </Layout>
  );
};

export default EditPromptPage;
