import { Router } from 'express';
import { createEventController, getEventByIdController, updateEventController, deleteEventController, getAllEventsController } from '../controllers/events.controller'

const router = Router();

router.post('/', createEventController);
router.get('/:id', getEventByIdController);
router.put('/:id', updateEventController);
router.delete('/:id', deleteEventController);
router.get('/', getAllEventsController);

export default router;