import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { services } from '../data/services';
import { waLink } from '../data/settings';
import { classNames } from '../utils/format';
import type { Service } from '../types';

const STEPS = ['Service', 'Vehicle', 'Date & Time', 'Your details'] as const;

const MAKES = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata Motors',
  'Honda',
  'Kia',
  'Toyota',
  'Mahindra',
  'MG',
  'Skoda',
  'Volkswagen',
  'Other',
];

const YEARS = Array.from({ length: 37 }, (_, i) => String(2026 - i));

const TIME_SLOTS = ['09:30', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30'];

interface AppointmentForm {
  service: string;
  make: string;
  model: string;
  year: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const INITIAL: AppointmentForm = {
  service: '',
  make: '',
  model: '',
  year: '',
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  notes: '',
};

const todayISO = new Date().toISOString().slice(0, 10);

function validateStep(step: number, values: AppointmentForm): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 0) {
    if (!values.service) errors.service = 'Select a service to continue';
  }
  if (step === 1) {
    if (!values.make) errors.make = 'Select your car brand';
    if (!values.model.trim()) errors.model = 'Enter your model';
    if (!values.year) errors.year = 'Select the year';
  }
  if (step === 2) {
    if (!values.date) errors.date = 'Pick a date';
    else if (values.date < todayISO) errors.date = 'Date cannot be in the past';
    if (!values.time) errors.time = 'Pick a time slot';
  }
  if (step === 3) {
    if (!values.name.trim()) errors.name = 'Please enter your name';
    if (!/^(?:\+91|0)?[6-9]\d{9}$/.test(values.phone.trim()))
      errors.phone = 'Enter a valid 10-digit Indian mobile number';
    if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      errors.email = 'Enter a valid email address';
  }
  return errors;
}

export default function Appointment() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<AppointmentForm>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState('');

  const selectedService: Service | undefined = services.find(
    (s) => s.slug === values.service,
  );

  const summary = useMemo(
    () => [
      { label: 'Service', value: selectedService?.name ?? '—' },
      {
        label: 'Vehicle',
        value: values.make && values.model ? `${values.make} ${values.model}` : '—',
      },
      { label: 'Year', value: values.year || '—' },
      { label: 'Date', value: values.date || '—' },
      { label: 'Time', value: values.time || '—' },
    ],
    [selectedService, values.make, values.model, values.year, values.date, values.time],
  );

  const set = <K extends keyof AppointmentForm>(key: K, value: AppointmentForm[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const next = () => {
    const errs = validateStep(step, values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep((s) => Math.min(3, s + 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    const errs = validateStep(3, values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setReference(`KCA-APT-${Date.now().toString(36).toUpperCase()}`);
      setSubmitting(false);
      setStep(4);
    }, 800);
  };

  const reset = () => {
    setValues(INITIAL);
    setErrors({});
    setStep(0);
    setReference('');
  };

  return (
    <div className="container-x py-16 lg:py-20">
      <SectionHeading
        eyebrow="Appointment"
        title="Book your slot"
        description="Reserve a bay at our Ring Road studio. We confirm every booking personally — usually on WhatsApp within the hour."
        stagger
      />

      {reference ? (
        /* ============ SUCCESS ============ */
        <div className="mx-auto max-w-2xl animate-fade-up">
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.07] p-8 text-center sm:p-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white">
              Appointment booked
            </h2>
            <p className="mt-2 text-sm text-ash-400">
              Reference <span className="font-mono font-bold text-crimson-300">{reference}</span>
            </p>
            <dl className="mt-8 space-y-3 rounded-2xl border border-white/[0.04] bg-carbon-900 p-6 text-left">
              {summary.map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 text-sm">
                  <dt className="text-ash-500">{row.label}</dt>
                  <dd className="font-medium text-white">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs leading-relaxed text-ash-500">
              Our team will call {values.name.split(' ')[0]} at {values.phone} to confirm.
              Prefer instant confirmation?
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={waLink(
                  `Hi! Booking confirmation for ${reference}: ${summary.map((s) => `${s.label} ${s.value}`).join(', ')}. Please confirm my slot.`,
                )}
                target="_blank"
                rel="noreferrer"
                className="btn btn-emerald"
              >
                <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
              </a>
              <Button variant="outline" onClick={reset}>
                Book another appointment
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ============ WIZARD ============ */
        <div className="mx-auto max-w-3xl">
          {/* Progress */}
          <ol className="mb-10 flex items-center animate-fade-up">
            {STEPS.map((label, i) => (
              <li key={label} className={classNames('flex items-center', i < STEPS.length - 1 && 'flex-1')}>
                <div className="flex flex-col items-center">
                  <span
                    className={classNames(
                      'flex h-10 w-10 items-center justify-center rounded-full border font-display text-sm font-bold transition-all duration-300',
                      i < step
                        ? 'border-crimson-500 bg-crimson-500 text-white'
                        : i === step
                          ? 'border-crimson-500 bg-crimson-500/10 text-crimson-300 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                          : 'border-white/10 bg-carbon-900 text-ash-500',
                    )}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span
                    className={classNames(
                      'mt-2 hidden text-xs font-medium sm:block',
                      i === step ? 'text-crimson-300' : 'text-ash-500',
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={classNames(
                      'mx-2 mb-0 h-px flex-1 sm:mb-5 transition-colors duration-300',
                      i < step ? 'bg-crimson-500' : 'bg-white/10',
                    )}
                  />
                )}
              </li>
            ))}
          </ol>

          <div
            key={step}
            className="animate-fade-up rounded-3xl border border-white/[0.04] bg-carbon-900 p-6 sm:p-8"
          >
            {/* STEP 1 — Service */}
            {step === 0 && (
              <fieldset>
                <legend className="font-display text-xl font-semibold text-white">
                  What does your car need?
                </legend>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {services.filter((s) => s.visible).map((service, i) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => set('service', service.slug)}
                      className={classNames(
                        'animate-fade-up rounded-2xl border p-4 text-left transition-all duration-200 ease-butter',
                        values.service === service.slug
                          ? 'border-crimson-500/60 bg-crimson-500/[0.05] shadow-[0_0_24px_rgba(239,68,68,0.1)]'
                          : 'border-white/[0.04] hover:border-white/20 hover:bg-carbon-800 hover:shadow-panel',
                      )}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-display text-sm font-semibold text-white">
                          {service.name}
                        </p>
                        {values.service === service.slug && (
                          <Check className="h-4 w-4 shrink-0 text-crimson-400" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-ash-500">{service.tagline}</p>
                      <p className="mt-2 text-xs font-semibold text-crimson-300">
                        {formatINR(service.priceFrom)} · {service.duration}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.service && (
                  <p className="mt-3 text-xs text-red-400" role="alert">{errors.service}</p>
                )}
              </fieldset>
            )}

            {/* STEP 2 — Vehicle */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold text-white">
                  Tell us about your car
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Brand" name="make" error={errors.make} required>
                    <Select name="make" value={values.make} onChange={(e) => set('make', e.target.value)} className="select-dark">
                      <option value="">Select brand…</option>
                      {MAKES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Model" name="model" error={errors.model} required>
                    <Input name="model" value={values.model} onChange={(e) => set('model', e.target.value)} placeholder="e.g. Creta, Nexon, City" />
                  </Field>
                  <Field label="Year" name="year" error={errors.year} required>
                    <Select name="year" value={values.year} onChange={(e) => set('year', e.target.value)} className="select-dark">
                      <option value="">Select year…</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Fuel type (optional)" name="fuel">
                    <Select value="" onChange={() => undefined} className="select-dark">
                      <option value="">Not specified</option>
                      <option value="petrol">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="cng">CNG</option>
                      <option value="ev">Electric</option>
                    </Select>
                  </Field>
                </div>
              </div>
            )}

            {/* STEP 3 — Date & Time */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold text-white">
                  Pick a date and time
                </h2>
                <Field label="Preferred date" name="date" error={errors.date} required>
                  <Input
                    name="date"
                    type="date"
                    min={todayISO}
                    value={values.date}
                    onChange={(e) => set('date', e.target.value)}
                  />
                </Field>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ash-400">
                    Available slots <span className="text-crimson-400">*</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => set('time', slot)}
                        className={classNames(
                          'rounded-xl border py-2.5 text-sm font-medium transition-all duration-200',
                          values.time === slot
                            ? 'border-crimson-500/60 bg-crimson-500/10 text-crimson-300 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
                            : 'border-white/[0.04] text-ash-400 hover:border-white/20 hover:text-ash-200 hover:bg-white/[0.03]',
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  {errors.time && (
                    <p className="mt-2 text-xs text-red-400" role="alert">{errors.time}</p>
                  )}
                </div>
                {selectedService && (
                  <p className="rounded-xl border border-white/[0.04] bg-carbon-800 px-4 py-3 text-xs text-ash-400">
                    Estimated duration for <span className="font-semibold text-white">{selectedService.name}</span>:{' '}
                    <span className="font-semibold text-crimson-300">{selectedService.duration}</span>
                  </p>
                )}
              </div>
            )}

            {/* STEP 4 — Details */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-display text-xl font-semibold text-white">
                  Almost done — your details
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" name="name" error={errors.name} required>
                    <Input name="name" value={values.name} onChange={(e) => set('name', e.target.value)} placeholder="Rahul Verma" autoComplete="name" />
                  </Field>
                  <Field label="Mobile number" name="phone" error={errors.phone} required hint="We call to confirm every booking.">
                    <Input name="phone" value={values.phone} onChange={(e) => set('phone', e.target.value)} placeholder="98250 12345" inputMode="tel" autoComplete="tel" />
                  </Field>
                  <Field label="Email (optional)" name="email" error={errors.email}>
                    <Input name="email" value={values.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" inputMode="email" autoComplete="email" />
                  </Field>
                  <Field label="Notes (optional)" name="notes">
                    <Input name="notes" value={values.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Anything we should know?" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Review your booking">
                      <dl className="space-y-2 rounded-xl border border-white/[0.04] bg-carbon-800 p-4 text-sm">
                        {summary.map((row) => (
                          <div key={row.label} className="flex justify-between gap-4">
                            <dt className="text-ash-500">{row.label}</dt>
                            <dd className="font-medium text-white">{row.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-white/[0.04] pt-6">
              {step > 0 ? (
                <Button variant="ghost" onClick={back}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-medium text-ash-400 hover:text-crimson-300 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Browse services
                </Link>
              )}
              {step < 3 ? (
                <Button onClick={next}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={submit} loading={submitting} size="lg">
                  <CalendarCheck className="h-4 w-4" /> Confirm booking
                </Button>
              )}
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-ash-500">
            Free rescheduling up to 2 hours before your slot · {services.length} services available
          </p>
        </div>
      )}
    </div>
  );
}

function formatINR(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}