import { Router } from 'express';
import { searchEvents } from '../controllers/search.controller'

const router = Router();

router.get('/', searchEvents);

export default router;