import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie } from 'hono/cookie'

type Bindings = {
  DB: D1Database
  FOURTYTWO_CLIENT_ID: string
  FOURTYTWO_CLIENT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
}))

// Auth Helpers
const REDIRECT_URI = 'http://localhost:8787/api/auth/callback';

app.get('/api/auth/login', (c) => {
  const url = `https://api.intra.42.fr/oauth/authorize?client_id=${c.env.FOURTYTWO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
  return c.redirect(url);
})

app.get('/api/auth/callback', async (c) => {
  const code = c.req.query('code')
  if (!code) return c.text('No code provided', 400)

  // 1. Exchange code for token
  const tokenResponse = await fetch('https://api.intra.42.fr/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: c.env.FOURTYTWO_CLIENT_ID,
      client_secret: c.env.FOURTYTWO_CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData: any = await tokenResponse.json();
  if (tokenData.error) return c.json(tokenData, 400);

  // 2. Get User Info
  const meResponse = await fetch('https://api.intra.42.fr/v2/me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const me: any = await meResponse.json();

  // 3. Upsert User
  const { id, login, image_url, cursus_users } = me;
  const rank = cursus_users.find((cu: any) => cu.cursus_id === 21)?.level || 0; // 21 is 42cursus
  const blackholed_at = cursus_users.find((cu: any) => cu.cursus_id === 21)?.blackholed_at;

  await c.env.DB.prepare(`
    INSERT INTO users (id, login, level, blackholed_at, image_url)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      level = excluded.level,
      blackholed_at = excluded.blackholed_at,
      image_url = excluded.image_url,
      login = excluded.login
  `).bind(id, login, rank, blackholed_at, image_url?.link).run();

  // 4. Set Session Cookie (Simple ID for MVP)
  // In production, sign this with a JWT secret!
  setCookie(c, 'team8_session', id.toString(), {
    httpOnly: true,
    secure: true,
    sameSite: 'None', // Needed for cross-domain localhost
    path: '/',
  });

  return c.redirect('http://localhost:5173/');
})

app.get('/api/auth/me', async (c) => {
  const userId = getCookie(c, 'team8_session');
  if (!userId) return c.json({ user: null }, 401);

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
  return c.json({ user });
})

app.get('/api/feed', async (c) => {
  const userId = getCookie(c, 'team8_session');
  // For testing without auth, fallback to seed user 1 if no cookie
  // REMOVE THIS FALLBACK IN PRODUCTION
  const CURRENT_USER_ID = userId ? parseInt(userId) : 1; 

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
