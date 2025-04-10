
import mongoose, { Document } from 'mongoose';

export interface IFamilyTree extends Document {
  name: string;
  description?: string;
  isPublic: boolean;
  ownerId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  members?: mongoose.Schema.Types.ObjectId[];
  memoryNotes?: string;
}

const treeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  description: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember'
  }],
  memoryNotes: {
    type: String
  }
}, {
  timestamps: true
});

export const FamilyTree = mongoose.model<IFamilyTree>('FamilyTree', treeSchema);
