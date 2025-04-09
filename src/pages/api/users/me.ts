
import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '@/types/User';
import { ApiResponse } from '@/types/ApiResponse';

// Mock data - in a real app, this would be replaced by a database
let mockUser: User = {
  id: "user1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=JD",
  bio: "Family history enthusiast and genealogy researcher.",
  createdAt: new Date().toISOString(),
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User | null>>
) {
  // GET request - retrieve current user
  if (req.method === 'GET') {
    return res.status(200).json({
      data: mockUser,
      status: 'success',
    });
  }
  
  // PATCH request - update user profile
  if (req.method === 'PATCH') {
    try {
      const updateData = req.body;
      
      // Update the user
      mockUser = {
        ...mockUser,
        ...updateData,
      };
      
      return res.status(200).json({
        data: mockUser,
        status: 'success',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to update user profile',
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
