import React, { useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardHeader,
  CardBody,
  Text,
  Flex,
  Icon,
  Button,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
  FiUsers, 
  FiFileText, 
  FiActivity, 
  FiCpu, 
  FiArrowRight 
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import Layout from '@/components/layout/Layout';
import { setActivePanel } from '@/store/slices/uiSlice';

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cardBg = useColorModeValue('white', 'gray.800');
  const accentColor = useColorModeValue('brand.500', 'brand.300');

  useEffect(() => {
    // Check if API keys are set, if not redirect to onboarding
    const apiKeys = localStorage.getItem('alpha_api_keys');
    if (!apiKeys) {
      router.push('/onboarding');
    }
    dispatch(setActivePanel('dashboard'));
  }, [dispatch]);

  const stats = [
    { label: 'Active Agents', value: 12, icon: FiUsers, helpText: '+3 from last week', link: '/agents' },
    { label: 'Prompts', value: 45, icon: FiFileText, helpText: '8 recently updated', link: '/prompts' },
    { label: 'Agent Interactions', value: '2.4k', icon: FiActivity, helpText: '+18% this month', link: '/evaluate' },
    { label: 'Model Usage', value: '560k', icon: FiCpu, helpText: 'tokens consumed today', link: '/models' },
  ];

  const recentActivity = [
    { id: 1, type: 'agent', name: 'Customer Support Bot', action: 'deployed', time: '2 hours ago' },
    { id: 2, type: 'prompt', name: 'Enhanced RAG Template', action: 'created', time: '5 hours ago' },
    { id: 3, type: 'evaluation', name: 'Product Q&A Dataset', action: 'completed', time: '1 day ago' },
    { id: 4, type: 'model', name: 'GPT-4 Endpoint', action: 'updated', time: '2 days ago' },
  ];

  return (
    <Layout>
      <Box maxW="1600px" mx="auto">
        <Heading as="h1" size="xl" mb={8}>
          Dashboard
        </Heading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={10}>
          {stats.map((stat, index) => (
            <Card key={index} bg={cardBg} boxShadow="md" borderRadius="lg">
              <CardBody>
                <Flex justify="space-between" align="center">
                  <Stat>
                    <StatLabel fontSize="sm">{stat.label}</StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="bold" color={accentColor}>
                      {stat.value}
                    </StatNumber>
                    <StatHelpText fontSize="xs">{stat.helpText}</StatHelpText>
                  </Stat>
                  <Box
                    p={3}
                    borderRadius="full"
                    bg={useColorModeValue('brand.50', 'rgba(0, 128, 255, 0.15)')}
                  >
                    <Icon as={stat.icon} boxSize={5} color={accentColor} />
                  </Box>
                </Flex>
                <Button
                  size="sm"
                  variant="ghost"
                  rightIcon={<FiArrowRight />}
                  mt={3}
                  colorScheme="brand"
                  onClick={() => dispatch(setActivePanel(stat.link.substring(1)))}
                >
                  View Details
                </Button>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
          <Card bg={cardBg} boxShadow="md" borderRadius="lg">
            <CardHeader pb={0}>
              <Heading size="md">Recent Activity</Heading>
            </CardHeader>
            <CardBody>
              {recentActivity.map((activity) => (
                <Box
                  key={activity.id}
                  py={3}
                  borderBottom="1px"
                  borderColor={useColorModeValue('gray.100', 'gray.700')}
                  _last={{ borderBottom: 'none' }}
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="medium">{activity.name}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} {activity.action}
                      </Text>
                    </Box>
                    <Text fontSize="sm" color="gray.500">
                      {activity.time}
                    </Text>
                  </Flex>
                </Box>
              ))}
              <Button
                size="sm"
                variant="ghost"
                rightIcon={<FiArrowRight />}
                mt={4}
                colorScheme="brand"
              >
                View All Activity
              </Button>
            </CardBody>
          </Card>

          <Card bg={cardBg} boxShadow="md" borderRadius="lg">
            <CardHeader pb={0}>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={2} spacing={4}>
                <Button
                  leftIcon={<FiUsers />}
                  colorScheme="brand"
                  onClick={() => {
                    dispatch(setActivePanel('agents'));
                    window.location.href = '/agents/new';
                  }}
                >
                  Create Agent
                </Button>
                <Button
                  leftIcon={<FiFileText />}
                  colorScheme="brand"
                  variant="outline"
                  onClick={() => {
                    dispatch(setActivePanel('prompts'));
                    window.location.href = '/prompts/new';
                  }}
                >
                  New Prompt
                </Button>
                <Button
                  leftIcon={<FiActivity />}
                  colorScheme="brand"
                  variant="outline"
                  onClick={() => {
                    dispatch(setActivePanel('evaluate'));
                    window.location.href = '/evaluate';
                  }}
                >
                  Run Evaluation
                </Button>
                <Button
                  leftIcon={<FiCpu />}
                  colorScheme="brand"
                  variant="outline"
                  onClick={() => {
                    dispatch(setActivePanel('models'));
                    window.location.href = '/models';
                  }}
                >
                  Add Model
                </Button>
              </SimpleGrid>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </Layout>
  );
};

export default Home;
