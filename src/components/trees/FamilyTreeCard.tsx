
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Lock, Globe, MoreVertical, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FamilyTree } from "@/types/FamilyTree";
import { useRouter } from "next/router";

interface FamilyTreeCardProps {
  tree: FamilyTree;
  onDelete: (id: string) => void;
}

const FamilyTreeCard = ({ tree, onDelete }: FamilyTreeCardProps) => {
  const router = useRouter();
  
  const handleView = () => {
    router.push(`/tree/${tree.id}`);
  };

  const handleEdit = () => {
    router.push(`/tree/${tree.id}/edit`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this family tree? This action cannot be undone.")) {
      await onDelete(tree.id);
    }
  };

  const membersCount = tree.members?.length || 0;

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
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
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash className="h-4 w-4 mr-2" />
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
        {tree.memoryNotes && (
          <div className="mt-3 p-2 bg-secondary/20 rounded-md text-xs text-muted-foreground">
            <strong>Memory Notes:</strong> {tree.memoryNotes.substring(0, 60)}
            {tree.memoryNotes.length > 60 ? "..." : ""}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4 flex gap-2">
        <Button onClick={handleView} className="flex-1">View</Button>
        <Button onClick={handleEdit} variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FamilyTreeCard;
