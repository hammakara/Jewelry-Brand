import 'dotenv/config';
import { Client } from 'pg';
import { lookup } from 'dns/promises';
import bcrypt from 'bcryptjs';
import { ADMIN_EMAIL } from '../server/config';

async function pickHost(hostname: string, port: string): Promise<string> {
  // Prefer the IPv4 address to avoid IPv6-first connect timeouts.
  try {
    const { address } = await lookup(hostname, { family: 4 });
    return address;
  } catch {
    return hostname;
  }
}

async function buildClient() {
  const url = new URL(process.env.DATABASE_URL || '');
  const endpointId = url.hostname.split('.')[0];
  const ip = await pickHost(url.hostname, url.port);

  url.hostname = ip;
  url.searchParams.delete('sslmode');
  url.searchParams.delete('channel_binding');
  // Neon pooler requires an explicit endpoint option + cert verification
  // skip when connecting through an IP literal (works around IPv6 routing).
  url.searchParams.set('options', `endpoint=${endpointId}`);

  const attempt = new Client({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: false },
  });
  await attempt.connect();
  return attempt;
}

async function main() {
  const email = (process.env.RESET_EMAIL || ADMIN_EMAIL).trim().toLowerCase();
  const newPassword = process.env.NEW_PASSWORD;

  if (!newPassword || newPassword.length < 6) {
    console.error('Set NEW_PASSWORD (>= 6 chars). Optionally RESET_EMAIL to target another account.');
    process.exit(1);
  }

  const client = await buildClient();

  const { rows } = await client.query('SELECT id, email, name, role FROM users WHERE lower(email) = $1', [email]);
  if (rows.length === 0) {
    console.error(`No user found with email: ${email}`);
    await client.end();
    process.exit(1);
  }

  const user = rows[0];
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await client.query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [passwordHash, user.id]);
  await client.end();

  console.log(`Password reset successfully for ${user.email} (${user.name}, role: ${user.role}).`);

  if (!process.env.RESET_EMAIL) {
    console.log('You can now log in at the admin dashboard with this email and the new password.');
  }
}

main()
  .catch((err) => {
    console.error('Reset failed:', err.message || err);
    process.exit(1);
  });