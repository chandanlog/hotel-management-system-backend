import db from '../config/db.js';

class RoomRepository {
    async createRoom(roomData) {
        const [room] = await db('rooms').insert(roomData).returning('*');
        return room;
    }

    async getRooms({ search, sortBy, order }) {
        let query = db('rooms').select('*');

        if (search) {
            query = query.where(builder => {
                builder.where('room_name', 'ilike', `%${search}%`)
                    .orWhere('room_code', 'ilike', `%${search}%`);
            });
        }

        if (sortBy) {
            // sortBy can be 'available_from', 'display_order', 'created_at'
            query = query.orderBy(sortBy, order || 'asc');
        }

        return query;
    }

    async findById(id) {
        return db('rooms').where({ id }).first();
    }
}
export default new RoomRepository();
