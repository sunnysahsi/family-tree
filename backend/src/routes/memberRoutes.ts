
import express from 'express';
import { 
  updateMember,
  deleteMember
} from '../controllers/memberController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/:id')
  .patch(updateMember)
  .delete(deleteMember);

export { router as memberRoutes };
