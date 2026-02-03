import roomRepo from '../repositories/roomRepository.js';
import { toRoomDTO, toRoomListDTO, fromRequestToRoom } from '../mappers/roomMapper.js';

class RoomService {
    async createRoom(data, files) {
        // Process images
        const imageUrls = files.map(file => {
            const b64 = Buffer.from(file.buffer).toString('base64');
            return `data:${file.mimetype};base64,${b64}`;
        });

        const roomData = fromRequestToRoom(data, imageUrls);
        const room = await roomRepo.createRoom(roomData);
        return toRoomDTO(room);
    }

    async getRooms(query) {
        const { search, sort } = query;
        let sortBy, order;

        if (sort === 'latest') {
            sortBy = 'created_at';
            order = 'desc';
        } else if (sort === 'display_order') {
            sortBy = 'display_order';
            order = 'asc';
        } else if (sort === 'available_from') {
            sortBy = 'available_from';
            order = 'asc';
        }

        const rooms = await roomRepo.getRooms({ search, sortBy, order });
        return toRoomListDTO(rooms);
    }

    async getRoomById(id) {
        const room = await roomRepo.findById(id);
        return room ? toRoomDTO(room) : null;
    }
}

export default new RoomService();
