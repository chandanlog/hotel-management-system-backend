import roomRepo from '../repositories/roomRepository.js';

class RoomService {
    async createRoom(data, files) {
        // Process images
        const imageUrls = files.map(file => {
            const b64 = Buffer.from(file.buffer).toString('base64');
            return `data:${file.mimetype};base64,${b64}`;
        });

        const roomData = {
            ...data,
            images: JSON.stringify(imageUrls),
            active: data.active === 'true' || data.active === true, // Handle mulipart/form-data boolean
            price_per_night: parseFloat(data.price_per_night),
            display_order: parseInt(data.display_order) || 0
        };

        return roomRepo.createRoom(roomData);
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

        return roomRepo.getRooms({ search, sortBy, order });
    }

    async getRoomById(id) {
        return roomRepo.findById(id);
    }
}

export default new RoomService();
