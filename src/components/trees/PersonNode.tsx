
import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';
import { FamilyMember } from '@/types/FamilyMember';

interface PersonNodeProps {
  data: FamilyMember;
  selected: boolean;
}

const getNodeColorClass = (relation: string) => {
  switch (relation) {
    case 'Father':
    case 'Mother':
      return 'bg-garbh-green/20 border-garbh-green';
    case 'Son':
    case 'Daughter':
      return 'bg-garbh-peach/20 border-garbh-peach';
    case 'Spouse':
      return 'bg-garbh-pink/20 border-garbh-pink';
    default:
      return 'bg-garbh-purple/20 border-garbh-purple';
  }
};

const getEmojiForRelation = (relation: string) => {
  switch (relation) {
    case 'Father':
      return '👨';
    case 'Mother':
      return '👩';
    case 'Son':
      return '👦';
    case 'Daughter':
      return '👧';
    case 'Brother':
      return '👦';
    case 'Sister':
      return '👧';
    case 'Spouse':
      return '💑';
    case 'Grandparent':
      return '👴';
    case 'Grandchild':
      return '👶';
    case 'Aunt':
      return '👩';
    case 'Uncle':
      return '👨';
    case 'Cousin':
      return '👤';
    default:
      return '👤';
  }
};

const PersonNode = ({ data, selected }: PersonNodeProps) => {
  const colorClass = getNodeColorClass(data.relation);
  const emoji = getEmojiForRelation(data.relation);
  
  return (
    <div className={`px-4 py-2 shadow-md rounded-xl min-w-[150px] ${colorClass} ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-10 h-2 !bg-garbh-blue" />
      
      <div className="flex flex-col items-center">
        <div className="rounded-full w-12 h-12 flex items-center justify-center overflow-hidden border-2 border-current mb-2">
          {data.profilePhotoUrl ? (
            <img 
              src={data.profilePhotoUrl} 
              alt={data.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <User className="h-6 w-6" />
          )}
        </div>
        
        <div className="text-center">
          <div className="text-sm font-medium">{data.name}</div>
          <div className="flex items-center justify-center text-xs space-x-1 text-muted-foreground">
            <span>{emoji}</span>
            <span>{data.relation}</span>
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-10 h-2 !bg-garbh-blue" />
    </div>
  );
};

export default memo(PersonNode);
