import type { DisplayRow } from './adminTable';

export async function exportRegistrationsToExcel(rows: DisplayRow[], filename = '등록현황.xlsx') {
  const XLSX = await import('xlsx');

  const sheetData = rows.map((row) => ({
    분류: row.category,
    등록자: row.registrantName,
    이름: row.name,
    소속: row.affiliation,
    연락처: row.phone,
    생년월: row.birthMonth === '' ? '' : `${row.birthMonth}월`,
    혈액형: row.bloodType,
    숙박: row.lodging,
    입금: row.paymentStatus,
    체크인: row.checkedIn ? 'O' : 'X',
    기타: row.etc,
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '등록현황');
  XLSX.writeFile(workbook, filename);
}
