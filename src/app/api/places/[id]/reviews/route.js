import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const placeId = parseInt(params.id);
    
    if (isNaN(placeId)) {
      return Response.json({ error: 'Invalid place ID' }, { status: 400 });
    }

    const reviews = await sql`
      SELECT 
        r.id, r.rating, r.review_text, r.sentiment_score, 
        r.sentiment_category, r.created_at,
        u.name as user_name
      FROM reviews r
      LEFT JOIN auth_users u ON r.user_id = u.id
      WHERE r.place_id = ${placeId}
      ORDER BY r.created_at DESC
    `;

    return Response.json(reviews);
  } catch (error) {
    console.error('Error fetching place reviews:', error);
    return Response.json({ error: 'Failed to fetch place reviews' }, { status: 500 });
  }
}