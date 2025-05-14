
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useQuizStore } from '@/lib/store';

const Index = () => {
  const loadRounds = useQuizStore(state => state.loadRounds);
  
  useEffect(() => {
    loadRounds();
  }, [loadRounds]);
  
  return <Layout />;
};

export default Index;
