import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let query = `
      SELECT 
        id, title, description, update_type, location_name, 
        update_date, is_urgent, source_url, created_at
      FROM travel_updates 
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND update_type = $${paramIndex}`;
      values.push(type);
      paramIndex++;
    }

    query += ` ORDER BY update_date DESC LIMIT 50`;

    const updates = await sql(query, values);
    
    return Response.json(updates);
  } catch (error) {
    console.error('Error fetching travel updates:', error);
    return Response.json({ error: 'Failed to fetch travel updates' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, description, update_type, location_name, is_urgent, source_url } = await request.json();

    if (!title || !description || !update_type) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO travel_updates (title, description, update_type, location_name, is_urgent, source_url)
      VALUES (${title}, ${description}, ${update_type}, ${location_name || ''}, ${is_urgent || false}, ${source_url || ''})
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating travel update:', error);
    return Response.json({ error: 'Failed to create travel update' }, { status: 500 });
  }
}