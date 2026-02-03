import reportRepo from '../repositories/reportRepository.js';
import { decrypt } from '../utils/encryption.js';

const INCENTIVE_RATES = {
    Hotel: { Standard: 60, Deluxe: 90, Suite: 140 },
    Resort: { Standard: 70, Deluxe: 100, Suite: 160 },
    Villa: { Standard: 80, Deluxe: 110, Suite: 180 },
    Apartment: { Standard: 40, Deluxe: 65, Suite: 95 }
};

const POINTS_TABLE = {
    Hotel: { Standard: 6, Deluxe: 9, Suite: 14 },
    Resort: { Standard: 7, Deluxe: 10, Suite: 16 },
    Villa: { Standard: 8, Deluxe: 11, Suite: 18 },
    Apartment: { Standard: 4, Deluxe: 6, Suite: 9 }
};

class ReportService {
    async getIncentiveReport(filters = {}) {
        const agents = await reportRepo.getAllAgents();
        const stats = await reportRepo.getBookingStats();

        let report = agents.map(agent => {
            const revenue = parseFloat(decrypt(agent.previous_year_revenue));
            const agentStats = stats.filter(s => s.agent_id === agent.id);

            let totalIncentive = 0;
            let totalPoints = 0;
            let breakdown = [];

            agentStats.forEach(stat => {
                const count = parseInt(stat.count);
                const type = stat.property_type;
                const cat = stat.room_category;

                // Base Incentive
                const baseRate = INCENTIVE_RATES[type]?.[cat] || 0;
                let incentive = baseRate * count;

                // Volume Bonus
                let volumeBonus = 0;
                if (count > 10) volumeBonus = incentive * 0.20;
                else if (count > 5) volumeBonus = incentive * 0.10;

                // High Performer Bonus (Suites only)
                let highPerformerBonus = 0;
                if (revenue > 500000 && cat === 'Suite') {
                    highPerformerBonus = incentive * 0.05;
                }

                // Points
                const pointsPerBooking = POINTS_TABLE[type]?.[cat] || 0;
                totalPoints += pointsPerBooking * count;

                const lineTotal = incentive + volumeBonus + highPerformerBonus;
                totalIncentive += lineTotal;

                breakdown.push({
                    property_type: type,
                    room_category: cat,
                    count,
                    base_incentive: incentive,
                    volume_bonus: volumeBonus,
                    high_performer_bonus: highPerformerBonus,
                    total: lineTotal
                });
            });

            // Performance Rating
            let rating = 'Bronze';
            let performanceBonusToken = 0;
            if (totalPoints > 100) {
                rating = 'Gold';
                performanceBonusToken = 0.10;
            } else if (totalPoints >= 50) {
                rating = 'Silver';
                performanceBonusToken = 0.05;
            }

            const performanceBonus = totalIncentive * performanceBonusToken;
            totalIncentive += performanceBonus;

            return {
                agent_name: agent.name,
                previous_year_revenue: revenue,
                total_bookings: agentStats.reduce((sum, s) => sum + parseInt(s.count), 0),
                total_points: totalPoints,
                rating,
                performance_bonus: performanceBonus,
                total_incentive: totalIncentive,
                breakdown
            };
        });

        // Filtering
        if (filters.agent_name) {
            report = report.filter(r => r.agent_name.toLowerCase().includes(filters.agent_name.toLowerCase()));
        }
        if (filters.rating) {
            report = report.filter(r => r.rating === filters.rating);
        }

        // Sorting
        if (filters.sortBy) {
            report.sort((a, b) => {
                let valA = a[filters.sortBy];
                let valB = b[filters.sortBy];
                if (valA < valB) return filters.order === 'desc' ? 1 : -1;
                if (valA > valB) return filters.order === 'desc' ? -1 : 1;
                return 0;
            });
        }

        return report;
    }
}

export default new ReportService();
