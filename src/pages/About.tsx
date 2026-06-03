import { useState } from 'react';
import { useAppStore } from '../store';
import { getTranslation } from '../i18n';

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      className={`flex-shrink-0 w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 transition-transform ${open ? 'rotate-45 bg-slate-50' : ''}`}
      aria-hidden
    >
      +
    </span>
  );
}

export const About = () => {
  const { locale } = useAppStore();
  const t = getTranslation(locale);
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const supportEmail = t.about.contact.email.replace('#', '@');
  // GitHub renders .md automatically, so the user guide is best viewed there
  // rather than served as a raw file by GitHub Pages.
  const repoBase = (
    import.meta.env.VITE_REPO_URL || 'https://github.com/badhope/MindMirror'
  ).replace(/\/$/, '');
  const guideHref = `${repoBase}/blob/main/${locale === 'zh' ? 'USER_GUIDE.zh-CN.md' : 'USER_GUIDE.md'}`;

  return (
    <div className="max-w-3xl mx-auto space-y-14 sm:space-y-20">
      <header className="text-center pt-4 sm:pt-8">
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 tracking-tight">
          {t.about.title}
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-slate-600 max-w-xl mx-auto">
          {t.about.subtitle}
        </p>
      </header>

      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-4">
          {t.about.intro.title}
        </h2>
        <p className="text-slate-700 leading-relaxed text-base sm:text-lg">{t.about.intro.body}</p>
        <ul className="mt-5 space-y-2.5">
          {t.about.intro.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 text-slate-700">
              <span className="text-emerald-500 mt-1" aria-hidden>
                ✓
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-5">
          {t.about.who.title}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {t.about.who.items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-6">
          {t.about.how.title}
        </h2>
        <ol className="grid sm:grid-cols-2 gap-4">
          {t.about.how.steps.map(s => (
            <li
              key={s.step}
              className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm flex gap-4"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                {s.step}
              </span>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 mb-5">
          {t.about.faq.title}
        </h2>
        <div className="space-y-2.5">
          {t.about.faq.items.map((item, i) => {
            const open = openIdx === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left"
                  aria-expanded={open}
                >
                  <span className="font-medium text-slate-800">{item.q}</span>
                  <PlusMinus open={open} />
                </button>
                {open && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-slate-600 text-sm sm:text-base leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-6 sm:p-8 border border-emerald-100">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-3">
          {t.about.privacy.title}
        </h2>
        <p className="text-slate-700 leading-relaxed">{t.about.privacy.body}</p>
      </section>

      <section className="rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 sm:p-8 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">{t.about.contact.title}</h2>
        <p className="text-slate-300 mb-4">{t.about.contact.description}</p>
        <a
          href={`mailto:${supportEmail}`}
          className="inline-block px-6 py-3 bg-white text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-colors"
        >
          {supportEmail}
        </a>
        <p className="text-xs text-slate-400 mt-3">{t.about.contact.emailNote}</p>
      </section>

      <section className="text-center">
        <p className="text-slate-600 mb-2">{t.about.readMore}</p>
        <a
          href={guideHref}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-4"
        >
          {t.about.guide} →
        </a>
      </section>
    </div>
  );
};
