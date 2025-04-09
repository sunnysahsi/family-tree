
import type { NextApiRequest, NextApiResponse } from 'next';
import { FamilyMember } from '@/types/FamilyMember';
import { ApiResponse } from '@/types/ApiResponse';

// Mock data - in a real app, this would be replaced by a database
let mockMembers: FamilyMember[] = [
  {
    id: "1",
    name: "John Smith",
    relation: "Father",
    birthDate: "1970-05-15",
    email: "john@example.com",
    bio: "Family patriarch, loves fishing and woodworking.",
    treeId: "1"
  },
  {
    id: "2",
    name: "Mary Smith",
    relation: "Mother",
    birthDate: "1972-08-22",
    email: "mary@example.com",
    bio: "Avid gardener and excellent cook.",
    treeId: "1"
  },
  {
    id: "3",
    name: "Michael Smith",
    relation: "Son",
    birthDate: "1995-03-10",
    email: "michael@example.com",
    bio: "College student studying computer science.",
    treeId: "1"
  },
  {
    id: "4",
    name: "Elizabeth Johnson",
    relation: "Mother",
    birthDate: "1950-11-27",
    email: "elizabeth@example.com",
    bio: "Retired teacher, loves to travel.",
    treeId: "2"
  },
  {
    id: "5",
    name: "Robert Johnson",
    relation: "Father",
    birthDate: "1945-07-19",
    deathDate: "2018-09-30",
    bio: "Veteran and family historian.",
    treeId: "2"
  },
  {
    id: "6",
    name: "Sarah Johnson",
    relation: "Daughter",
    birthDate: "1975-04-12",
    email: "sarah@example.com",
    phone: "555-123-4567",
    bio: "Doctor and mother of two.",
    treeId: "2"
  },
  {
    id: "7",
    name: "James Johnson",
    relation: "Son",
    birthDate: "1978-01-30",
    email: "james@example.com",
    bio: "Architect living in New York.",
    treeId: "2"
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<FamilyMember[] | FamilyMember>>
) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    return res.status(400).json({
      error: 'Invalid tree ID',
      status: 'error',
    });
  }
  
  // GET request - retrieve members for a tree
  if (req.method === 'GET') {
    const treeMembers = mockMembers.filter(member => member.treeId === id);
    
    return res.status(200).json({
      data: treeMembers,
      status: 'success',
    });
  }
  
  // POST request - add a new member to the tree
  if (req.method === 'POST') {
    try {
      const memberData = req.body;
      
      // Validate request
      if (!memberData.name || !memberData.relation) {
        return res.status(400).json({
          error: 'Name and relation are required',
          status: 'error',
        });
      }
      
      // Create new member
      const newMember: FamilyMember = {
        id: `member-${Date.now()}`,
        ...memberData,
        treeId: id
      };
      
      mockMembers.push(newMember);
      
      return res.status(201).json({
        data: newMember,
        status: 'success',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Failed to add family member',
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
