import { SURVEY_QUESTIONS, SURVEY_TITLE } from '@/lib/surveyQuestions';
import type { SurveyResponseMeta } from '@/types';

const DIVIDER = '-'.repeat(40);

function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function buildSingleResponseText(response: SurveyResponseMeta): string {
  const header = `${SURVEY_TITLE}\n제출일시: ${new Date(response.createdAt).toLocaleString('ko-KR')}`;
  const body = SURVEY_QUESTIONS.map((question, i) => {
    const answer = response.answers[i]?.trim() || '(응답 없음)';
    return `${i + 1}. ${question}\n${answer}`;
  }).join('\n\n');
  return `${header}\n\n${body}`;
}

export function downloadSingleResponseText(response: SurveyResponseMeta): void {
  const timestamp = new Date(response.createdAt).toISOString().slice(0, 19).replace(/[:T]/g, '-');
  downloadText(`설문응답_${timestamp}.txt`, buildSingleResponseText(response));
}

export function buildSurveyTextExport(responses: SurveyResponseMeta[]): string {
  // 응답 순서(제출 시각)는 답을 모아 보는 데 의미가 없고 오히려 특정 응답을
  // 시간순으로 추적할 여지를 주므로, 문항별로 답만 무작위 순서로 섞어 나열한다.
  const shuffled = [...responses].sort(() => Math.random() - 0.5);

  return SURVEY_QUESTIONS.map((question, i) => {
    const answers = shuffled
      .map((r) => r.answers[i]?.trim())
      .filter((a): a is string => Boolean(a));
    const body = answers.length > 0 ? answers.map((a) => `- ${a}`).join('\n') : '(응답 없음)';
    return `${i + 1}. ${question}\n${DIVIDER}\n${body}`;
  }).join('\n\n');
}

export function downloadSurveyTextExport(responses: SurveyResponseMeta[]): void {
  downloadText(
    `설문응답_문항별모음_${new Date().toISOString().slice(0, 10)}.txt`,
    buildSurveyTextExport(responses),
  );
}
