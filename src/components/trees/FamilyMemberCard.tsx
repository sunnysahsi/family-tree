
import { User, Mail, Phone, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FamilyMember } from "@/types/FamilyMember";
import { format } from "date-fns";

interface FamilyMemberCardProps {
  member: FamilyMember;
  onClick?: () => void;
  isSelected?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const FamilyMemberCard = ({ 
  member, 
  onClick,
  isSelected = false,
  onEdit,
  onDelete
}: FamilyMemberCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return null;
    }
  };

  const birthDate = formatDate(member.birthDate);
  const deathDate = formatDate(member.deathDate);

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {member.profilePhotoUrl ? (
            <img
              src={member.profilePhotoUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-lg">{member.name}</h3>
          <p className="text-sm text-muted-foreground bg-accent inline-block px-2 py-0.5 rounded-full">
            {member.relation}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {(birthDate || deathDate) && (
          <div className="flex items-center mt-2 text-sm">
            <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {birthDate && `Born: ${birthDate}`}
              {birthDate && deathDate && " • "}
              {deathDate && `Died: ${deathDate}`}
            </span>
          </div>
        )}
        
        {member.email && (
          <div className="flex items-center mt-2 text-sm">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{member.email}</span>
          </div>
        )}
        
        {member.phone && (
          <div className="flex items-center mt-2 text-sm">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{member.phone}</span>
          </div>
        )}
        
        {member.bio && (
          <div className="mt-4 pt-4 border-t text-sm">
            <p className="line-clamp-3">{member.bio}</p>
            {member.bio.length > 150 && (
              <Button variant="link" className="p-0 h-auto text-xs" onClick={(e) => {
                e.stopPropagation();
                // This is a placeholder. In a real app, you'd expand the bio text
              }}>
                Read more
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyMemberCard;
