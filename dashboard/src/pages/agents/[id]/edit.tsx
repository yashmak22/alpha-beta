import React, { useState, useEffect } from 'react';
import { Container, Heading, Spinner, Center, Text, Box } from '@chakra-ui/react';
import Layout from '@/components/layout/Layout';
import AgentForm from '@/components/agents/AgentForm';
import { useRouter } from 'next/router';
import { proxyClient } from '@/lib/graphql-client';
import { Agent } from '@/lib/storage';

const EditAgentPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await proxyClient.getAgentById(id as string);
        
        if (!data) {
          setError('Agent not found');
        } else {
          setAgent(data);
        }
      } catch (error) {
        console.error('Error fetching agent:', error);
        setError('Failed to load agent details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgent();
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
        <Heading size="lg" mb={6}>Edit Agent: {agent?.name}</Heading>
        {agent && <AgentForm agent={agent} isEdit={true} />}
      </Container>
    </Layout>
  );
};

export default EditAgentPage;
