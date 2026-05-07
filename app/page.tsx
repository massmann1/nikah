import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { ArrowUpRight, Clock3, HeartHandshake, MapPin, MoonStar, Shirt, Sparkles } from 'lucide-react';
import { NikahCountdown } from '@/components/nikah-countdown';

const schedule: Array<{
  time: string;
  title: string;
  note: string;
  address: string;
}> = [
  {
    time: '15:30',
    title: 'Никах в мечети Алтан',
    note: 'Просим приехать немного заранее, чтобы спокойно занять места к началу церемонии.',
    address: 'ул. Дубравная, 2В, Казань'
  },
  {
    time: '17:30',
    title: 'Банкет в кафе «Эмиз»',
    note: 'После никаха продолжим вечер за праздничным столом, в тёплой и семейной атмосфере.',
    address: 'улица Сафиуллина, 29, Казань'
  }
];

const locations: Array<{
  title: string;
  subtitle: string;
  address: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}> = [
  {
    title: 'Мечеть Алтан',
    subtitle: 'Церемония никаха',
    address: 'ул. Дубравная, 2В, Казань',
    href: 'https://yandex.ru/maps/?text=%D0%BC%D0%B5%D1%87%D0%B5%D1%82%D1%8C%20%D0%90%D0%BB%D1%82%D0%B0%D0%BD%2C%20%D1%83%D0%BB.%20%D0%94%D1%83%D0%B1%D1%80%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F%2C%202%D0%92%2C%20%D0%9A%D0%B0%D0%B7%D0%B0%D0%BD%D1%8C',
    imageSrc: '/nikah/altan.png',
    imageAlt: 'Мечеть Алтан'
  },
  {
    title: 'Кафе «Эмиз»',
    subtitle: 'Праздничный банкет',
    address: 'улица Сафиуллина, 29, Казань',
    href: 'https://yandex.ru/maps/?text=%D0%BA%D0%B0%D1%84%D0%B5%20%D0%AD%D0%BC%D0%B8%D0%B7%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%A1%D0%B0%D1%84%D0%B8%D1%83%D0%BB%D0%BB%D0%B8%D0%BD%D0%B0%2C%2029%2C%20%D0%9A%D0%B0%D0%B7%D0%B0%D0%BD%D1%8C',
    imageSrc: '/nikah/emiz.png',
    imageAlt: 'Кафе Эмиз'
  }
];

const dressCodeItems: Array<{ title: string; text: string; icon: LucideIcon }> = [
  {
    title: 'Закрытая одежда',
    text: 'Будем признательны за спокойный и сдержанный образ, подходящий для мечети и семейного праздника.',
    icon: Shirt
  },
  {
    title: 'Тюбетейка и платок',
    text: 'Для мужчин обязательна тюбетейка, для женщин платок. Это важная часть атмосферы и уважения к традиции.',
    icon: Sparkles
  }
];

function SectionKicker({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[#8f6e52]">
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center gap-3 px-6 py-2 text-[#d5b78e]">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#dcc5a2] to-transparent" />
      <div className="h-2 w-2 rounded-full bg-[#d1b083]" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#dcc5a2] to-transparent" />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f1e7d8] text-[#263934]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="ornament-float absolute left-[-18%] top-10 h-52 w-52 rounded-full bg-[#d6b88a]/28 blur-3xl" />
        <div className="ornament-float absolute right-[-18%] top-[18rem] h-64 w-64 rounded-full bg-[#8ba79b]/18 blur-3xl [animation-delay:1.3s]" />
        <div className="ornament-float absolute left-[8%] top-[52rem] h-36 w-36 rounded-full bg-[#d8c8ad]/32 blur-3xl [animation-delay:2.7s]" />
      </div>

      <div className="relative mx-auto max-w-[29rem] px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <section className="fade-up invitation-sheet overflow-hidden rounded-[42px]">
          <div className="px-6 pb-8 pt-8 sm:px-8">
            <div className="flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.26em] text-[#8f6e52]">
              <span>Никах</span>
              <span>Казань</span>
            </div>

            <div className="mt-8 text-center">
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#9d7c5f]">Казань · Мечеть Алтан</p>
              <h1 className="mt-5 font-heading text-[clamp(2.35rem,12vw,3.4rem)] leading-[0.9] tracking-[0.03em] text-[#233a35]">
                <span className="block">Ильнур</span>
                <span className="block py-1 text-[0.7em] text-[#c09965]">&</span>
                <span className="block">Камилла</span>
              </h1>
              <p className="mx-auto mt-5 max-w-[20rem] text-[15px] leading-7 text-[#556560]">
                С благословением Всевышнего приглашаем вас разделить с нами светлый день нашего никаха.
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="font-heading text-[clamp(1.9rem,8vw,2.5rem)] leading-tight text-[#a88355]">05 июня 2026</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-[#9d7c5f]">Пятница</p>
            </div>

            <div className="relative mt-6 aspect-[4/5] overflow-hidden rounded-[30px] border border-[#ead9c2] bg-[#f7efe2]">
              <Image
                src="/nikah/start.jpg"
                alt="Начало приглашения на никах"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 464px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="border-y border-[#ecdfce] bg-[#fcf7ef]/80 px-4 py-5">
            <NikahCountdown />
          </div>

          <div className="px-6 py-7 text-center sm:px-8">
            <p className="text-sm leading-7 text-[#5c6b66]">
              Нам будет очень радостно видеть вас рядом в этот особенный день, наполненный молитвой,
              теплом семьи и красивыми воспоминаниями.
            </p>
          </div>
        </section>

        <section className="fade-up invitation-sheet mt-4 overflow-hidden rounded-[42px] [animation-delay:120ms]">
          <div className="paper-section px-6 pb-8 pt-8 sm:px-8">
            <SectionKicker icon={HeartHandshake}>Для вас</SectionKicker>
            <h2 className="mt-4 font-heading text-[2.35rem] leading-[1.02] text-[#243b36]">Дорогие гости</h2>
            <p className="mt-4 max-w-[22rem] text-[15px] leading-7 text-[#566660]">
              Спасибо, что разделяете с нами этот важный этап жизни. Очень хотим провести его рядом с
              близкими людьми, в спокойной, тёплой и уважительной атмосфере.
            </p>
          </div>

          <SectionDivider />

          <div id="timing" className="paper-section px-6 pb-8 pt-6 sm:px-8">
            <SectionKicker icon={Clock3}>Тайминг</SectionKicker>
            <h2 className="mt-4 font-heading text-[2.2rem] leading-tight text-[#243b36]">План дня</h2>
            <div className="mt-6 space-y-6">
              {schedule.map(({ time, title, note, address }) => (
                <article
                  key={time}
                  className="grid gap-3 border-b border-[#efe2d1] pb-6 last:border-b-0 last:pb-0 sm:grid-cols-[5.2rem_1fr]"
                >
                  <div className="font-heading text-[2rem] leading-none text-[#b48d5b]">{time}</div>
                  <div>
                    <h3 className="font-heading text-[1.45rem] text-[#29443d]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#596964]">{note}</p>
                    <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#917255]">{address}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <SectionDivider />

          <div id="locations" className="paper-section px-6 pb-8 pt-6 sm:px-8">
            <SectionKicker icon={MapPin}>Локации</SectionKicker>
            <h2 className="mt-4 font-heading text-[2.2rem] leading-tight text-[#243b36]">Где пройдёт наш день</h2>
            <div className="mt-6 space-y-8">
              {locations.map(({ title, subtitle, address, href, imageSrc, imageAlt }) => (
                <article key={title} className="space-y-4">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] border border-[#ebdcc8] bg-[#f7efe2]">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 464px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-[#8f6e52]">{subtitle}</p>
                    <h3 className="mt-2 font-heading text-[1.55rem] text-[#29443d]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#596964]">{address}</p>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1 border-b border-[#b79163] pb-1 text-sm font-medium text-[#8b6948] transition-colors duration-300 hover:text-[#694c30]"
                    >
                      <span>Открыть маршрут</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <SectionDivider />

          <div className="paper-section px-6 pb-8 pt-6 sm:px-8">
            <SectionKicker icon={MoonStar}>Дресс-код</SectionKicker>
            <h2 className="mt-4 font-heading text-[2.2rem] leading-tight text-[#243b36]">Просим поддержать стиль дня</h2>

            <div className="mt-6 space-y-5">
              {dressCodeItems.map(({ title, text, icon: Icon }) => (
                <article key={title} className="flex gap-4">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0dfc6] text-[#956d43]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-[1.35rem] text-[#29443d]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#596964]">{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <SectionDivider />

          <div className="paper-section px-6 pb-9 pt-6 text-center sm:px-8">
            <SectionKicker icon={Sparkles}>С любовью</SectionKicker>
            <p className="mx-auto mt-4 max-w-[21rem] text-[15px] leading-7 text-[#596964]">
              Будем ждать вас 05 июня 2026 года и будем счастливы разделить с вами красоту этого дня.
            </p>
            <p className="mt-5 font-heading text-[1.65rem] leading-tight text-[#b48d5b] sm:text-[1.85rem]">
              Ильнур и Камилла
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
