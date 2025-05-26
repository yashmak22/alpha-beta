import React, { ReactNode } from 'react';
import { Box, useColorModeValue, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { FiChevronRight } from 'react-icons/fi';

import { RootState } from '@/store';
import SideNav from './SideNav';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { sidenavOpen } = useSelector((state: RootState) => state.ui);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const router = useRouter();
  
  // Generate breadcrumbs based on the current path
  const generateBreadcrumbs = () => {
    const asPathWithoutQuery = router.asPath.split('?')[0];
    const asPathNestedRoutes = asPathWithoutQuery.split('/').filter(v => v.length > 0);
    
    // Don't show breadcrumbs on home page
    if (asPathNestedRoutes.length === 0) return null;
    
    const crumbList = asPathNestedRoutes.map((subpath, idx) => {
      const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');
      // Create a readable label by replacing hyphens with spaces and capitalizing
      const label = subpath
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
      
      // For nested routes where ID is part of path (e.g., /agents/123)
      // Try to make it more human-readable
      const readableLabel = !isNaN(Number(subpath)) && idx > 0 
        ? `${asPathNestedRoutes[idx-1].charAt(0).toUpperCase() + asPathNestedRoutes[idx-1].slice(0, -1)} ${subpath}` 
        : label;
        
      return { href, label: readableLabel };
    });
    
    return crumbList;
  };
  
  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />
      <SideNav />
      <Box
        as="main"
        ml={{ base: 0, md: sidenavOpen ? '240px' : '72px' }}
        pt="64px"
        transition="margin-left 0.2s ease"
        px={6}
        py={6}
      >
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Flex mb={6}>
            <Breadcrumb separator={<FiChevronRight color="gray.500" />} fontSize="sm">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              
              {breadcrumbs.map((crumb, idx) => (
                <BreadcrumbItem key={idx} isCurrentPage={idx === breadcrumbs.length - 1}>
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          </Flex>
        )}
        
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
