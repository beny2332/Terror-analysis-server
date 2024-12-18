import { Router } from 'express';
import { topGroups, groupsByYear, deadliestRegions } from '../controllers/relationships.controller';

const router = Router();

router.get('/top-groups', topGroups);
router.get('/groups-by-year', groupsByYear);
router.get('/deadliest-regions', deadliestRegions);

export default router;