import React, { useEffect, useState } from 'react';
import { AppSettings } from '../types';
import { Feather, ShieldAlert, BookOpen } from 'lucide-react';

interface VisitorsBookViewProps {
  settings: AppSettings;
}

interface GuestbookMessage {
  id: string;
  name?: string;
  country?: string;
  message: string;
  createdAt: string;
}

const formatEntryDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export const VisitorsBookView: React.FC<VisitorsBookViewProps> = ({ settings }) => {
  const isDark = settings.theme === 'candlelight' || settings.theme === 'stone';

  const [entries, setEntries] = useState<GuestbookMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [name, setName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [anonymous, setAnonymous] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/guestbook')
      .then(res => res.ok ? res.json() : [])
      .then(data => setEntries(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setNotice(null);
    setError(null);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          country: country.trim(),
          message: message.trim(),
          anonymous
        })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Your message could not be left just now. Please try again in a little while.');
        return;
      }

      setNotice(data.message || 'Thank you. Your message will appear once it has been quietly approved.');
      setName('');
      setCountry('');
      setMessage('');
      setAnonymous(false);
    } catch {
      setError('Could not connect to the chapel. Please try again in a little while.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3">
        <h1 className={`font-heading text-3xl sm:text-4xl font-semibold tracking-wide ${
          isDark ? 'text-[#f5ebd8]' : 'text-[#1c2536]'
        }`}>
          Visitors' Book
        </h1>

        <p className={`text-sm sm:text-base font-sans leading-relaxed ${
          isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
        }`}>
          Leave a short message, prayer, or blessing for everyone who visits this little chapel.
        </p>

        <p className={`text-xs sm:text-sm font-sans italic leading-relaxed ${
          isDark ? 'text-stone-400' : 'text-stone-500'
        }`}>
          This is a quiet place for encouragement, prayer intentions and words of hope from visitors around the world.
        </p>
      </div>

      {/* New Entry Form */}
      <div className={`p-6 sm:p-8 rounded-2xl border space-y-5 shadow-sm ${
        isDark ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]' : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
      }`}>
        <div className="flex items-center space-x-2.5 border-b pb-4 border-stone-400/20">
          <Feather className="w-4.5 h-4.5 text-[#D4AF37]" />
          <h2 className="font-heading text-xl sm:text-2xl font-bold">
            Sign the Book
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="guestbook-name" className={`block text-sm font-mono mb-1.5 font-semibold ${
                isDark ? 'text-stone-200' : 'text-stone-900'
              }`}>
                Display Name <span className="font-normal opacity-70">(optional)</span>
              </label>
              <input
                id="guestbook-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={50}
                disabled={anonymous}
                placeholder="Your first name"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#c5a059] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDark
                    ? 'bg-[#24211c] border-[#3a342c] text-[#ece4d6] placeholder-stone-400'
                    : 'bg-white border-[#ded1be] text-stone-900 placeholder-stone-500'
                }`}
              />
            </div>

            <div>
              <label htmlFor="guestbook-country" className={`block text-sm font-mono mb-1.5 font-semibold ${
                isDark ? 'text-stone-200' : 'text-stone-900'
              }`}>
                Country <span className="font-normal opacity-70">(optional)</span>
              </label>
              <input
                id="guestbook-country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                maxLength={56}
                placeholder="Where you are praying from"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#c5a059] ${
                  isDark
                    ? 'bg-[#24211c] border-[#3a342c] text-[#ece4d6] placeholder-stone-400'
                    : 'bg-white border-[#ded1be] text-stone-900 placeholder-stone-500'
                }`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="guestbook-message" className={`block text-sm font-mono mb-1.5 font-semibold ${
              isDark ? 'text-stone-200' : 'text-stone-900'
            }`}>
              Prayer or Message <span className="text-[#c5a059]">(required)</span>
            </label>
            <textarea
              id="guestbook-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              required
              placeholder="Lord, bring peace to all who visit today..."
              className={`w-full p-4 text-base rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#c5a059] ${
                isDark
                  ? 'bg-[#24211c] border-[#3a342c] text-[#ece4d6] placeholder-stone-400'
                  : 'bg-white border-[#ded1be] text-stone-900 placeholder-stone-500'
              }`}
            />
            <div className="text-right text-xs font-mono text-stone-400 mt-1" aria-hidden="true">
              {message.length}/200
            </div>
          </div>

          <label
            htmlFor="guestbook-anonymous"
            className={`flex items-start gap-3 cursor-pointer select-none text-sm ${
              isDark ? 'text-stone-300' : 'text-stone-700'
            }`}
          >
            <input
              id="guestbook-anonymous"
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-[#c5a059] focus:outline-none focus:ring-2 focus:ring-[#c5a059]"
            />
            <span>Post anonymously</span>
          </label>

          <div className="flex flex-col items-center space-y-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting || message.trim().length === 0}
              className={`w-full sm:w-auto min-w-[220px] py-3 px-8 rounded-xl font-bold text-base transition-all shadow-md flex items-center justify-center space-x-2 ${
                isSubmitting || message.trim().length === 0
                  ? 'bg-stone-700 text-stone-400 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-amber-600 to-[#c5a059] text-stone-950 hover:brightness-110 cursor-pointer'
              }`}
            >
              <span>{isSubmitting ? 'Leaving Message...' : 'Leave Message'}</span>
            </button>

            <p className={`text-xs font-sans text-center ${
              isDark ? 'text-stone-400' : 'text-stone-500'
            }`}>
              Messages are gently reviewed before they appear - thank you for your patience.
            </p>
          </div>

          {notice && (
            <div
              role="status"
              aria-live="polite"
              className="p-4 rounded-xl border border-emerald-600/30 bg-emerald-600/10 text-emerald-300 text-sm font-sans"
            >
              {notice}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-300 text-sm font-sans flex items-start space-x-2.5"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Entries */}
      <div className="space-y-5">
        <div className="flex items-center space-x-2.5 border-b pb-2 border-stone-400/20">
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <h3 className={`text-xs font-mono tracking-widest uppercase ${
            isDark ? 'text-[#C2B7A5]' : 'text-stone-600'
          }`}>
            Messages Left in the Book
          </h3>
        </div>

        {isLoading ? (
          <p className="text-center py-10 text-stone-500 font-scripture italic">
            Opening the book...
          </p>
        ) : entries.length === 0 ? (
          <p className="text-center py-10 text-stone-500 font-scripture italic">
            The book is open and waiting for its first message.
          </p>
        ) : (
          entries.map(entry => (
            <div
              key={entry.id}
              className={`p-6 sm:p-7 rounded-2xl border shadow-sm ${
                isDark
                  ? 'bg-[#1b1916] border-[#332e27] text-[#ece4d6]'
                  : 'bg-[#faf6ee] border-[#ebdcc8] text-[#2d2922]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <span className="text-lg leading-none mt-1" aria-hidden="true">🕯️</span>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="font-heading text-lg sm:text-xl font-semibold">
                      {entry.name || 'Anonymous'}
                      {entry.country && (
                        <span className="text-sm font-mono font-normal text-[#c5a059] ml-2">
                          {entry.country}
                        </span>
                      )}
                    </span>
                    <time
                      dateTime={entry.createdAt}
                      className="text-xs font-mono text-stone-400"
                    >
                      {formatEntryDate(entry.createdAt)}
                    </time>
                  </div>
                  <p className="font-sans text-sm sm:text-base leading-relaxed">
                    {entry.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
