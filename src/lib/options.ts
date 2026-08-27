import type { Affiliation, BloodType, LodgingOption, SchoolStatus } from '@/types';

export const affiliationOptions: Affiliation[] = ['청장1부', '청장2부', '광림남교회'];
export const bloodTypeOptions: BloodType[] = ['A', 'B', 'O', 'AB'];
export const lodgingOptions: LodgingOption[] = ['침대방', '온돌방', '숙박안함'];
export const schoolStatusOptions: SchoolStatus[] = ['취학', '미취학'];
export const birthMonthOptions: number[] = Array.from({ length: 12 }, (_, i) => i + 1);
