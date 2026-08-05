const KEY = 'registration_id';

export function saveRegistrationId(id: string): void {
  localStorage.setItem(KEY, id);
}

export function getRegistrationId(): string | null {
  return localStorage.getItem(KEY);
}

export function clearRegistrationId(): void {
  localStorage.removeItem(KEY);
}
