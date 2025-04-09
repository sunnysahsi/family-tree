
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import FamilyTreeCard from "@/components/trees/FamilyTreeCard";
import CreateTreeModal from "@/components/trees/CreateTreeModal";
import { FamilyTree } from "@/types/FamilyTree";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { familyTreeApi } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  // Fetch family trees with React Query
  const { data: trees = [], isLoading } = useQuery({
    queryKey: ['familyTrees'],
    queryFn: async () => {
      const response = await familyTreeApi.getTrees();
      if (response.status === 'error' || !response.data) {
        return [];
      }
      return response.data;
    },
    enabled: isAuthenticated,
  });

  // Create tree mutation
  const createTreeMutation = useMutation({
    mutationFn: (newTree: Omit<FamilyTree, 'id' | 'createdAt' | 'updatedAt'>) => 
      familyTreeApi.createTree(newTree),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyTrees'] });
      toast({
        title: "Family tree created!",
        description: "Your new family tree has been created successfully.",
      });
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create tree",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  // Delete tree mutation
  const deleteTreeMutation = useMutation({
    mutationFn: (id: string) => familyTreeApi.deleteTree(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['familyTrees'] });
      toast({
        title: "Family tree deleted",
        description: "Your family tree has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete tree",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleCreateTree = async (name: string, description: string, isPublic: boolean) => {
    createTreeMutation.mutate({
      name,
      description,
      isPublic,
      ownerId: "user1", // This would be the actual user ID in a real app
      members: [],
    });
  };

  const handleDeleteTree = async (id: string) => {
    deleteTreeMutation.mutate(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Family Trees</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-5 w-5 mr-2" />
          New Tree
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className="h-64 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : trees.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h2 className="text-xl font-medium mb-2">No family trees yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first family tree to get started
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create a family tree
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map((tree) => (
            <FamilyTreeCard
              key={tree.id}
              tree={tree}
              onDelete={handleDeleteTree}
            />
          ))}
        </div>
      )}

      <CreateTreeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTree}
      />
    </div>
  );
};

export default Dashboard;
