import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
  useColorModeValue,
  HStack,
  Icon,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiGithub, FiMail, FiLock, FiAlertCircle, FiMail as FiGoogle, FiGlobe } from 'react-icons/fi';
import { FaMicrosoft } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const { login, error, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }
    
    // In a real implementation, this would validate and call the API
    // For development, we'll use our mock login
    try {
      // Simulate API call
      await login('password');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    login(provider);
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6" textAlign="center">
            <Heading size="xl" fontWeight="bold">
              Alpha Platform
            </Heading>
            <Text fontSize="lg">
              Sign in to your account
            </Text>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={{ base: 'none', sm: 'md' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <Stack spacing="6">
              {(error || localError) && (
                <Alert status="error">
                  <AlertIcon as={FiAlertCircle} />
                  {error || localError}
                </Alert>
              )}
              
              <form onSubmit={handleLogin}>
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Flex>
                      <Box position="relative" w="100%">
                        <Box position="absolute" left={3} top={3} color="gray.500">
                          <FiMail />
                        </Box>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          pl="10"
                          placeholder="you@example.com"
                        />
                      </Box>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Flex>
                      <Box position="relative" w="100%">
                        <Box position="absolute" left={3} top={3} color="gray.500">
                          <FiLock />
                        </Box>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          pl="10"
                          placeholder="••••••••"
                        />
                      </Box>
                    </Flex>
                  </FormControl>
                  <Button type="submit" colorScheme="blue" isLoading={loading}>
                    Sign in
                  </Button>
                </Stack>
              </form>
              
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
                  or continue with
                </Text>
                <Divider />
              </HStack>
              
              <Stack spacing="3">
                <Button 
                  leftIcon={<Icon as={FiGoogle} />} 
                  onClick={() => handleOAuthLogin('google')}
                  variant="outline"
                  colorScheme="red"
                  isLoading={loading}
                >
                  Google
                </Button>
                <Button 
                  leftIcon={<Icon as={FiGithub} />} 
                  onClick={() => handleOAuthLogin('github')}
                  variant="outline"
                  colorScheme="gray"
                  isLoading={loading}
                >
                  GitHub
                </Button>
                <Button 
                  leftIcon={<Icon as={FaMicrosoft} />} 
                  onClick={() => handleOAuthLogin('microsoft')}
                  variant="outline"
                  colorScheme="blue"
                  isLoading={loading}
                >
                  Microsoft
                </Button>
              </Stack>
            </Stack>
          </Box>
          <HStack spacing="1" justify="center">
            <Text>Don't have an account?</Text>
            <Link href="/signup" passHref>
              <ChakraLink color="blue.500">
                Sign up
              </ChakraLink>
            </Link>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;
