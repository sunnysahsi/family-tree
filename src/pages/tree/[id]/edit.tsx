
import { useState } from 'react';
import { NextPageWithLayout } from '@/types/NextPageProps';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditTreeForm from '@/components/trees/EditTreeForm';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { familyTreeApi } from '@/services/api';

const EditTreePage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tree data
  const { data: tree, isLoading } = useQuery({
    queryKey: ['familyTree', id],
    queryFn: async () => {
      if (typeof id !== 'string') return null;
      const response = await familyTreeApi.getTreeById(id);
      if (response.status === 'error' || !response.data) {
        toast({
          title: 'Error',
          description: response.error || 'Failed to load family tree',
          variant: 'destructive',
        });
        return null;
      }
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });

  // Update tree mutation
  const updateTreeMutation = useMutation({
    mutationFn: (treeData: any) => 
      familyTreeApi.updateTree(id as string, treeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyTree', id] });
      queryClient.invalidateQueries({ queryKey: ['familyTrees'] });
      toast({
        title: 'Tree updated',
        description: 'Family tree has been updated successfully',
      });
      router.push(`/tree/${id}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update family tree',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (values: any) => {
    updateTreeMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/3 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-xl font-medium mb-2">Family tree not found</h2>
          <p className="text-muted-foreground mb-6">
            The family tree you're looking for doesn't exist or you don't have permission to edit it.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Family Tree</h1>
        <p className="text-muted-foreground">
          Update your family tree information and memory reminder notes
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <EditTreeForm 
          tree={tree} 
          onSubmit={handleSubmit} 
          isLoading={updateTreeMutation.isPending} 
        />
      </div>
    </div>
  );
};

EditTreePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default EditTreePage;
