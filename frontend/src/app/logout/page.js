'use client';
import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

function Page() {
  const { logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Clear local storage and context
    localStorage.removeItem('token');
    logout();
    
    // Redirect to home page
    router.push('/');
  }, [logout, router]);

  return null;
}

export default Page;