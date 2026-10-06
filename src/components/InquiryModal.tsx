import { useState, type FormEvent } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import Button from './ui/Button';
import { Field, Input, Textarea } from './ui/Field';
import Modal from './ui/Modal';
import { useForm } from '../utils/form';
import {
  isValidEmail,
  isValidIndianPhone,
  emailError,
  phoneError,
  formatPhoneDisplay,
} from '../utils/validation';
import { waLink } from '../data/settings';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  subject: string;
  subjectType: 'product' | 'service' | 'general';
}

interface InquiryValues {
  name: string;
  phone: string;
  email: string;
  message: string;
  [key: string]: string;
}

export default function InquiryModal({ open, onClose, subject, subjectType }: InquiryModalProps) {
  const [done, setDone] = useState(false);
  const [reference, setReference] = useState('');

  const form = useForm<InquiryValues>({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      message: `I'm interested in ${
        subjectType === 'product'
          ? 'the product'
          : subjectType === 'service'
            ? 'the service'
            : 'your services'
      }: ${subject}. Please share pricing and availability.`,
    },
    validate: (v) => {
      const errors: Record<string, string> = {};
      if (!v.name.trim()) errors.name = 'Please enter your name';
      if (!isValidIndianPhone(v.phone)) errors.phone = phoneError;
      if (v.email.trim() && !isValidEmail(v.email)) errors.email = emailError;
      if (v.message.trim().length < 10)
        errors.message = 'Tell us a little more (minimum 10 characters)';
      return errors;
    },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.validateNow()) return;
    form.setSubmitting(true);
    setTimeout(() => {
      setReference(`KCA-${Date.now().toString(36).toUpperCase()}`);
      setDone(true);
      form.setSubmitting(false);
    }, 700);
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setDone(false);
      form.reset();
    }, 250);
  };

  const waMessage = `${form.values.message} — ${form.values.name}, ${formatPhoneDisplay(form.values.phone)}`;

  return (
    <Modal open={open} onClose={close} title={done ? 'Inquiry received' : 'Request a quote'}>
      {done ? (
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h4 className="font-display text-xl font-semibold text-white">
            Thanks, {form.values.name.split(' ')[0]}!
          </h4>
          <p className="mt-2 text-sm text-zinc-400">
            Our team will call you within 2 business hours. Your reference:
          </p>
          <p className="mt-2 font-display text-lg font-bold tracking-widest text-gold-300">
            {reference}
          </p>
          <a
            href={waLink(waMessage)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
          >
            <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
          </a>
          <Button variant="ghost" className="mt-3 w-full" onClick={close}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="space-y-4">
            <Field label="Full name" name="name" error={form.errors.name} required>
              <Input
                name="name"
                value={form.values.name}
                onChange={form.handleChange}
                placeholder="e.g. Rahul Verma"
                autoComplete="name"
              />
            </Field>
            <Field
              label="Mobile number"
              name="phone"
              error={form.errors.phone}
              hint="10-digit Indian mobile — we'll call to confirm your slot."
              required
            >
              <Input
                name="phone"
                value={form.values.phone}
                onChange={form.handleChange}
                placeholder="98250 12345"
                inputMode="tel"
                autoComplete="tel"
              />
            </Field>
            <Field label="Email (optional)" name="email" error={form.errors.email}>
              <Input
                name="email"
                value={form.values.email}
                onChange={form.handleChange}
                placeholder="you@example.com"
                inputMode="email"
                autoComplete="email"
              />
            </Field>
            <Field label="Message" name="message" error={form.errors.message} required>
              <Textarea
                name="message"
                value={form.values.message}
                onChange={form.handleChange}
                rows={4}
              />
            </Field>
            <Button type="submit" loading={form.submitting} className="w-full" size="lg">
              Send inquiry
            </Button>
            <p className="text-center text-xs text-zinc-500">
              Prefer chat?{' '}
              <a
                href={waLink(`Hi, I'm interested in: ${subject}`)}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-gold-400 hover:text-gold-300"
              >
                Message us on WhatsApp
              </a>
            </p>
          </div>
        </form>
      )}
    </Modal>
  );
}
