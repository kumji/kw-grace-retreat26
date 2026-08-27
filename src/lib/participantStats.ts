import type { Affiliation, BloodType, Registration } from '@/types';

export interface StatItem {
  label: string;
  value: number;
  color: string;
}

export function getTotalParticipants(registrations: Registration[]): number {
  return registrations.reduce((sum, r) => sum + r.totalCount, 0);
}

// 뱃지 색과 맞춰서 관리자 화면과 시각적으로 일관되게 (성인=mint, 취학=amber, 미취학=rose/핑크).
export function getMemberTypeStats(registrations: Registration[]): StatItem[] {
  const adults = registrations.reduce((sum, r) => sum + 1 + r.adults.length, 0);
  const schoolAge = registrations.reduce(
    (sum, r) => sum + r.children.filter((c) => c.schoolStatus === '취학').length,
    0,
  );
  const preschool = registrations.reduce(
    (sum, r) => sum + r.children.filter((c) => c.schoolStatus === '미취학').length,
    0,
  );
  return [
    { label: '성인', value: adults, color: '#22b09b' },
    { label: '취학 아동', value: schoolAge, color: '#f59e0b' },
    { label: '미취학 아동', value: preschool, color: '#f43f5e' },
  ];
}

export function getAffiliationStats(registrations: Registration[]): StatItem[] {
  const counts: Record<Affiliation, number> = { 청장1부: 0, 청장2부: 0, 광림남교회: 0 };
  for (const r of registrations) {
    counts[r.affiliation] += r.totalCount;
  }
  return [
    { label: '청장1부', value: counts['청장1부'], color: '#22b872' },
    { label: '청장2부', value: counts['청장2부'], color: '#0ea5e9' },
    { label: '광림남교회', value: counts['광림남교회'], color: '#8b5cf6' },
  ];
}

// 자녀는 혈액형 데이터가 없어 대표자·성인만 대상으로 한다.
export function getBloodTypeGroups(registrations: Registration[]): Record<BloodType, string[]> {
  const groups: Record<BloodType, string[]> = { A: [], B: [], AB: [], O: [] };
  for (const r of registrations) {
    groups[r.bloodType].push(r.name);
    for (const a of r.adults) groups[a.bloodType].push(a.name);
  }
  return groups;
}

export type Season = '겨울' | '봄' | '여름' | '가을';

function seasonOf(birthMonth: number): Season {
  if (birthMonth === 12 || birthMonth <= 2) return '겨울';
  if (birthMonth <= 5) return '봄';
  if (birthMonth <= 8) return '여름';
  return '가을';
}

// 계절 그룹도 생년월이 있는 대표자·성인만 대상으로 한다.
export function getSeasonGroups(registrations: Registration[]): Record<Season, string[]> {
  const groups: Record<Season, string[]> = { 겨울: [], 봄: [], 여름: [], 가을: [] };
  for (const r of registrations) {
    groups[seasonOf(r.birthMonth)].push(r.name);
    for (const a of r.adults) groups[seasonOf(a.birthMonth)].push(a.name);
  }
  return groups;
}
