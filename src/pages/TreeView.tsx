
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Users,
  Share2,
  Globe,
  Lock,
  UserPlus,
  Trash,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import TreeVisualization from "@/components/trees/TreeVisualization";
import FamilyMemberForm from "@/components/trees/FamilyMemberForm";
import FamilyMemberCard from "@/components/trees/FamilyMemberCard";
import { FamilyTree } from "@/types/FamilyTree";
import { FamilyMember } from "@/types/FamilyMember";

const TreeView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tree, setTree] = useState<FamilyTree | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // Fetch tree data
  useEffect(() => {
    const fetchTreeData = async () => {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock tree data
      const mockTree: FamilyTree = {
        id: id || "1",
        name: "Smith Family",
        description: "My paternal family tree going back three generations",
        isPublic: false,
        ownerId: "user1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Mock members data
      const mockMembers: FamilyMember[] = [
        {
          id: "1",
          name: "John Smith",
          relation: "Father",
          birthDate: "1970-05-15",
          email: "john@example.com",
          phone: "+1234567890",
          bio: "Born in New York, worked as an engineer for 30 years.",
          treeId: id || "1",
        },
        {
          id: "2",
          name: "Mary Smith",
          relation: "Mother",
          birthDate: "1972-08-22",
          email: "mary@example.com",
          bio: "Grew up in Chicago, loves gardening and cooking.",
          treeId: id || "1",
        },
        {
          id: "3",
          name: "James Smith",
          relation: "Son",
          birthDate: "1995-11-10",
          email: "james@example.com",
          treeId: id || "1",
        },
        {
          id: "4",
          name: "Emma Smith",
          relation: "Daughter",
          birthDate: "1998-02-28",
          treeId: id || "1",
        },
      ];
      
      setTree(mockTree);
      setMembers(mockMembers);
      setIsLoading(false);
    };

    fetchTreeData();
  }, [id]);

  const handleAddMember = async (memberData: Partial<FamilyMember>) => {
    // In a real app, this would be an API call
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a new member with mock data
    const newMember: FamilyMember = {
      id: `member-${Date.now()}`,
      name: memberData.name || "",
      relation: memberData.relation || "",
      birthDate: memberData.birthDate,
      deathDate: memberData.deathDate,
      email: memberData.email,
      phone: memberData.phone,
      bio: memberData.bio,
      profilePhotoUrl: memberData.profilePhotoUrl,
      treeId: id || "1",
    };
    
    setMembers(prevMembers => [...prevMembers, newMember]);
    
    toast({
      title: "Family member added!",
      description: `${newMember.name} has been added to your family tree.`,
    });
    
    setIsAddMemberOpen(false);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (confirm("Are you sure you want to delete this family member? This action cannot be undone.")) {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
      
      if (selectedMember?.id === memberId) {
        setSelectedMember(null);
      }
      
      toast({
        title: "Family member deleted",
        description: "The family member has been removed from your tree.",
      });
    }
  };

  const handleSelectMember = (member: FamilyMember) => {
    setSelectedMember(member);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="h-[600px] rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h2 className="text-xl font-medium mb-2">Family tree not found</h2>
          <p className="text-muted-foreground mb-6">
            The family tree you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            Return to Dashboard
          </Button>
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
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
            <h1 className="text-xl font-bold">{tree.name}</h1>
            <div className="ml-2 inline-flex items-center">
              {tree.isPublic ? (
                <div className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full flex items-center">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </div>
              ) : (
                <div className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </div>
              )}
            </div>
          </div>
          {tree.description && (
            <p className="text-muted-foreground">{tree.description}</p>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsAddMemberOpen(true)}>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TreeVisualization 
            members={members} 
            onAddMember={() => setIsAddMemberOpen(true)}
            onSelectMember={handleSelectMember}
          />
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <Tabs defaultValue="members">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="members">
                  <Users className="h-4 w-4 mr-2" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="details">
                  <Users className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="members" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Family Members ({members.length})</h3>
                  <Button size="sm" variant="ghost" onClick={() => setIsAddMemberOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {members.map((member) => (
                    <FamilyMemberCard
                      key={member.id}
                      member={member}
                      onClick={() => handleSelectMember(member)}
                      isSelected={selectedMember?.id === member.id}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Created</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tree.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Last Updated</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tree.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Button variant="outline" size="sm" className="text-destructive border-destructive" onClick={() => {
                      // Handle delete tree
                      if (confirm("Are you sure you want to delete this family tree? This action cannot be undone.")) {
                        // In a real app, this would be an API call
                        toast({
                          title: "Family tree deleted",
                          description: "Your family tree has been deleted successfully.",
                        });
                        navigate("/dashboard");
                      }
                    }}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Tree
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Selected Member Details Sheet */}
      {selectedMember && (
        <Sheet 
          open={!!selectedMember}
          onOpenChange={(open) => {
            if (!open) setSelectedMember(null);
          }}
        >
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Member Details</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-muted mr-4 flex-shrink-0">
                  {selectedMember.profilePhotoUrl ? (
                    <img
                      src={selectedMember.profilePhotoUrl}
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedMember.name}</h2>
                  <div className="text-sm text-muted-foreground bg-accent inline-block px-2 py-0.5 rounded-full">
                    {selectedMember.relation}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                {selectedMember.birthDate && (
                  <div>
                    <h3 className="text-sm font-medium">Birth Date</h3>
                    <p>{new Date(selectedMember.birthDate).toLocaleDateString()}</p>
                  </div>
                )}
                
                {selectedMember.deathDate && (
                  <div>
                    <h3 className="text-sm font-medium">Death Date</h3>
                    <p>{new Date(selectedMember.deathDate).toLocaleDateString()}</p>
                  </div>
                )}
                
                {selectedMember.email && (
                  <div>
                    <h3 className="text-sm font-medium">Email</h3>
                    <p>{selectedMember.email}</p>
                  </div>
                )}
                
                {selectedMember.phone && (
                  <div>
                    <h3 className="text-sm font-medium">Phone</h3>
                    <p>{selectedMember.phone}</p>
                  </div>
                )}
              </div>
              
              {selectedMember.bio && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium mb-2">Biography</h3>
                    <p className="text-sm whitespace-pre-line">{selectedMember.bio}</p>
                  </div>
                </>
              )}
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" size="sm" onClick={() => {
                  // In a real app, you would open an edit form
                  toast({
                    title: "Edit member",
                    description: "Editing functionality would be implemented in a real app.",
                  });
                }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive border-destructive"
                  onClick={() => handleDeleteMember(selectedMember.id)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Add Member Sheet */}
      <Sheet
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
      >
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Add Family Member</SheetTitle>
          </SheetHeader>
          
          <FamilyMemberForm onSubmit={handleAddMember} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TreeView;
