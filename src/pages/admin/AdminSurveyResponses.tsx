import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorNotice } from '@/components/ui/ErrorNotice';
import { subscribeSurveyResponses } from '@/services/surveyResponses';
import { downloadSingleResponseText, downloadSurveyTextExport } from '@/lib/exportSurveyText';
import type { SurveyResponseMeta } from '@/types';

export function AdminSurveyResponses() {
  const [responses, setResponses] = useState<SurveyResponseMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSurveyResponses(
      (data) => {
        setResponses(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
        setLoadError(true);
      },
    );
    return unsubscribe;
  }, []);

  if (loading) {
    return <p className="py-20 text-center text-sm text-gray-400">불러오는 중...</p>;
  }

  if (loadError) {
    return <ErrorNotice message="설문 응답을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-brand-100 bg-brand-500 p-5 text-white shadow-sm shadow-brand-100/40 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white/90">설문 응답 수</p>
            <p className="mt-1 text-2xl font-bold text-white">{responses.length}건</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={responses.length === 0}
            onClick={() => downloadSurveyTextExport(responses)}
          >
            문항별 답변 모음 (.txt)
          </Button>
        </div>
      </div>

      <Card className="space-y-3">
        {responses.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">아직 제출된 응답이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {responses.map((response, i) => (
              <li key={response.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">응답 #{responses.length - i}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(response.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => downloadSingleResponseText(response)}
                >
                  텍스트 파일 다운로드
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
