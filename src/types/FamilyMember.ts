
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
  photoAlbum?: string[];
  treeId: string;
}
