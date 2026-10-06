import { useMemo, useState } from 'react';
import { CheckCircle2, PenLine } from 'lucide-react';
import ReviewCard from '../components/ReviewCard';
import SectionHeading from '../components/ui/SectionHeading';
import RatingStars from '../components/ui/RatingStars';
import Button from '../components/ui/Button';
import { Field, Input, Select, Textarea } from '../components/ui/Field';
import { useForm } from '../utils/form';
import {
  emailError,
  isValidEmail,
  isValidIndianPhone,
  phoneError,
  required,
  minLen,
} from '../utils/validation';
import { reviews as seedReviews } from '../data/reviews';
import { services } from '../data/services';
import { classNames, formatDate, uid } from '../utils/format';
import type { Review } from '../types';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(seedReviews);
  const [ratingFilter, setRatingFilter] = useState<string>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const approved = useMemo(() => reviews.filter((r) => r.approved), [reviews]);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    approved.forEach((r) => {
      counts[r.rating - 1] += 1;
    });
    return counts.reverse(); // index 0 = 5 stars
  }, [approved]);

  const average = approved.length
    ? (approved.reduce((sum, r) => sum + r.rating, 0) / approved.length).toFixed(1)
    : '0.0';

  const filtered = approved
    .filter((r) => ratingFilter === 'All' || r.rating === Number(ratingFilter))
    .filter((r) => serviceFilter === 'All' || r.service === serviceFilter);

  const form = useForm({
    initialValues: {
      name: '',
      vehicle: '',
      phone: '',
      email: '',
      service: '',
      title: '',
      content: '',
    },
    validate: (v) => {
      const errors: Record<string, string> = {};
      if (required(v.name)) errors.name = 'Please enter your name';
      if (required(v.vehicle)) errors.vehicle = 'Which car do you drive?';
      if (!isValidIndianPhone(v.phone)) errors.phone = phoneError;
      if (required(v.service)) errors.service = 'Select the service you used';
      if (required(v.title)) errors.title = 'Give your review a title';
      if (minLen(20)(v.content)) errors.content = 'Tell us a little more (min. 20 characters)';
      if (v.email && !isValidEmail(v.email)) errors.email = emailError;
      return errors;
    },
  });

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.validateNow()) return;
    form.setSubmitting(true);
    setTimeout(() => {
      const review: Review = {
        id: uid('rv'),
        name: form.values.name.trim(),
        vehicle: form.values.vehicle.trim(),
        service: form.values.service,
        rating: userRating,
        date: new Date().toISOString().slice(0, 10),
        title: form.values.title.trim(),
        content: form.values.content.trim(),
        approved: false,
      };
      setReviews((prev) => [review, ...prev]);
      form.setSubmitting(false);
      setShowForm(false);
      setJustSubmitted(true);
      form.reset();
      setTimeout(() => setJustSubmitted(false), 6000);
    }, 700);
  };

  return (
    <div className="container-x py-16 lg:py-20">
      <SectionHeading
        eyebrow="Reviews"
        title="What drivers say about us"
        description="Every review is from a real visit to our studio. New reviews are moderated before they go live."
        stagger
      />

      {/* Summary */}
      <div className="mb-12 animate-fade-up grid gap-6 rounded-3xl border border-white/[0.04] bg-carbon-900 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-center md:gap-12">
        <div className="text-center md:text-left">
          <p className="font-display text-6xl font-bold text-white">{average}</p>
          <RatingStars rating={Number(average)} size={18} className="mt-2" />
          <p className="mt-2 text-xs text-ash-500">{approved.length} verified reviews</p>
        </div>
        <div className="space-y-2">
          {distribution.map((count, i) => {
            const stars = 5 - i;
            const pct = approved.length ? (count / approved.length) * 100 : 0;
            return (
              <button
                key={stars}
                onClick={() => setRatingFilter(ratingFilter === String(stars) ? 'All' : String(stars))}
                className={classNames(
                  'flex w-full items-center gap-3 rounded-lg px-2 py-1 transition-all duration-200',
                  ratingFilter === String(stars) ? 'bg-crimson-500/10' : 'hover:bg-white/[0.03]',
                )}
                aria-label={`Filter by ${stars} star reviews`}
              >
                <span className="w-8 text-right text-xs font-semibold text-ash-400">
                  {stars} ★
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-carbon-800">
                  <div
                    className="h-full rounded-full bg-crimson-500 transition-all duration-500 ease-butter"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-ash-500">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters + write */}
      <div className="mb-8 animate-fade-up delay-200 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            aria-label="Filter by service"
            className="w-52 select-dark"
          >
            <option value="All">All services</option>
            {services.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </Select>
          {ratingFilter !== 'All' && (
            <button
              onClick={() => setRatingFilter('All')}
              className="inline-flex items-center gap-1.5 rounded-full bg-crimson-500/10 px-3 py-1.5 text-xs font-semibold text-crimson-300 transition-colors hover:bg-crimson-500/20"
            >
              {ratingFilter} stars · clear
            </button>
          )}
          <p className="text-sm text-ash-500">
            {filtered.length} review{filtered.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button
          variant={showForm ? 'carbon' : 'outline'}
          onClick={() => setShowForm((v) => !v)}
        >
          <PenLine className="h-4 w-4" />
          {showForm ? 'Close form' : 'Write a review'}
        </Button>
      </div>

      {justSubmitted && (
        <div className="mb-8 animate-fade-up flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Thank you! Your review is pending moderation and will appear once approved.
        </div>
      )}

      {/* Write review form */}
      {showForm && (
        <form
          onSubmit={submitReview}
          noValidate
          className="mb-12 animate-fade-up delay-200 rounded-3xl border border-white/[0.06] bg-carbon-900 p-6 sm:p-8"
        >
          <h3 className="font-display text-xl font-semibold text-white">Share your experience</h3>
          <p className="mt-1 text-sm text-ash-500">
            Reviews are published after a quick moderation check.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Your name" name="name" error={form.errors.name} required>
              <Input name="name" value={form.values.name} onChange={form.handleChange} placeholder="Rahul Verma" />
            </Field>
            <Field label="Your car" name="vehicle" error={form.errors.vehicle} required>
              <Input name="vehicle" value={form.values.vehicle} onChange={form.handleChange} placeholder="Hyundai Creta" />
            </Field>
            <Field label="Mobile number" name="phone" error={form.errors.phone} required hint="We verify reviews against bookings.">
              <Input name="phone" value={form.values.phone} onChange={form.handleChange} placeholder="98250 12345" inputMode="tel" />
            </Field>
            <Field label="Service used" name="service" error={form.errors.service} required>
              <Select name="service" value={form.values.service} onChange={form.handleChange} className="select-dark">
                <option value="">Select a service…</option>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Email (optional)" name="email" error={form.errors.email}>
              <Input name="email" value={form.values.email} onChange={form.handleChange} placeholder="you@example.com" inputMode="email" />
            </Field>
            <Field label="Headline" name="title" error={form.errors.title} required>
              <Input name="title" value={form.values.title} onChange={form.handleChange} placeholder="Worth every rupee" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Your rating" name="rating" required>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      className="rounded p-1 transition-all duration-150 hover:scale-110"
                    >
                      <span
                        className={classNames(
                          'flex h-8 w-8 items-center justify-center rounded-full text-lg',
                          star <= userRating ? 'bg-crimson-500/20' : 'bg-carbon-800',
                        )}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Your review" name="content" error={form.errors.content} required>
                <Textarea name="content" value={form.values.content} onChange={form.handleChange} placeholder="How was the work? What should others know?" rows={4} />
              </Field>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={form.submitting}>
              Submit for review
            </Button>
          </div>
        </form>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ash-500 animate-fade-up">
          No reviews match this filter yet.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((review, i) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-ash-600">
        Showing reviews verified up to {formatDate(new Date().toISOString().slice(0, 10))}.
      </p>
    </div>
  );
}