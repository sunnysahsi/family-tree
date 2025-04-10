
import mongoose, { Document } from 'mongoose';

export interface IFamilyMember extends Document {
  name: string;
  relation: string;
  birthDate?: string;
  deathDate?: string;
  email?: string;
  phone?: string;
  bio?: string;
  profilePhotoUrl?: string;
  treeId: mongoose.Schema.Types.ObjectId;
  memoryNotes?: string;
}

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  relation: {
    type: String,
    required: [true, 'Please specify the relation']
  },
  birthDate: {
    type: String
  },
  deathDate: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  bio: {
    type: String
  },
  profilePhotoUrl: {
    type: String
  },
  treeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyTree',
    required: true
  },
  memoryNotes: {
    type: String
  }
}, {
  timestamps: true
});

export const FamilyMember = mongoose.model<IFamilyMember>('FamilyMember', memberSchema);
