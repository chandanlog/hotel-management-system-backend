export const toAgentReportDTO = (agentData) => {
    return {
        agent_name: agentData.agent_name,
        previous_year_revenue: parseFloat(agentData.previous_year_revenue),
        total_bookings: parseInt(agentData.total_bookings),
        total_points: parseInt(agentData.total_points),
        rating: agentData.rating,
        performance_bonus: parseFloat(agentData.performance_bonus.toFixed(2)),
        total_incentive: parseFloat(agentData.total_incentive.toFixed(2)),
        breakdown: agentData.breakdown.map(item => ({
            property_type: item.property_type,
            room_category: item.room_category,
            count: parseInt(item.count),
            base_incentive: parseFloat(item.base_incentive.toFixed(2)),
            volume_bonus: parseFloat(item.volume_bonus.toFixed(2)),
            high_performer_bonus: parseFloat(item.high_performer_bonus.toFixed(2)),
            total: parseFloat(item.total.toFixed(2))
        }))
    };
};

export const toReportListDTO = (reports) => {
    return reports.map(toAgentReportDTO);
};
