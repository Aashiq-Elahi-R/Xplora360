import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = `
      SELECT 
        id, name, description, history, category, 
        location_name, latitude, longitude, image_url, 
        is_safe_route, created_at
      FROM places 
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (
        LOWER(name) LIKE LOWER($${paramIndex}) 
        OR LOWER(description) LIKE LOWER($${paramIndex})
        OR LOWER(location_name) LIKE LOWER($${paramIndex})
        OR LOWER(history) LIKE LOWER($${paramIndex})
      )`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      query += ` AND LOWER(category) = LOWER($${paramIndex})`;
      values.push(category);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT 50`;

    const places = await sql(query, values);
    
    return Response.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    return Response.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, description, history, category, location_name, latitude, longitude, image_url, is_safe_route } = await request.json();

    if (!name || !description || !category || !location_name) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO places (name, description, history, category, location_name, latitude, longitude, image_url, is_safe_route)
      VALUES (${name}, ${description}, ${history || ''}, ${category}, ${location_name}, ${latitude || null}, ${longitude || null}, ${image_url || ''}, ${is_safe_route || false})
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating place:', error);
    return Response.json({ error: 'Failed to create place' }, { status: 500 });
  }
}