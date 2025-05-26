import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiX,
  FiSearch,
  FiBell,
  FiPlus,
  FiUser,
  FiSettings,
  FiLogOut,
  FiKey,
  FiChevronDown,
} from 'react-icons/fi';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call the API to search
    console.log('Searching for:', searchQuery);
    // For now, we'll just simulate search results
  };

  const notifications = [
    { id: 1, title: 'Training job completed', description: 'Customer Support model training is complete', time: '2 hours ago', isRead: false },
    { id: 2, title: 'New evaluation results', description: 'Sales Agent evaluation has finished', time: '5 hours ago', isRead: false },
    { id: 3, title: 'System update', description: 'Alpha Platform has been updated to v1.2.0', time: '1 day ago', isRead: true },
  ];

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        align={'center'}
        justifyContent="space-between"
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <FiX /> : <FiMenu />}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Text
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('gray.800', 'white')}
            fontWeight="bold"
          >
            Alpha Platform
          </Text>
        </Flex>

        <Stack
          flex={{ base: 1, md: 2 }}
          justify={'flex-end'}
          align={'center'}
          direction={'row'}
          spacing={6}
        >
          {/* Global Search */}
          <Box display={{ base: 'none', md: 'flex' }} flex={1} maxW="500px">
            <form onSubmit={handleSearch} style={{ width: '100%' }}>
              <InputGroup size="md">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agents, prompts, runs..."
                  rounded="md"
                />
              </InputGroup>
            </form>
          </Box>

          {/* Quick Actions Button */}
          <Popover placement="bottom-end">
            <PopoverTrigger>
              <Button
                as={Button}
                rounded={'md'}
                size="md"
                leftIcon={<FiPlus />}
                colorScheme="blue"
                display={{ base: 'none', md: 'inline-flex' }}
                rightIcon={<FiChevronDown />}
              >
                Create
              </Button>
            </PopoverTrigger>
            <PopoverContent p={2} width="200px">
              <Stack spacing={1}>
                <Button justifyContent="flex-start" variant="ghost" onClick={() => router.push('/agents/new')}>
                  New Agent
                </Button>
                <Button justifyContent="flex-start" variant="ghost" onClick={() => router.push('/prompts/new')}>
                  New Prompt
                </Button>
                <Button justifyContent="flex-start" variant="ghost" onClick={() => router.push('/evaluate')}>
                  New Evaluation
                </Button>
                <Button justifyContent="flex-start" variant="ghost" onClick={() => router.push('/train')}>
                  New Training Job
                </Button>
              </Stack>
            </PopoverContent>
          </Popover>

          {/* Notifications */}
          <Menu>
            <Tooltip label="Notifications">
              <MenuButton
                as={IconButton}
                aria-label={'Notifications'}
                icon={
                  <Box position="relative">
                    <FiBell />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <Badge 
                        position="absolute" 
                        top="-6px" 
                        right="-6px" 
                        colorScheme="red" 
                        borderRadius="full" 
                        size="xs"
                      >
                        {notifications.filter(n => !n.isRead).length}
                      </Badge>
                    )}
                  </Box>
                }
                variant={'ghost'}
                size="md"
              />
            </Tooltip>
            <MenuList zIndex={1000}>
              <Box px={4} py={2} fontWeight="bold">
                Notifications
              </Box>
              <MenuDivider />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem key={notification.id}>
                    <Box>
                      <Text fontWeight={notification.isRead ? 'normal' : 'bold'}>
                        {notification.title}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {notification.description}
                      </Text>
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        {notification.time}
                      </Text>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem>No notifications</MenuItem>
              )}
              <MenuDivider />
              <MenuItem justifyContent="center">
                <Text color="blue.500" fontSize="sm">
                  View All
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* User Menu */}
          <Menu>
            <MenuButton
              as={Button}
              rounded={'full'}
              variant={'link'}
              cursor={'pointer'}
              minW={0}
            >
              <HStack>
                <Avatar
                  size={'sm'}
                  src={user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                />
                <Box display={{ base: 'none', md: 'block' }}>
                  <Text fontWeight="medium" textAlign="left">{user?.name || 'User'}</Text>
                  <Text fontSize="xs" color="gray.500" textAlign="left">{user?.email || 'user@example.com'}</Text>
                </Box>
              </HStack>
            </MenuButton>
            <MenuList zIndex={1000}>
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiSettings />} onClick={() => router.push('/settings')}>
                Settings
              </MenuItem>
              <MenuItem icon={<FiKey />} onClick={() => router.push('/settings?tab=api-keys')}>
                API Keys
              </MenuItem>
              <MenuDivider />
              <MenuItem icon={<FiLogOut />} onClick={logout}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      <Box mb={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Search..." />
        </InputGroup>
      </Box>
      
      <Stack spacing={2}>
        <MobileNavItem label="Dashboard" href="/" />
        <MobileNavItem label="Agents" href="/agents" />
        <MobileNavItem label="Prompts" href="/prompts" />
        <MobileNavItem label="Memory & Tools" href="/memory-tools" />
        <MobileNavItem label="Evaluate" href="/evaluate" />
        <MobileNavItem label="Train" href="/train" />
        <MobileNavItem label="Models" href="/models" />
        <MobileNavItem label="Settings" href="/settings" />
      </Stack>
    </Stack>
  );
};

interface MobileNavItemProps {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
}

const MobileNavItem = ({ label, children, href }: MobileNavItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const isActive = router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as={Link}
        href={href}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}
        fontWeight={isActive ? 'semibold' : 'normal'}
        color={isActive ? 'blue.500' : useColorModeValue('gray.600', 'gray.200')}
      >
        <Text>{label}</Text>
        {children && (
          <Icon
            as={FiChevronDown}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Box as={Link} key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
