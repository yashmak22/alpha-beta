import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import Layout from '@/components/layout/Layout';
import PromptForm from '@/components/prompts/PromptForm';

const NewPromptPage = () => {
  
  return (
    <Layout>
      <Container maxW="container.xl" py={5}>
        <Heading size="lg" mb={6}>Create New Prompt</Heading>
        <PromptForm />
      </Container>
    </Layout>
  );
};

export default NewPromptPage;
