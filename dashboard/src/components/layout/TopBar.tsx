import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Badge,
  useColorMode,
  useColorModeValue,
  HStack,
  Text,
  Divider,
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiPlus, 
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiMoon,
  FiSun,
} from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '@/store';
import { toggleColorMode } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';

const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();
  const { notifications } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleToggleColorMode = () => {
    dispatch(toggleColorMode());
  };

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      right={0}
      left={{ base: 0, md: '72px' }}
      height="64px"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      zIndex={5}
      transition="left 0.2s ease"
      px={4}
    >
      <Flex h="100%" align="center" justify="space-between">
        <Flex flex={1} maxW="600px">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Search..." borderRadius="full" />
          </InputGroup>
        </Flex>

        <HStack spacing={3}>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="brand" 
            variant="solid" 
            size="sm" 
            borderRadius="full"
          >
            Create New
          </Button>

          <Divider orientation="vertical" h="24px" />

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Notifications"
              icon={
                <Box position="relative">
                  <FiBell />
                  {unreadNotifications > 0 && (
                    <Badge
                      colorScheme="red"
                      borderRadius="full"
                      position="absolute"
                      top="-2px"
                      right="-2px"
                      boxSize="14px"
                      fontSize="xs"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </Badge>
                  )}
                </Box>
              }
              variant="ghost"
              size="md"
            />
            <MenuList>
              {notifications.length > 0 ? (
                notifications.slice(0, 5).map((notification) => (
                  <MenuItem key={notification.id}>
                    <Box>
                      <Text fontSize="sm">{notification.message}</Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </Text>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem>No notifications</MenuItem>
              )}
              {notifications.length > 5 && (
                <MenuItem as={Button} variant="link" size="sm">
                  View all
                </MenuItem>
              )}
            </MenuList>
          </Menu>

          <IconButton
            aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
            variant="ghost"
            onClick={handleToggleColorMode}
          />

          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              rightIcon={<FiUser />}
              display="flex"
              alignItems="center"
            >
              <Avatar 
                size="sm" 
                name={user?.name || 'User'} 
                src={user?.avatar} 
                mr={2} 
              />
              <Text display={{ base: 'none', md: 'block' }}>{user?.name || 'User'}</Text>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FiUser />}>Profile</MenuItem>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem icon={<FiLogOut />} onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default TopBar;
