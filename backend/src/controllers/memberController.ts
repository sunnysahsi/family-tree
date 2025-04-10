
import { Request, Response } from 'express';
import { FamilyMember } from '../models/memberModel';
import { FamilyTree } from '../models/treeModel';
import mongoose from 'mongoose';

// @desc    Get all members for a family tree
// @route   GET /api/trees/:treeId/members
// @access  Private
export const getMembersByTreeId = async (req: Request, res: Response) => {
  try {
    const tree = await FamilyTree.findById(req.params.treeId);

    if (!tree) {
      return res.status(404).json({
        status: 'error',
        message: 'Tree not found'
      });
    }

    // Check if tree belongs to user or is public
    if (tree.ownerId.toString() !== req.user._id.toString() && !tree.isPublic) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this tree'
      });
    }

    const members = await FamilyMember.find({ treeId: req.params.treeId });

    res.json({
      status: 'success',
      data: members
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Create a new family member
// @route   POST /api/trees/:treeId/members
// @access  Private
export const createMember = async (req: Request, res: Response) => {
  try {
    req.body.treeId = req.params.treeId;

    // Verify tree exists and user owns it
    const tree = await FamilyTree.findById(req.params.treeId);

    if (!tree) {
      return res.status(404).json({
        status: 'error',
        message: 'Tree not found'
      });
    }

    if (tree.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to add members to this tree'
      });
    }

    const member = await FamilyMember.create(req.body);

    // Add member to tree's members array
    await FamilyTree.findByIdAndUpdate(
      req.params.treeId,
      { $push: { members: member._id } }
    );

    res.status(201).json({
      status: 'success',
      data: member
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Update a family member
// @route   PATCH /api/members/:id
// @access  Private
export const updateMember = async (req: Request, res: Response) => {
  try {
    let member = await FamilyMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        status: 'error',
        message: 'Member not found'
      });
    }

    // Verify tree ownership
    const tree = await FamilyTree.findById(member.treeId);

    if (!tree) {
      return res.status(404).json({
        status: 'error',
        message: 'Associated tree not found'
      });
    }

    if (tree.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this member'
      });
    }

    member = await FamilyMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      status: 'success',
      data: member
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Delete a family member
// @route   DELETE /api/members/:id
// @access  Private
export const deleteMember = async (req: Request, res: Response) => {
  try {
    const member = await FamilyMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        status: 'error',
        message: 'Member not found'
      });
    }

    // Verify tree ownership
    const tree = await FamilyTree.findById(member.treeId);

    if (!tree) {
      return res.status(404).json({
        status: 'error',
        message: 'Associated tree not found'
      });
    }

    if (tree.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this member'
      });
    }

    await FamilyMember.findByIdAndDelete(req.params.id);

    // Remove member from tree's members array
    await FamilyTree.findByIdAndUpdate(
      member.treeId,
      { $pull: { members: member._id } }
    );

    res.json({
      status: 'success',
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
