import type { Affiliation } from '@/types';

const KEY = 'program_signup_identity';

export interface ProgramIdentity {
  name: string;
  affiliation: Affiliation;
}

export function saveProgramIdentity(identity: ProgramIdentity): void {
  localStorage.setItem(KEY, JSON.stringify(identity));
}

export function getProgramIdentity(): ProgramIdentity | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ProgramIdentity>;
    if (!parsed.name || !parsed.affiliation) return null;
    return { name: parsed.name, affiliation: parsed.affiliation };
  } catch {
    return null;
  }
}
