import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../data/photos';

const initialState = {
  name: '',
  phone: '',
  email: '',
  service: services[0].title,
  date: '',
  message: '',
};

const FIELD_CLASS =
  'w-full bg-transparent border-b border-hairline/70 focus:border-bone outline-none py-3 font-body text-bone placeholder:text-ash transition-colors duration-300';

export default function BookingForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setForm(initialState);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
            Full Name
          </label>
          <input
            required
            type="text"
            value={form.name}
            onChange={update('name')}
            placeholder="Your name"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
            Phone
          </label>
          <input
            required
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder="09XX XXX XXX"
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="you@email.com"
            className={FIELD_CLASS}
          />
        </div>
        <div>
          <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
            Preferred Date
          </label>
          <input
            required
            type="date"
            value={form.date}
            onChange={update('date')}
            className={`${FIELD_CLASS} [color-scheme:dark]`}
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
          Service
        </label>
        <select
          value={form.service}
          onChange={update('service')}
          className={`${FIELD_CLASS} [color-scheme:dark]`}
        >
          {services.map((s) => (
            <option key={s.id} value={s.title} className="bg-ink">
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
          Message
        </label>
        <textarea
          value={form.message}
          onChange={update('message')}
          placeholder="Tell us about your day, venue, and vision..."
          rows={4}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-2 self-start border border-bone/70 text-bone text-xs tracking-[0.25em] uppercase px-9 py-4 hover:bg-bone hover:text-ink transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending...' : 'Send Booking Request'}
      </button>

      <AnimatePresence mode="wait">
        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-body text-sm text-bone border border-hairline/60 px-5 py-4"
          >
            Your booking request has been sent successfully. We&rsquo;ll be in
            touch shortly.
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-body text-sm text-parchment border border-hairline/60 px-5 py-4"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
