import Link from 'next/link';

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold text-text">Вы офлайн</h1>
      <p className="mt-3 text-sm text-muted">Приложение закешировано. Откройте его снова, когда интернет вернется.</p>
      <Link href="/today" className="mt-6 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-[#0D1117]">
        Открыть приложение
      </Link>
    </main>
  );
}
