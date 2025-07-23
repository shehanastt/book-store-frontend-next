'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { useEffect, useState } from 'react';

const HeaderWrapper = () => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

   useEffect(() => {
    setMounted(true);
  }, []);

   if (!mounted) return null;

  const hiddenRoutes = ['/login', '/registration'];
  if (hiddenRoutes.includes(pathname)) return null;

  return <Header />;
};

export default HeaderWrapper;
