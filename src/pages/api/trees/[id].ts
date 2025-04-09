
import type { NextApiRequest, NextApiResponse } from 'next';
import { FamilyTree } from '@/types/FamilyTree';
import { ApiResponse } from '@/types/ApiResponse';

// Mock data - in a real app, this would be replaced by a database
let mockTrees: FamilyTree[] = [
  {
    id: "1",
    name: "Smith Family",
    description: "My paternal family tree going back three generations",
    isPublic: false,
    ownerId: "user1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: ["1", "2", "3"]
  },
  {
    id: "2",
    name: "Johnson Family",
    description: "My maternal family connections",
    isPublic: true,
    ownerId: "user1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: ["4", "5", "6", "7"]
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<FamilyTree | null>>
) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({
      error: 'Invalid ID',
      status: 'error',
    });
  }
  
  const treeIndex = mockTrees.findIndex(tree => tree.id === id);
  
  // Tree not found
  if (treeIndex === -1) {
    return res.status(404).json({
      error: 'Family tree not found',
      status: 'error',
    });
  }
  
  // GET request - retrieve a tree
  if (req.method === 'GET') {
    return res.status(200).json({
      data: mockTrees[treeIndex],
      status: 'success',
    });
  }
  
  // PATCH request - update a tree
  if (req.method === 'PATCH') {
    try {
      const updateData = req.body;
      
      // Update the tree
      mockTrees[treeIndex] = {
        ...mockTrees[treeIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      
      return res.status(200).json({
        data: mockTrees[treeIndex],
        status: 'success',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to update family tree',
        status: 'error',
      });
    }
  }
  
  // DELETE request - delete a tree
  if (req.method === 'DELETE') {
    mockTrees = mockTrees.filter(tree => tree.id !== id);
    
    return res.status(200).json({
      data: null,
      status: 'success',
    });
  }
  
  // Method not allowed
  return res.status(405).json({
    error: 'Method not allowed',
    status: 'error',
  });
}
