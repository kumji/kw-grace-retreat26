export function ErrorNotice({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-center text-sm text-rose-500">
      {message}
    </div>
  );
}
