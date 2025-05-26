import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import Layout from '@/components/layout/Layout';
import AgentForm from '@/components/agents/AgentForm';

const NewAgentPage: React.FC = () => {

  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Heading size="lg" mb={6}>Create New Agent</Heading>
        <AgentForm />
      </Container>
    </Layout>
  );
};

export default NewAgentPage;
