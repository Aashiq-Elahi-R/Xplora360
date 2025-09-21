import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sentiment = searchParams.get('sentiment');

    let query = `
      SELECT 
        r.id, r.rating, r.review_text, r.sentiment_score, 
        r.sentiment_category, r.created_at,
        u.name as user_name,
        p.name as place_name
      FROM reviews r
      LEFT JOIN auth_users u ON r.user_id = u.id
      LEFT JOIN places p ON r.place_id = p.id
      WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    if (sentiment && sentiment !== 'all') {
      query += ` AND r.sentiment_category = $${paramIndex}`;
      values.push(sentiment);
      paramIndex++;
    }

    query += ` ORDER BY r.created_at DESC LIMIT 50`;

    const reviews = await sql(query, values);
    
    return Response.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { place_id, rating, review_text, sentiment_category } = await request.json();

    if (!place_id || !rating || !review_text) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Check if place exists
    const place = await sql`SELECT id FROM places WHERE id = ${place_id}`;
    if (place.length === 0) {
      return Response.json({ error: 'Place not found' }, { status: 404 });
    }

    // Use AI to analyze sentiment (simplified version)
    let sentimentScore = 0;
    let sentimentCat = sentiment_category || 'general';
    
    // Simple sentiment analysis based on keywords
    const positiveWords = ['great', 'amazing', 'excellent', 'wonderful', 'fantastic', 'love', 'beautiful', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'disgusting', 'worst', 'disappointing'];
    
    const lowerText = review_text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      sentimentScore = 0.5;
    } else if (negativeCount > positiveCount) {
      sentimentScore = -0.5;
    }

    // Adjust based on rating
    if (rating >= 4) sentimentScore = Math.max(sentimentScore, 0.3);
    if (rating <= 2) sentimentScore = Math.min(sentimentScore, -0.3);

    const result = await sql`
      INSERT INTO reviews (user_id, place_id, rating, review_text, sentiment_score, sentiment_category)
      VALUES (${session.user.id}, ${place_id}, ${rating}, ${review_text}, ${sentimentScore}, ${sentimentCat})
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return Response.json({ error: 'Failed to create review' }, { status: 500 });
  }
}