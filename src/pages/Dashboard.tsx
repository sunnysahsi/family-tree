
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import FamilyTreeCard from "@/components/trees/FamilyTreeCard";
import CreateTreeModal from "@/components/trees/CreateTreeModal";
import { FamilyTree } from "@/types/FamilyTree";

const Dashboard = () => {
  const [trees, setTrees] = useState<FamilyTree[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Simulate fetching family trees
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchTrees = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockTrees: FamilyTree[] = [
        {
          id: "1",
          name: "Smith Family",
          description: "My paternal family tree going back three generations",
          isPublic: false,
          ownerId: "user1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          members: ["1", "2", "3"]
        },
        {
          id: "2",
          name: "Johnson Family",
          description: "My maternal family connections",
          isPublic: true,
          ownerId: "user1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          members: ["4", "5", "6", "7"]
        }
      ];
      
      setTrees(mockTrees);
      setIsLoading(false);
    };

    fetchTrees();
  }, []);

  const handleCreateTree = async (name: string, description: string, isPublic: boolean) => {
    // In a real app, this would be an API call
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a new tree with mock data
    const newTree: FamilyTree = {
      id: `tree-${Date.now()}`,
      name,
      description,
      isPublic,
      ownerId: "user1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: []
    };
    
    setTrees(prevTrees => [...prevTrees, newTree]);
    
    toast({
      title: "Family tree created!",
      description: "Your new family tree has been created successfully.",
    });
  };

  const handleDeleteTree = async (id: string) => {
    // In a real app, this would be an API call
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setTrees(prevTrees => prevTrees.filter(tree => tree.id !== id));
    
    toast({
      title: "Family tree deleted",
      description: "Your family tree has been deleted successfully.",
    });
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
