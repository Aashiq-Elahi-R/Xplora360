import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const safeRoutesOnly = searchParams.get('safe_routes_only') === 'true';

    let query = `
      SELECT 
        id, name, description, category, 
        location_name, latitude, longitude, image_url, 
        is_safe_route
      FROM places 
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    `;
    const values = [];

    if (safeRoutesOnly) {
      query += ` AND is_safe_route = true`;
    }

    query += ` ORDER BY created_at DESC LIMIT 100`;

    const places = await sql(query, values);
    
    return Response.json(places);
  } catch (error) {
    console.error('Error fetching map places:', error);
    return Response.json({ error: 'Failed to fetch map places' }, { status: 500 });
  }
}