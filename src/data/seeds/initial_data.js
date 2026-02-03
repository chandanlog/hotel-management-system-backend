import { encrypt } from '../../utils/encryption.js';

export async function seed(knex) {
    // Deletes ALL existing entries
    await knex('bookings').del();
    await knex('agents').del();
    await knex('rooms').del();

    // Insert Agents
    const agents = [
        { name: 'John Smith', revenue: 620_000 },
        { name: 'Richard Porter', revenue: 1_250_000 },
        { name: 'Tony Grid', revenue: 430_000 },
        { name: 'Sarah Conner', revenue: 800_000 },
        { name: 'Kyle Reese', revenue: 550_000 },
        { name: 'Bruce Wayne', revenue: 2_000_000 },
        { name: 'Clark Kent', revenue: 300_000 },
        { name: 'Diana Prince', revenue: 950_000 }
    ];

    const agentIds = [];
    for (const agent of agents) {
        const [result] = await knex('agents').insert({
            name: agent.name,
            previous_year_revenue: encrypt(agent.revenue.toString())
        }).returning('id');

        // Handle different knex return formats
        const id = result.id || result;
        agentIds.push(id);
    }

    // Helper to add bookings
    const bookingsToAdd = [];
    const addParams = (agentIdx, cat, hot, res, vil, apt) => {
        const aid = agentIds[agentIdx];
        const push = (pt, count) => {
            for (let i = 0; i < count; i++) bookingsToAdd.push({ agent_id: aid, room_category: cat, property_type: pt });
        };
        push('Hotel', hot);
        push('Resort', res);
        push('Villa', vil);
        push('Apartment', apt);
    };

    // Agent 1 (Gold - High Volume)
    addParams(0, 'Suite', 2, 1, 3, 4);
    addParams(0, 'Deluxe', 3, 5, 1, 2);
    addParams(0, 'Standard', 4, 2, 2, 1);

    // Agent 2 (Silver - Moderate Volume)
    // Target ~70 points
    addParams(1, 'Deluxe', 2, 0, 0, 0); // 2 * 9 = 18
    addParams(1, 'Standard', 5, 3, 0, 0); // 5*6 + 3*7 = 30 + 21 = 51
    // Total approx 69 points -> Silver

    // Agent 3 (Bronze - Low Volume)
    // Target ~30 points
    addParams(2, 'Standard', 2, 2, 0, 0); // 2*6 + 2*7 = 12 + 14 = 26
    // Total 26 points -> Bronze

    // Agent 4: Sarah Conner (Gold)
    addParams(3, 'Suite', 3, 2, 0, 0); // (3*14) + (2*16) = 42 + 32 = 74
    addParams(3, 'Deluxe', 5, 0, 0, 0); // 5*9 = 45 -> Total 119 -> Gold

    // Agent 5: Kyle Reese (Silver)
    addParams(4, 'Standard', 5, 0, 0, 0); // 30
    addParams(4, 'Deluxe', 0, 3, 0, 0); // 30 -> Total 60 -> Silver

    // Agent 6: Bruce Wayne (Gold - High Revenue/Performer)
    addParams(5, 'Suite', 0, 0, 5, 0); // 5*18 = 90
    addParams(5, 'Deluxe', 3, 0, 0, 0); // 3*9 = 27 -> Total 117 -> Gold

    // Agent 7: Clark Kent (Bronze)
    addParams(6, 'Standard', 0, 0, 0, 3); // 12
    addParams(6, 'Deluxe', 0, 0, 0, 2); // 12 -> Total 24 -> Bronze

    // Agent 8: Diana Prince (Silver)
    addParams(7, 'Deluxe', 0, 0, 4, 0); // 4*11 = 44
    addParams(7, 'Standard', 5, 0, 0, 0); // 30 -> Total 74 -> Silver

    const chunkSize = 50;
    for (let i = 0; i < bookingsToAdd.length; i += chunkSize) {
        const chunk = bookingsToAdd.slice(i, i + chunkSize);
        await knex('bookings').insert(chunk);
    }
}
