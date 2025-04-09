
export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthDate?: string;
  deathDate?: string;
  email?: string;
  phone?: string;
  bio?: string;
  profilePhotoUrl?: string;
  treeId: string;
  memoryNotes?: string; // Personal memory notes only visible to the owner
}
