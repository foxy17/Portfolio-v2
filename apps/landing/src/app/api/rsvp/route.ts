import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

// Engagement invite RSVPs → Neon `rsvps` table (one row per device; resubmitting updates it).
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const INVITES = ['invite-1', 'invite-2'];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 80) : '';
  const guests = Number(body?.guests);
  const { invite, deviceId } = body ?? {};
  if (!name || !Number.isInteger(guests) || guests < 1 || guests > 10 || !INVITES.includes(invite) || !UUID.test(deviceId)) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    insert into rsvps (device_id, name, guests, invite)
    values (${deviceId}, ${name}, ${guests}, ${invite})
    on conflict (device_id) do update
      set name = excluded.name, guests = excluded.guests, invite = excluded.invite, updated_at = now()`;
  return NextResponse.json({ ok: true });
}
