import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const placeId = parseInt(params.id);
    
    if (isNaN(placeId)) {
      return Response.json({ error: 'Invalid place ID' }, { status: 400 });
    }

    const places = await sql`
      SELECT 
        id, name, description, history, category, 
        location_name, latitude, longitude, image_url, 
        is_safe_route, created_at, updated_at
      FROM places 
      WHERE id = ${placeId}
    `;

    if (places.length === 0) {
      return Response.json({ error: 'Place not found' }, { status: 404 });
    }

    return Response.json(places[0]);
  } catch (error) {
    console.error('Error fetching place:', error);
    return Response.json({ error: 'Failed to fetch place' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const placeId = parseInt(params.id);
    const updates = await request.json();
    
    if (isNaN(placeId)) {
      return Response.json({ error: 'Invalid place ID' }, { status: 400 });
    }

    // Build dynamic update query
    const allowedFields = ['name', 'description', 'history', 'category', 'location_name', 'latitude', 'longitude', 'image_url', 'is_safe_route'];
    const updateFields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (updateFields.length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Add the placeId and updated_at
    updateFields.push(`updated_at = $${paramIndex}`);
    values.push(new Date().toISOString());
    paramIndex++;
    
    values.push(placeId);

    const query = `
      UPDATE places 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: 'Place not found' }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error('Error updating place:', error);
    return Response.json({ error: 'Failed to update place' }, { status: 500 });
  }
}