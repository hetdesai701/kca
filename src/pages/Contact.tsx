import { useState, type FormEvent } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Button from '../components/ui/Button';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import SectionHeading from '../components/ui/SectionHeading';
import { useForm } from '../utils/form';
import {
  emailError,
  isValidEmail,
  isValidIndianPhone,
  phoneError,
  required,
  minLen,
} from '../utils/validation';
import { settings, waLink } from '../data/settings';
import type { LucideIcon } from 'lucide-react';

const SUBJECTS = [
  'General inquiry',
  'Product availability',
  'Service booking',
  'Warranty claim',
  'Bulk / fleet enquiry',
  'Feedback',
];

const CONTACT_CARDS: { icon: LucideIcon; title: string; lines: string[]; href?: string }[] = [
  {
    icon: Phone,
    title: 'Call us',
    lines: [settings.phone, 'Mon–Sat 09:30–20:00'],
    href: 'tel:+919825012345',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    lines: ['+91 98250 12345', 'Replies within hours'],
    href: waLink('Hi Kiran Car Accessories! I have a question.'),
  },
  {
    icon: Mail,
    title: 'Email',
    lines: [settings.email, 'We reply within 1 business day'],
    href: `mailto:${settings.email}`,
  },
  {
    icon: MapPin,
    title: 'Studio',
    lines: [settings.address, settings.city],
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [reference, setReference] = useState('');

  const form = useForm({
    initialValues: { name: '', phone: '', email: '', subject: '', message: '' },
    validate: (v) => {
      const errors: Record<string, string> = {};
      if (required(v.name)) errors.name = 'Please enter your name';
      if (!isValidIndianPhone(v.phone)) errors.phone = phoneError;
      if (v.email.trim() && !isValidEmail(v.email)) errors.email = emailError;
      if (required(v.subject)) errors.subject = 'Select a subject';
      if (minLen(10)(v.message)) errors.message = 'Tell us a little more (min. 10 characters)';
      return errors;
    },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.validateNow()) return;
    form.setSubmitting(true);
    setTimeout(() => {
      setReference(`KCA-${Date.now().toString(36).toUpperCase()}`);
      setSent(true);
      form.setSubmitting(false);
    }, 700);
  };

  const reset = () => {
    setSent(false);
    form.reset();
  };

  return (
    <div className="container-x py-16 lg:py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Talk to the studio"
        description="Questions about a product, a warranty claim, or a bulk enquiry for your fleet — send a message and we will respond within one business day."
        stagger
      />

      <div className="grid gap-10 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3">
          {sent ? (
            <div className="animate-fade-up rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.07] p-8 text-center sm:p-12">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-white">
                Message sent, {form.values.name.split(' ')[0]}!
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ash-400">
                Our team will get back to you within one business day. Your
                reference:
              </p>
              <p className="mt-2 font-display text-lg font-bold tracking-widest text-crimson-300">
                {reference}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a
                  href={waLink(`${form.values.message} — ${form.values.name}, ${form.values.phone}`)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-emerald"
                >
                  <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
                </a>
                <Button variant="outline" onClick={reset}>
                  Send another message
                </Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={submit}
              noValidate
              className="rounded-3xl border border-white/[0.04] bg-carbon-900 p-6 sm:p-8 animate-fade-up"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" name="name" error={form.errors.name} required>
                  <Input name="name" value={form.values.name} onChange={form.handleChange} placeholder="Rahul Verma" autoComplete="name" />
                </Field>
                <Field label="Mobile number" name="phone" error={form.errors.phone} required>
                  <Input name="phone" value={form.values.phone} onChange={form.handleChange} placeholder="98250 12345" inputMode="tel" autoComplete="tel" />
                </Field>
                <Field label="Email (optional)" name="email" error={form.errors.email}>
                  <Input name="email" value={form.values.email} onChange={form.handleChange} placeholder="you@example.com" inputMode="email" autoComplete="email" />
                </Field>
                <Field label="Subject" name="subject" error={form.errors.subject} required>
                  <Select name="subject" value={form.values.subject} onChange={form.handleChange} className="select-dark">
                    <option value="">Select a subject…</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Message" name="message" error={form.errors.message} required>
                    <Textarea name="message" value={form.values.message} onChange={form.handleChange} placeholder="Tell us about your car and what you need…" rows={5} />
                  </Field>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="flex items-center gap-2 text-xs text-ash-500">
                  <Clock className="h-3.5 w-3.5 text-crimson-400" />
                  We reply within 1 business day
                </p>
                <Button type="submit" loading={form.submitting} size="lg">
                  Send message
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {CONTACT_CARDS.map((card) => {
              const inner = (
                <div className="animate-fade-up rounded-2xl border border-white/[0.04] bg-carbon-900 p-5 transition-all duration-300 hover:border-crimson-500/30 hover:shadow-panel-hover">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-crimson-500/10">
                    <card.icon className="h-5 w-5 text-crimson-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold text-white">
                      {card.title}
                    </h3>
                    {card.lines.map((line) => (
                      <p key={line} className="mt-0.5 text-sm text-ash-400">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );
              return card.href ? (
                <a key={card.title} href={card.href} target={card.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={card.title}>{inner}</div>
              );
            })}
          </div>

          {/* Hours */}
          <div className="animate-fade-up rounded-2xl border border-white/[0.04] bg-carbon-900 p-5">
            <h3 className="font-display text-base font-semibold text-white">Opening hours</h3>
            <ul className="mt-3 divide-y divide-white/[0.04] text-sm">
              {settings.hours.map((h) => (
                <li key={h.day} className="flex items-center justify-between py-2">
                  <span className="text-ash-400">{h.day}</span>
                  <span className="font-medium text-ash-200">
                    {h.open} – {h.close}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Map placeholder */}
          <div className="noise-overlay relative h-56 overflow-hidden rounded-2xl border border-white/[0.04] bg-carbon-900 animate-fade-up">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(239,68,68,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.25) 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-crimson-600 shadow-[0_0_24px_rgba(239,68,68,0.4)]">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <p className="mt-3 font-display text-base font-semibold text-white">
                {settings.businessName}
              </p>
              <p className="text-sm text-ash-400">
                {settings.address}, {settings.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}