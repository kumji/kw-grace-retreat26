import { roomAssignments } from '@/data/roomAssignments';

export function findRoomNumber(names: (string | undefined)[]): string {
  for (const name of names) {
    const trimmed = name?.trim();
    if (trimmed && roomAssignments[trimmed]) return roomAssignments[trimmed];
  }
  return '';
}
