
import express from 'express';
import { 
  getTrees,
  getTreeById,
  createTree,
  updateTree,
  deleteTree
} from '../controllers/treeController';
import { 
  getMembersByTreeId,
  createMember
} from '../controllers/memberController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

// Tree routes
router.route('/')
  .get(getTrees)
  .post(createTree);

router.route('/:id')
  .get(getTreeById)
  .patch(updateTree)
  .delete(deleteTree);

// Member routes related to trees
router.route('/:treeId/members')
  .get(getMembersByTreeId)
  .post(createMember);

export { router as treeRoutes };
