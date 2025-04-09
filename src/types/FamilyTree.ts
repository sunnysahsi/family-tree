
export interface FamilyTree {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members?: string[]; // Member IDs
}
