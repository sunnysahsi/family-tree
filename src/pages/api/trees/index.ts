
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
  res: NextApiResponse<ApiResponse<FamilyTree[] | FamilyTree>>
) {
  // GET request - retrieve all trees
  if (req.method === 'GET') {
    return res.status(200).json({
      data: mockTrees,
      status: 'success',
    });
  }
  
  // POST request - create a new tree
  if (req.method === 'POST') {
    try {
      const treeData = req.body;
      
      // Validate request
      if (!treeData.name || typeof treeData.isPublic !== 'boolean') {
        return res.status(400).json({
          error: 'Name and visibility are required',
          status: 'error',
        });
      }
      
      // Create new tree
      const newTree: FamilyTree = {
        id: `tree-${Date.now()}`,
        name: treeData.name,
        description: treeData.description,
        isPublic: treeData.isPublic,
        ownerId: treeData.ownerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: []
      };
      
      mockTrees.push(newTree);
      
      return res.status(201).json({
        data: newTree,
        status: 'success',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to create family tree',
        status: 'error',
      });
    }
  }
  
  // Method not allowed
  return res.status(405).json({
    error: 'Method not allowed',
    status: 'error',
  });
}
