import { useState, type FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label, Textarea } from '@/components/ui/Field';
import { ForestBackground } from '@/components/ForestBackground';
import { SURVEY_GREETING, SURVEY_QUESTIONS, SURVEY_TITLE } from '@/lib/surveyQuestions';
import { submitSurveyResponse } from '@/services/surveyResponses';

export function SurveyPage() {
  const [answers, setAnswers] = useState<string[]>(() => SURVEY_QUESTIONS.map(() => ''));
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleChange(index: number, value: string) {
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
  }

  const emptyIndexes = answers
    .map((a, i) => (a.trim() ? -1 : i))
    .filter((i) => i !== -1);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched(true);
    setError('');
    if (emptyIndexes.length > 0) return;

    setSubmitting(true);
    try {
      await submitSurveyResponse(answers);
      setSubmitted(true);
    } catch {
      setError('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleRestart() {
    setAnswers(SURVEY_QUESTIONS.map(() => ''));
    setTouched(false);
    setError('');
    setSubmitted(false);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <ForestBackground />
      <div className="relative z-10 mx-auto max-w-2xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20">
        <NavLink
          to="/admin"
          className="absolute right-4 top-4 text-xs font-medium text-gray-400 hover:text-brand-600 sm:right-6 sm:top-6"
        >
          관리자 페이지
        </NavLink>

        <header className="mb-6 text-center">
          <h1 className="mx-auto max-w-sm text-xl font-bold leading-snug text-brand-800 sm:max-w-none sm:text-2xl">
            {SURVEY_TITLE}
          </h1>
        </header>

        <div className="mb-6 overflow-hidden rounded-3xl border border-brand-100 shadow-sm shadow-brand-100/40">
          <video
            src={`${import.meta.env.BASE_URL}img/group-photo.mp4`}
            autoPlay
            muted
            loop
            playsInline
            controls
            className="w-full"
          />
        </div>

        {submitted ? (
          <Card className="animate-fade-in-up space-y-4 text-center">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-brand-700">제출이 완료되었습니다.</p>
              <p className="text-sm text-gray-500">소중한 의견 감사드립니다.</p>
            </div>
            <Button type="button" variant="outline" onClick={handleRestart}>
              처음으로
            </Button>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="animate-fade-in-up space-y-4">
            <Card className="space-y-2">
              <p className="whitespace-pre-line text-sm text-gray-600">{SURVEY_GREETING}</p>
              <p className="text-xs text-gray-400">
                무기명 설문이며, 제출 후에는 수정하거나 취소할 수 없습니다. 모든 문항은 필수입니다.
              </p>
            </Card>

            {SURVEY_QUESTIONS.map((question, i) => {
              const showError = touched && !answers[i].trim();
              return (
                <Card key={i} className="space-y-2">
                  <Label htmlFor={`q-${i}`}>
                    {i + 1}. {question}
                  </Label>
                  <Textarea
                    id={`q-${i}`}
                    value={answers[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    disabled={submitting}
                  />
                  {showError && <p className="text-xs text-rose-500">이 문항은 필수입니다.</p>}
                </Card>
              );
            })}

            {error && <p className="text-center text-sm text-rose-500">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? '제출 중...' : '제출하기'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
