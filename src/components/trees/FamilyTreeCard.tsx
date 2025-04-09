
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lock, Globe, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FamilyTree } from "@/types/FamilyTree";

interface FamilyTreeCardProps {
  tree: FamilyTree;
  onDelete: (id: string) => void;
}

const FamilyTreeCard = ({ tree, onDelete }: FamilyTreeCardProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = () => {
    navigate(`/tree/${tree.id}`);
  };

  const handleEdit = () => {
    navigate(`/tree/${tree.id}/edit`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this family tree? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await onDelete(tree.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const membersCount = tree.members?.length || 0;

  return (
    <Card className="h-full flex flex-col animate-fade-in hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{tree.name}</CardTitle>
            <CardDescription>{tree.description || "No description"}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
          <Users className="h-4 w-4" />
          <span>{membersCount} {membersCount === 1 ? "member" : "members"}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
          {tree.isPublic ? (
            <>
              <Globe className="h-4 w-4" />
              <span>Public</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>Private</span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button onClick={handleView} className="w-full">View Tree</Button>
      </CardFooter>
    </Card>
  );
};

export default FamilyTreeCard;
