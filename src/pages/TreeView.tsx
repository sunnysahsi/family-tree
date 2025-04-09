
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, Users, Share2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { familyTreeApi, familyMemberApi } from '@/services/api';
import { FamilyMember } from '@/types/FamilyMember';
import TreeVisualization from '@/components/trees/TreeVisualization';
import FamilyMemberForm from '@/components/trees/FamilyMemberForm';
import FamilyMemberCard from '@/components/trees/FamilyMemberCard';
import EditTreeForm from '@/components/trees/EditTreeForm';

interface TreeViewProps {
  isEditMode?: boolean;
}

const TreeView = ({ isEditMode = false }: TreeViewProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const { data: tree, isLoading: isTreeLoading } = useQuery({
    queryKey: ['familyTree', id],
    queryFn: async () => {
      if (!id) return null;
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

  const { data: members = [], isLoading: isMembersLoading } = useQuery({
    queryKey: ['treeMembers', id],
    queryFn: async () => {
      if (!id) return [];
      const response = await familyMemberApi.getMembersByTreeId(id);
      if (response.status === 'error' || !response.data) {
        return [];
      }
      return response.data;
    },
    enabled: !!id,
  });

  const updateTreeMutation = useMutation({
    mutationFn: (treeData: any) => 
      familyTreeApi.updateTree(id || '', treeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyTree', id] });
      queryClient.invalidateQueries({ queryKey: ['familyTrees'] });
      toast({
        title: 'Tree updated',
        description: 'Family tree has been updated successfully',
      });
      navigate(`/tree/${id}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update family tree',
        variant: 'destructive',
      });
    },
  });

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

  const handleTreeUpdate = async (values: any) => {
    await updateTreeMutation.mutateAsync(values);
  };

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

  const handleFormSubmit = async (memberData: Partial<FamilyMember>) => {
    if (selectedMember) {
      await updateMemberMutation.mutateAsync({
        id: selectedMember.id,
        member: memberData,
      });
    } else if (id) {
      await addMemberMutation.mutateAsync({
        ...memberData as Omit<FamilyMember, 'id'>,
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

  if (isEditMode) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
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
            onSubmit={handleTreeUpdate} 
            isLoading={updateTreeMutation.isPending} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="sm" className="p-0 h-auto mr-2" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <h1 className="text-xl font-bold ml-2">{tree?.name}</h1>
          </div>
          {tree?.description && (
            <p className="text-muted-foreground">{tree.description}</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={handleAddMember}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
          <Button size="sm" variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate(`/tree/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Tree
          </Button>
        </div>
      </div>
      
      {tree?.memoryNotes && (
        <div className="mb-6 p-4 bg-secondary/20 rounded-md">
          <h3 className="text-sm font-semibold mb-1">Your Memory Notes</h3>
          <p className="text-sm text-muted-foreground">{tree.memoryNotes}</p>
        </div>
      )}

      <div className="mb-8">
        <TreeVisualization
          members={members || []}
          onAddMember={handleAddMember}
          onSelectMember={setSelectedMember}
        />
      </div>

      {/* Modified to remove isOpen prop since the component doesn't expect it */}
      {isFormOpen && (
        <FamilyMemberForm
          initialData={selectedMember}
          onSubmit={handleFormSubmit}
        />
      )}

      {selectedMember && !isFormOpen && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Selected Family Member</h2>
            <Button variant="outline" size="sm" onClick={() => handleEditMember(selectedMember)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Member
            </Button>
          </div>
          <FamilyMemberCard
            member={selectedMember}
            onDelete={() => handleDeleteMember(selectedMember.id)}
          />
          
          {selectedMember.memoryNotes && (
            <div className="mt-4 p-4 bg-secondary/20 rounded-md">
              <h3 className="text-sm font-semibold mb-1">Your Memory Notes</h3>
              <p className="text-sm text-muted-foreground">{selectedMember.memoryNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TreeView;
