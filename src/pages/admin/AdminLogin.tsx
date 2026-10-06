import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, ShieldAlert } from 'lucide-react';
import Artwork from '../../components/Artwork';
import Logo from '../../components/layout/Logo';
import Button from '../../components/ui/Button';
import { Field, Input } from '../../components/ui/Field';
import { DEMO_EMAIL, DEMO_PASSWORD, useAdmin } from '../../context/AdminContext';
import { isValidEmail } from '../../utils/validation';

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Enter your password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = login(email, password);
      setLoading(false);
      if (!ok) {
        setError('Incorrect email or password. Check the demo credentials below.');
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }, 600);
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  return (
    <div className="grid min-h-screen bg-carbon-950 lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:block">
        <Artwork tone="crimson" seed={21} ring={false} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/70 to-carbon-950/30" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 40% at 30% 70%, rgba(239,68,68,0.16), transparent 70%)',
          }}
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Logo />
          <div className="animate-fade-up stagger-children">
            <p className="eyebrow">Admin studio</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white">
              Run your
              <br />
              <span className="text-gradient-crimson">entire showroom</span>
              <br />
              from one place.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ash-400">
              Products, services, gallery, appointments, messages and reviews —
              managed in real time.
            </p>
          </div>
          <p className="text-xs text-ash-600 animate-fade-up delay-500">
            © {new Date().getFullYear()} Kiran Car Accessories · Gandhinagar
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden animate-fade-up">
            <Logo />
          </div>
          <h2 className="font-display text-2xl font-bold text-white animate-fade-up">
            Staff sign in
          </h2>
          <p className="mt-1.5 text-sm text-ash-400 animate-fade-up delay-100">
            This area is restricted to studio staff.
          </p>

          <form onSubmit={submit} noValidate className="mt-8 space-y-5 animate-fade-up delay-200">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-fade-up"
              >
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <Field label="Work email" name="email" required>
              <Input
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kirancaraccessories.in"
                inputMode="email"
                autoComplete="username"
              />
            </Field>
            <Field label="Password" name="password" required>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ash-500 hover:text-ash-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              <Lock className="h-4 w-4" />
              Sign in
            </Button>
          </form>

          <div className="mt-8 animate-fade-up delay-300 rounded-2xl border border-crimson-500/25 bg-crimson-500/[0.06] p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-crimson-300">
                Demo credentials
              </p>
              <button
                type="button"
                onClick={fillDemo}
                className="text-xs font-semibold text-crimson-300 underline-offset-2 hover:underline"
              >
                Autofill
              </button>
            </div>
            <p className="mt-3 font-mono text-xs text-ash-300">{DEMO_EMAIL}</p>
            <p className="mt-1 font-mono text-xs text-ash-300">{DEMO_PASSWORD}</p>
          </div>

          <a
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ash-400 hover:text-crimson-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to website
          </a>
        </div>
      </div>
    </div>
  );
}