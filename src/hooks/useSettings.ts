import { useEffect, useState } from 'react';
import { defaultSettings, subscribeSettings } from '@/services/settings';
import type { Settings } from '@/types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeSettings(
      (next) => {
        setSettings(next);
        setLoading(false);
        setError(null);
      },
      () => {
        setLoading(false);
        setError('설정 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
      },
    );
    return unsubscribe;
  }, []);

  return { settings, loading, error };
}
