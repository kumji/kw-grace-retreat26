import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}


// 최신 파일을 다시 받아오게 한다. 그래도 안 되면(진짜 오류) 평소처럼 안내한다.
const CHUNK_LOAD_ERROR_PATTERN = /fetch dynamically imported module|error loading dynamically imported module/i;
const RELOAD_FLAG_KEY = 'chunk_reload_attempted';

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error:', error, info);

    if (CHUNK_LOAD_ERROR_PATTERN.test(error.message) && !sessionStorage.getItem(RELOAD_FLAG_KEY)) {
      sessionStorage.setItem(RELOAD_FLAG_KEY, '1');
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
          <p className="text-base font-semibold text-gray-700">
            예기치 못한 오류가 발생했습니다.
          </p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="rounded-2xl bg-brand-500 px-5 py-3 text-white"
          >
            처음으로 돌아가기
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
