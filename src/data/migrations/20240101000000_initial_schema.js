export async function up(knex) {
    // Rooms Table
    await knex.schema.createTable('rooms', (table) => {
        table.increments('id').primary();
        table.string('property_type').notNullable();
        table.string('room_category').notNullable();
        table.string('room_name').notNullable();
        table.string('room_code', 10).notNullable().unique();
        table.text('description').notNullable();
        table.text('amenities').notNullable();
        table.decimal('price_per_night', 10, 2).notNullable();
        table.timestamp('available_from').notNullable();
        table.boolean('active').defaultTo(true);
        table.integer('display_order').defaultTo(0);
        table.jsonb('images').notNullable();
        table.timestamps(true, true);
    });

    // Agents Table
    await knex.schema.createTable('agents', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        // Storing encrypted revenue as text
        table.text('previous_year_revenue').notNullable();
        table.timestamps(true, true);
    });

    // Bookings Table
    await knex.schema.createTable('bookings', (table) => {
        table.increments('id').primary();
        table.integer('agent_id').unsigned().references('id').inTable('agents').onDelete('CASCADE');
        table.string('property_type').notNullable();
        table.string('room_category').notNullable();
        table.timestamp('booking_date').defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists('bookings');
    await knex.schema.dropTableIfExists('agents');
    await knex.schema.dropTableIfExists('rooms');
}
