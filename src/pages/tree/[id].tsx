
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { NextPageWithLayout } from '@/types/NextPageProps';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { familyTreeApi, familyMemberApi } from '@/services/api';
import { FamilyMember } from '@/types/FamilyMember';
import TreeVisualization from '@/components/trees/TreeVisualization';
import FamilyMemberForm from '@/components/trees/FamilyMemberForm';
import FamilyMemberCard from '@/components/trees/FamilyMemberCard';

const TreeView: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  // Get tree data
  const { data: tree, isLoading: isTreeLoading } = useQuery({
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
    enabled: !!id,
  });

  // Get tree members
  const { data: members = [], isLoading: isMembersLoading } = useQuery({
    queryKey: ['treeMembers', id],
    queryFn: async () => {
      if (typeof id !== 'string') return [];
      const response = await familyMemberApi.getMembersByTreeId(id);
      if (response.status === 'error' || !response.data) {
        return [];
      }
      return response.data;
    },
    enabled: !!id,
  });

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: (newMember: Omit<FamilyMember, 'id'>) =>
      familyMemberApi.createMember(newMember),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treeMembers', id] });
      setIsFormOpen(false);
      setSelectedMember(null);
      toast({
        title: 'Success',
        description: 'Family member added successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add family member',
        variant: 'destructive',
      });
    },
  });

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: ({ id, member }: { id: string; member: Partial<FamilyMember> }) =>
      familyMemberApi.updateMember(id, member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treeMembers', id] });
      setIsFormOpen(false);
      setSelectedMember(null);
      toast({
        title: 'Success',
        description: 'Family member updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update family member',
        variant: 'destructive',
      });
    },
  });

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: (memberId: string) => familyMemberApi.deleteMember(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treeMembers', id] });
      setSelectedMember(null);
      toast({
        title: 'Success',
        description: 'Family member removed successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove family member',
        variant: 'destructive',
      });
    },
  });

  const handleAddMember = () => {
    setSelectedMember(null);
    setIsFormOpen(true);
  };

  const handleEditMember = (member: FamilyMember) => {
    setSelectedMember(member);
    setIsFormOpen(true);
  };

  const handleDeleteMember = (memberId: string) => {
    deleteMemberMutation.mutate(memberId);
  };

  const handleFormSubmit = (memberData: Omit<FamilyMember, 'id'>) => {
    if (selectedMember) {
      updateMemberMutation.mutate({
        id: selectedMember.id,
        member: memberData,
      });
    } else if (typeof id === 'string') {
      addMemberMutation.mutate({
        ...memberData,
        treeId: id,
      });
    }
  };

  const isLoading = isTreeLoading || isMembersLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-[500px]">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading family tree...</p>
        </div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h2 className="text-xl font-medium mb-2">Family tree not found</h2>
          <p className="text-muted-foreground mb-6">
            The requested family tree could not be found or you do not have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">{tree.name}</h1>
      {tree.description && (
        <p className="text-muted-foreground mb-6">{tree.description}</p>
      )}

      {/* Tree visualization */}
      <div className="mb-8">
        <TreeVisualization
          members={members}
          onAddMember={handleAddMember}
          onSelectMember={setSelectedMember}
        />
      </div>

      {/* Family member form */}
      <FamilyMemberForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedMember(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedMember}
      />

      {/* Selected member details */}
      {selectedMember && !isFormOpen && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Selected Family Member</h2>
          <FamilyMemberCard
            member={selectedMember}
            onEdit={() => handleEditMember(selectedMember)}
            onDelete={() => handleDeleteMember(selectedMember.id)}
          />
        </div>
      )}
    </div>
  );
};

TreeView.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default TreeView;
