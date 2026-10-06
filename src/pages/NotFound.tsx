import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center animate-fade-up">
      <p className="font-display text-8xl font-bold text-gradient-crimson">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white">
        This page took a wrong turn
      </h1>
      <p className="mt-2 max-w-sm text-sm text-ash-400">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-8 btn btn-primary btn-lg"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>
    </div>
  );
}