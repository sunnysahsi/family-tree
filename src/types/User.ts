
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  reminderNotes?: string; // Personal memory notes for the user
}
