// 방 배정 엑셀(src/data/*.xlsx)을 읽어 이름 -> 방번호 매핑을 src/data/roomAssignments.ts로 생성한다.
// 방 배정이 갱신되면 엑셀 파일을 교체한 뒤 `node scripts/build-room-assignments.mjs`를 다시 실행한다.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import XLSX from 'xlsx';

const SOURCE_XLSX = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/data/2026_청장_가을영성수련회_방배정안내.xlsx',
);
const OUTPUT_TS = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/data/roomAssignments.ts',
);

const workbook = XLSX.readFile(SOURCE_XLSX);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const roomAssignments = {};
for (const row of rows.slice(1)) {
  const room = row?.[0];
  if (room == null || room === '') continue;
  for (const nameCell of [row[1], row[2]]) {
    if (!nameCell) continue;
    const name = String(nameCell).trim();
    if (!name || name === '없음') continue;
    roomAssignments[name] = String(room);
  }
}

const entries = Object.entries(roomAssignments)
  .sort(([a], [b]) => a.localeCompare(b, 'ko'))
  .map(([name, room]) => `  ${JSON.stringify(name)}: ${JSON.stringify(room)},`)
  .join('\n');

const output = `// 이 파일은 scripts/build-room-assignments.mjs 로 자동 생성됩니다. 직접 수정하지 마세요.
export const roomAssignments: Record<string, string> = {
${entries}
};
`;

writeFileSync(OUTPUT_TS, output);
console.log(`생성 완료: ${OUTPUT_TS} (${Object.keys(roomAssignments).length}명)`);
