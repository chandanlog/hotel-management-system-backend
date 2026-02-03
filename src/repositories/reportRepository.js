import db from '../config/db.js';

class ReportRepository {
    async getAllAgents() {
        return db('agents').select('*');
    }

    async getBookingStats() {
        return db('bookings')
            .select('agent_id', 'property_type', 'room_category')
            .count('* as count')
            .groupBy('agent_id', 'property_type', 'room_category');
    }
}

export default new ReportRepository();
