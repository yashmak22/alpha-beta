import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  IconButton,
  useColorModeValue,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { 
  FiHome, 
  FiUsers, 
  FiFileText, 
  FiDatabase, 
  FiTool, 
  FiCheckSquare, 
  FiPackage, 
  FiServer,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { RootState } from '@/store';
import { setSidenavOpen, setActivePanel } from '@/store/slices/uiSlice';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  href, 
  isActive, 
  isCollapsed,
  onClick 
}) => {
  const activeBg = useColorModeValue('brand.50', 'rgba(0, 128, 255, 0.15)');
  const activeColor = useColorModeValue('brand.600', 'brand.300');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const router = useRouter();

  // Custom click handler that navigates programmatically
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
    router.push(href);
  };

  return (
    <Tooltip label={isCollapsed ? label : ''} placement="right" isDisabled={!isCollapsed}>
      <Box
        display="flex"
        alignItems="center"
        py={3}
        px={4}
        borderRadius="md"
        cursor="pointer"
        onClick={handleClick}
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : undefined}
        _hover={{ bg: isActive ? activeBg : hoverBg }}
        transition="all 0.2s"
        w="100%"
      >
        <Icon as={icon} fontSize="xl" />
        {!isCollapsed && (
          <Text ml={4} fontWeight={isActive ? 'medium' : 'normal'}>
            {label}
          </Text>
        )}
      </Box>
    </Tooltip>
  );
};

const SideNav: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { sidenavOpen, activePanel } = useSelector((state: RootState) => state.ui);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const navItems = [
    { icon: FiHome, label: 'Dashboard', href: '/', id: 'dashboard' },
    { icon: FiUsers, label: 'Agents', href: '/agents', id: 'agents' },
    { icon: FiFileText, label: 'Prompts', href: '/prompts', id: 'prompts' },
    { icon: FiDatabase, label: 'Memory & Tools', href: '/memory-tools', id: 'memory-tools' },
    { icon: FiCheckSquare, label: 'Evaluate', href: '/evaluate', id: 'evaluate' },
    { icon: FiPackage, label: 'Train', href: '/train', id: 'train' },
    { icon: FiServer, label: 'Models', href: '/models', id: 'models' },
  ];

  const handleToggleSidenav = () => {
    dispatch(setSidenavOpen(!sidenavOpen));
  };

  const handleNavItemClick = (id: string) => {
    dispatch(setActivePanel(id));
  };

  return (
    <Box
      position="fixed"
      left={0}
      top={0}
      bottom={0}
      w={sidenavOpen ? '240px' : '72px'}
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      transition="width 0.2s ease"
      zIndex={10}
    >
      <Flex direction="column" h="100%" p={4}>
        <Flex align="center" mb={6} justify={sidenavOpen ? 'space-between' : 'center'}>
          {sidenavOpen && <Text fontSize="xl" fontWeight="bold">Alpha</Text>}
          <IconButton
            aria-label="Toggle sidebar"
            icon={sidenavOpen ? <FiChevronLeft /> : <FiChevronRight />}
            onClick={handleToggleSidenav}
            size="sm"
            variant="ghost"
          />
        </Flex>
        
        <VStack spacing={1} align="stretch" flex={1}>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={activePanel === item.id}
              isCollapsed={!sidenavOpen}
              onClick={() => handleNavItemClick(item.id)}
            />
          ))}
        </VStack>
        
        <Divider my={4} />
        
        <Box>
          <NavItem
            icon={FiTool}
            label="Settings"
            href="/settings"
            isActive={activePanel === 'settings'}
            isCollapsed={!sidenavOpen}
            onClick={() => handleNavItemClick('settings')}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default SideNav;
