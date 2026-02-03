import roomService from '../services/roomService.js';
import catchAsync from '../utils/catchAsync.js';
import { sendResponse } from '../utils/response.js';
import Joi from 'joi';
import AppError from '../utils/AppError.js';

export const createRoom = catchAsync(async (req, res) => {
    // Validation
    const schema = Joi.object({
        property_type: Joi.string().required().valid('Hotel', 'Resort', 'Villa', 'Apartment'),
        room_category: Joi.string().required().valid('Standard', 'Deluxe', 'Suite'),
        room_name: Joi.string().required(),
        room_code: Joi.string().required().length(10).alphanum(),
        description: Joi.string().required(),
        amenities: Joi.string().required(),
        price_per_night: Joi.number().required(),
        available_from: Joi.string().required(),
        active: Joi.any().optional(),
        display_order: Joi.any().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        throw new AppError(error.details[0].message, 400);
    }

    if (!req.files || req.files.length === 0) {
        throw new AppError('At least one image is required', 400);
    }

    const room = await roomService.createRoom(req.body, req.files);
    sendResponse(res, 201, room, 'Room created successfully');
});

export const getRooms = catchAsync(async (req, res) => {
    const rooms = await roomService.getRooms(req.query);
    sendResponse(res, 200, rooms);
});

export const getRoom = catchAsync(async (req, res) => {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
        throw new AppError('Room not found', 404);
    }
    sendResponse(res, 200, room);
});
