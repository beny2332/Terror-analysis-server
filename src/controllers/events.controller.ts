import { Request, Response, NextFunction, RequestHandler } from 'express';
import {
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllEvents,
} from "../services/events.service"

export const createEventController = async (req: Request, res: Response) => {
  try {
    const newEvent = await createEvent(req.body)
    res.status(201).json(newEvent)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const getEventByIdController: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
      const event = await getEventById(req.params.id)
      if (!event) {
          res.status(404).json({ error: "Event not found" })
          return
      }
      res.status(200).json(event)
  } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
  }
}
export const updateEventController: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedEvent = await updateEvent(req.params.id, req.body)
    if (!updatedEvent) {
        res.status(404).json({ error: "Event not found" })
    return 
    }
    res.status(200).json(updatedEvent)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const deleteEventController: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedEvent = await deleteEvent(req.params.id)
    if (!deletedEvent) {
      res.status(404).json({ error: "Event not found" })
    return 
    }
    res.status(200).json(deletedEvent)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const getAllEventsController = async (req: Request, res: Response) => {
  try {
    const events = await getAllEvents()
    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}
