import { Router } from 'express';
import { deadliestAttackTypes, highestCasualtyRegions, incidentTrends } from '../controllers/analysis.controller'

const router = Router();

router.get('/deadliest-attack-types', deadliestAttackTypes);
router.get('/highest-casualty-regions', highestCasualtyRegions);
router.get('/incident-trends', incidentTrends);

export default router;