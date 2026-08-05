import type { Affiliation, BloodType, LodgingOption } from '@/types';

export const affiliationOptions: Affiliation[] = ['청장1부', '청장2부', '지교회'];
export const bloodTypeOptions: BloodType[] = ['A', 'B', 'O', 'AB'];
export const lodgingOptions: LodgingOption[] = ['O', 'X'];
export const birthMonthOptions: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
