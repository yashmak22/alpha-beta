import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  useColorModeValue,
  Progress,
  Alert,
  AlertIcon,
  Link as ChakraLink,
  Divider,
  useToast
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    searchApi: '',
    huggingface: ''
  });

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const steps = [
    {
      title: 'OpenAI API Key',
      description: 'Used for vector embeddings and language model inference. Essential for memory and reasoning capabilities.',
      field: 'openai',
      isRequired: true,
      signupUrl: 'https://platform.openai.com/api-keys',
      signupText: 'Get an OpenAI API key'
    },
    {
      title: 'Search API Key',
      description: 'Used for web search capabilities in the tools service. Enable your agents to search the web for information.',
      field: 'searchApi',
      isRequired: false,
      signupUrl: 'https://serpapi.com/',
      signupText: 'Get a SerpAPI key'
    },
    {
      title: 'Hugging Face API Token',
      description: 'Used for accessing Hugging Face models. Optional but recommended for enhanced model capabilities.',
      field: 'huggingface',
      isRequired: false,
      signupUrl: 'https://huggingface.co/settings/tokens',
      signupText: 'Get a Hugging Face token'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiKeys({
      ...apiKeys,
      [name]: value
    });
  };

  const handleNext = () => {
    const currentStep = steps[step];
    
    // Validate required fields
    if (currentStep.isRequired && !apiKeys[currentStep.field as keyof typeof apiKeys]) {
      toast({
        title: 'API Key Required',
        description: `${currentStep.title} is required to continue.`,
        status: 'error',
        duration: 3000,
        isClosable: true
      });
      return;
    }

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Save API keys and redirect to dashboard
      localStorage.setItem('alpha_api_keys', JSON.stringify(apiKeys));
      toast({
        title: 'Setup Complete',
        description: 'Your API keys have been saved successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      router.push('/');
    }
  };

  const handleSkip = () => {
    const currentStep = steps[step];
    if (!currentStep.isRequired) {
      if (step < steps.length - 1) {
        setStep(step + 1);
      } else {
        // Save API keys and redirect to dashboard
        localStorage.setItem('alpha_api_keys', JSON.stringify(apiKeys));
        router.push('/');
      }
    }
  };

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={10}>
      <Container maxW="container.md">
        <Box bg={bgColor} p={8} borderRadius="lg" borderWidth="1px" borderColor={borderColor} boxShadow="md">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>Alpha Platform Setup</Heading>
              <Text color="gray.500">Step {step + 1} of {steps.length}: {currentStep.title}</Text>
              <Progress value={progress} size="sm" colorScheme="blue" mt={2} borderRadius="full" />
            </Box>

            <Box>
              <Heading size="md" mb={4}>{currentStep.title}</Heading>
              <Text mb={6}>{currentStep.description}</Text>

              <FormControl isRequired={currentStep.isRequired}>
                <FormLabel>{currentStep.title}</FormLabel>
                <Input 
                  type="password" 
                  name={currentStep.field} 
                  value={apiKeys[currentStep.field as keyof typeof apiKeys]} 
                  onChange={handleInputChange}
                  placeholder={`Enter your ${currentStep.title}`}
                />
                <FormHelperText>
                  <HStack>
                    <Text>{currentStep.isRequired ? 'Required' : 'Optional'}</Text>
                    <ChakraLink href={currentStep.signupUrl} isExternal color="blue.500">
                      {currentStep.signupText} <FiExternalLink style={{ display: 'inline' }} />
                    </ChakraLink>
                  </HStack>
                </FormHelperText>
              </FormControl>

              {!currentStep.isRequired && (
                <Alert status="info" mt={4} borderRadius="md">
                  <AlertIcon />
                  This API key is optional. You can skip this step if you don't have a key.
                </Alert>
              )}
            </Box>

            <Divider />

            <HStack justifyContent="space-between">
              {!currentStep.isRequired && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip this step
                </Button>
              )}
              <Button 
                colorScheme="blue" 
                rightIcon={<FiArrowRight />} 
                onClick={handleNext}
                ml={!currentStep.isRequired ? 'auto' : undefined}
              >
                {step < steps.length - 1 ? 'Next' : 'Finish Setup'}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default OnboardingPage;
