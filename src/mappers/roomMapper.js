export const toRoomDTO = (room) => {
    let images = [];
    try {
        images = typeof room.images === 'string' ? JSON.parse(room.images) : room.images;
    } catch (e) {
        images = [];
    }

    return {
        id: room.id,
        property_type: room.property_type,
        room_category: room.room_category,
        room_name: room.room_name,
        room_code: room.room_code,
        description: room.description,
        amenities: room.amenities,
        price_per_night: parseFloat(room.price_per_night),
        available_from: room.available_from,
        active: Boolean(room.active),
        display_order: parseInt(room.display_order),
        images: images,
        created_at: room.created_at
    };
};

export const toRoomListDTO = (rooms) => {
    return rooms.map(toRoomDTO);
};

export const fromRequestToRoom = (data, imageUrls) => {
    return {
        property_type: data.property_type,
        room_category: data.room_category,
        room_name: data.room_name,
        room_code: data.room_code,
        description: data.description,
        amenities: data.amenities,
        price_per_night: parseFloat(data.price_per_night),
        available_from: data.available_from,
        active: data.active === 'true' || data.active === true,
        display_order: parseInt(data.display_order) || 0,
        images: JSON.stringify(imageUrls)
    };
};
