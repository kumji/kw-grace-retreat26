import type { Affiliation, FamilyAdult, FamilyChild, Settings } from '@/types';

export function calcTotalCount(adults: FamilyAdult[], children: FamilyChild[]): number {
  return 1 + adults.length + children.length;
}

// 광림남교회은 일반 등록비 설정과 무관하게 고정 요금을 적용한다.
const JISEONGJEON_ADULT_FEE = 30_000;
const JISEONGJEON_SCHOOL_AGE_CHILD_FEE = 10_000;

// 만 2세(24개월) 이하 영아는 무료.
const INFANT_FREE_MAX_AGE = 2;
// 자녀는 나이가 많은 순으로 첫째/둘째까지만 요금이 부과되고, 셋째부터(0-based index 2) 무료.
const FREE_FROM_CHILD_RANK = 2;

function calcChildFee(
  child: FamilyChild,
  ageRank: number,
  affiliation: Affiliation,
  settings: Pick<Settings, 'schoolAgeChildFee' | 'preschoolChildFee'>,
): number {
  if (child.age <= INFANT_FREE_MAX_AGE) return 0;
  if (ageRank >= FREE_FROM_CHILD_RANK) return 0;

  if (affiliation === '광림남교회') {
    return child.schoolStatus === '취학' ? JISEONGJEON_SCHOOL_AGE_CHILD_FEE : 0;
  }
  return child.schoolStatus === '취학' ? settings.schoolAgeChildFee : settings.preschoolChildFee;
}

export function calcAmountDue(
  affiliation: Affiliation,
  adults: FamilyAdult[],
  children: FamilyChild[],
  settings: Pick<Settings, 'adultFee' | 'schoolAgeChildFee' | 'preschoolChildFee'>,
): number {
  const adultFee = affiliation === '광림남교회' ? JISEONGJEON_ADULT_FEE : settings.adultFee;

  // 나이 많은 순으로 정렬해 "첫째/둘째/셋째" 순번을 매긴 뒤 셋째부터 무료 규칙을 적용한다.
  const childrenByAgeDesc = [...children].sort((a, b) => b.age - a.age);
  const childrenFee = childrenByAgeDesc.reduce(
    (sum, child, ageRank) => sum + calcChildFee(child, ageRank, affiliation, settings),
    0,
  );

  return (1 + adults.length) * adultFee + childrenFee;
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}
