/**
 * Mock API Service simulating backend username availability check.
 * Rejects taken usernames to test network boundary validation.
 */
const TAKEN_USERNAMES = [
  'admin',
  'administrator',
  'prodesk',
  'timeline',
  'john_doe',
  'dev_master',
  'root',
  'superuser',
  'himesh'
];

export const checkUsernameAvailability = async (username) => {
  // Simulate network latency (250ms API roundtrip)
  await new Promise((resolve) => setTimeout(resolve, 250));

  if (!username || username.trim().length < 3) {
    return { available: false, reason: 'Username must be at least 3 characters' };
  }

  const clean = username.trim().toLowerCase();
  const isTaken = TAKEN_USERNAMES.includes(clean);

  if (isTaken) {
    return { available: false, reason: `Username "${username}" is already taken` };
  }

  return { available: true, reason: 'Username is available!' };
};
