
import { useState } from 'react';
import { NextPageWithLayout } from '@/types/NextPageProps';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/router';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserProfileForm from '@/components/profile/UserProfileForm';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/services/api';

const EditProfilePage: NextPageWithLayout = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: (userData: any) => userApi.updateProfile(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully',
      });
      router.push('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (values: any) => {
    updateProfileMutation.mutate(values);
  };

  if (authLoading) {
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Your Profile</h1>
        <p className="text-muted-foreground">
          Update your personal information and memory reminder notes
        </p>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <UserProfileForm 
          user={user} 
          onSubmit={handleSubmit} 
          isLoading={updateProfileMutation.isPending} 
        />
      </div>
    </div>
  );
};

EditProfilePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default EditProfilePage;
