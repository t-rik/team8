import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors())

app.get('/api/feed', async (c) => {
  // TODO: Get actual user ID from Auth Middleware
  // For now, let's assume a hardcoded user ID for testing
  const CURRENT_USER_ID = 1; 

  const query = `
    WITH MyWants AS (
      SELECT project_id, project_name 
      FROM active_projects 
      WHERE user_id = ? AND looking_for_match = 1
    ),
    Candidates AS (
      SELECT 
        u.id, 
        u.login, 
        u.level, 
        u.blackholed_at, 
        u.image_url,
        ap.project_id,
        ap.project_name
      FROM users u
      JOIN active_projects ap ON u.id = ap.user_id
      WHERE u.id != ? 
        AND ap.looking_for_match = 1
        AND ap.project_id IN (SELECT project_id FROM MyWants)
    )
    SELECT 
      c.id,
      c.login,
      c.image_url,
      c.level,
      MAX(c.blackholed_at) as blackholed_at,
      GROUP_CONCAT(c.project_name, ', ') as matched_projects,
      (
        SUM(CASE WHEN mw.project_id IS NOT NULL THEN 100 ELSE 0 END) + -- Mutual Intent
        (CASE WHEN ABS(c.level - (SELECT level FROM users WHERE id = ?)) < 1.0 THEN 30 ELSE 0 END) + -- Skill Match
        (CASE WHEN (julianday(c.blackholed_at) - julianday('now')) < 30 THEN 10 ELSE 0 END) -- Rescue Bonus
      ) as score
    FROM Candidates c
    JOIN MyWants mw ON c.project_id = mw.project_id
    GROUP BY c.id
    ORDER BY score DESC;
  `;

  try {
    const { results } = await c.env.DB.prepare(query)
      .bind(CURRENT_USER_ID, CURRENT_USER_ID, CURRENT_USER_ID)
      .all();
    
    return c.json({ candidates: results });
  } catch (e) {
    console.error(e)
    return c.json({ error: 'Failed to fetch feed' }, 500)
  }
})

export default app
