
import { NextPageWithLayout } from '@/types/NextPageProps';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import LandingContent from '@/components/landing/LandingContent';
import Layout from '@/components/layout/Layout';

const Home: NextPageWithLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return <LandingContent />;
};

Home.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default Home;
