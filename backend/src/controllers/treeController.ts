
import { Request, Response } from 'express';
import { FamilyTree } from '../models/treeModel';
import mongoose from 'mongoose';

// @desc    Get all family trees for a user
// @route   GET /api/trees
// @access  Private
export const getTrees = async (req: Request, res: Response) => {
  try {
    const trees = await FamilyTree.find({ ownerId: req.user._id });

    res.json({
      status: 'success',
      data: trees
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Get a single family tree
// @route   GET /api/trees/:id
// @access  Private
export const getTreeById = async (req: Request, res: Response) => {
  try {
    const tree = await FamilyTree.findById(req.params.id);

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

    res.json({
      status: 'success',
      data: tree
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Create a new family tree
// @route   POST /api/trees
// @access  Private
export const createTree = async (req: Request, res: Response) => {
  try {
    const { name, description, isPublic, memoryNotes } = req.body;

    const tree = await FamilyTree.create({
      name,
      description,
      isPublic,
      memoryNotes,
      ownerId: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: tree
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Update a family tree
// @route   PATCH /api/trees/:id
// @access  Private
export const updateTree = async (req: Request, res: Response) => {
  try {
    let tree = await FamilyTree.findById(req.params.id);

    if (!tree) {
      return res.status(404).json({
        status: 'error',
        message: 'Tree not found'
      });
    }

    // Check ownership
    if (tree.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this tree'
      });
    }

    tree = await FamilyTree.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      status: 'success',
      data: tree
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Delete a family tree
// @route   DELETE /api/trees/:id
// @access  Private
export const deleteTree = async (req: Request, res: Response) => {
  try {
    const tree = await FamilyTree.findById(req.params.id);

    if (!tree) {
      return res.status(404).json({
        status: 'error',
        message: 'Tree not found'
      });
    }

    // Check ownership
    if (tree.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this tree'
      });
    }

    await FamilyTree.findByIdAndDelete(req.params.id);

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
