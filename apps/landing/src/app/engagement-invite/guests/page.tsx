import { createHash, timingSafeEqual } from 'crypto';
import { neon } from '@neondatabase/serverless';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Private guest list for the engagement RSVPs. Password lives in the DB_VIEW_PASS env
// var (never in the repo); a correct login sets an httpOnly cookie holding a hash of it.

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Guest list', robots: { index: false, follow: false } };

const PATH = '/engagement-invite/guests';
const COOKIE = 'rsvp-admin';
const token = (password: string) => createHash('sha256').update(`rsvp-admin:${password}`).digest('hex');

function matches(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

async function isAuthed() {
  const password = process.env.DB_VIEW_PASS;
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(password && value && matches(value, token(password)));
}

async function login(form: FormData) {
  'use server';
  const password = process.env.DB_VIEW_PASS;
  const attempt = String(form.get('password') ?? '');
  if (!password || !matches(token(attempt), token(password))) redirect(`${PATH}?error=1`);
  (await cookies()).set(COOKIE, token(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: PATH,
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(PATH);
}

async function logout() {
  'use server';
  (await cookies()).delete({ name: COOKIE, path: PATH });
  redirect(PATH);
}

type Row = { name: string; guests: number; invite: string; created_at: Date; updated_at: Date };

const shell = 'min-h-svh bg-[#1b1d19] px-5 py-10 text-[#f3eddf] font-sans';
const label = 'font-mono text-xs uppercase tracking-wider text-[#b9b9ab]';

export default async function GuestsPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (!(await isAuthed())) {
    const { error } = await searchParams;
    return (
      <main className={`${shell} flex items-center justify-center`}>
        <form action={login} className="w-full max-w-xs space-y-4">
          <h1 className="font-sans! text-2xl! font-semibold! text-[#f3eddf]!">Guest list</h1>
          <label className="block space-y-2">
            <span className={label}>Password</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              autoComplete="current-password"
              className="block w-full border border-[#f3eddf]/30 bg-[#24252d] px-3 py-2 outline-none focus:border-[#a8c5ad]"
            />
          </label>
          {error && <p className="text-sm text-[#efa16f]">Wrong password.</p>}
          <button className="w-full bg-[#a8c5ad] py-2 font-semibold text-[#1b1d19]">Open</button>
        </form>
      </main>
    );
  }

  const sql = neon(process.env.DATABASE_URL!);
  const rows = (await sql`select name, guests, invite, created_at, updated_at from rsvps order by updated_at desc`) as Row[];
  const people = rows.reduce((sum, r) => sum + r.guests, 0);
  const when = (d: Date) =>
    new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

  return (
    <main className={shell}>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between">
          <h1 className="font-sans! text-2xl! font-semibold! text-[#f3eddf]!">Guest list</h1>
          <form action={logout}>
            <button className={`${label} underline`}>Log out</button>
          </form>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3">
          <div className="border border-[#f3eddf]/20 p-4">
            <dt className={label}>People coming</dt>
            <dd className="mt-1 text-4xl font-semibold tabular-nums">{people}</dd>
          </div>
          <div className="border border-[#f3eddf]/20 p-4">
            <dt className={label}>Responses</dt>
            <dd className="mt-1 text-4xl font-semibold tabular-nums">{rows.length}</dd>
          </div>
        </dl>

        {rows.length === 0 ? (
          <p className="mt-8 text-[#b9b9ab]">No responses yet.</p>
        ) : (
          <table className="mt-8 w-full text-left text-sm">
            <thead>
              <tr className={label}>
                <th className="py-2 font-normal">Name</th>
                <th className="py-2 text-right font-normal">People</th>
                <th className="py-2 pl-4 font-normal">Invite</th>
                <th className="py-2 pl-4 font-normal">When (IST)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.name}-${new Date(r.created_at).getTime()}`} className="border-t border-[#f3eddf]/15">
                  <td className="py-3">{r.name}</td>
                  <td className="py-3 text-right tabular-nums">{r.guests}</td>
                  <td className="py-3 pl-4 text-[#b9b9ab]">{r.invite === 'invite-1' ? 'Pixel' : 'Gamer'}</td>
                  <td className="py-3 pl-4 text-[#b9b9ab]">
                    {when(r.updated_at)}
                    {new Date(r.updated_at).getTime() - new Date(r.created_at).getTime() > 1000 && <span title={`First answered ${when(r.created_at)}`}> · edited</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
