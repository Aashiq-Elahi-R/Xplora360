import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("place_id");

    if (placeId) {
      // Check if specific place is saved
      const saved = await sql`
        SELECT id FROM saved_places 
        WHERE user_id = ${session.user.id} AND place_id = ${parseInt(placeId)}
      `;

      return Response.json({ isSaved: saved.length > 0 });
    } else {
      // Get all saved places for user
      const savedPlaces = await sql`
        SELECT 
          sp.id as saved_id,
          sp.saved_at,
          p.id, p.name, p.description, p.category, 
          p.location_name, p.image_url, p.is_safe_route
        FROM saved_places sp
        JOIN places p ON sp.place_id = p.id
        WHERE sp.user_id = ${session.user.id}
        ORDER BY sp.saved_at DESC
      `;

      return Response.json(savedPlaces);
    }
  } catch (error) {
    console.error("Error fetching saved places:", error);
    return Response.json(
      { error: "Failed to fetch saved places" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { place_id } = await request.json();

    if (!place_id) {
      return Response.json({ error: "Missing place_id" }, { status: 400 });
    }

    // Check if place exists
    const place = await sql`SELECT id FROM places WHERE id = ${place_id}`;
    if (place.length === 0) {
      return Response.json({ error: "Place not found" }, { status: 404 });
    }

    // Check if already saved
    const existing = await sql`
      SELECT id FROM saved_places 
      WHERE user_id = ${session.user.id} AND place_id = ${place_id}
    `;

    if (existing.length > 0) {
      return Response.json({ error: "Place already saved" }, { status: 409 });
    }

    const result = await sql`
      INSERT INTO saved_places (user_id, place_id)
      VALUES (${session.user.id}, ${place_id})
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error saving place:", error);
    return Response.json({ error: "Failed to save place" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { place_id } = await request.json();

    if (!place_id) {
      return Response.json({ error: "Missing place_id" }, { status: 400 });
    }

    const result = await sql`
      DELETE FROM saved_places 
      WHERE user_id = ${session.user.id} AND place_id = ${place_id}
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Saved place not found" }, { status: 404 });
    }

    return Response.json({ message: "Place removed from saved list" });
  } catch (error) {
    console.error("Error removing saved place:", error);
    return Response.json(
      { error: "Failed to remove saved place" },
      { status: 500 },
    );
  }
}
