import { classNames } from '../../utils/format';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
  stagger?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'center',
  className,
  stagger = false,
}: SectionHeadingProps) {
  return (
    <div className={classNames('mb-12 max-w-2xl', align === 'center' ? 'mx-auto text-center' : '', stagger ? 'stagger-children' : '', className)}>
      {eyebrow && <p className="eyebrow mb-4 animate-fade-up">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white animate-fade-up sm:text-4xl lg:text-5xl">
        {title.split(' ').map((word, i) => (
          <span key={i} className="text-reveal" style={{ animationDelay: `${i * 80}ms` }}>
            {word}
          </span>
        ))}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-relaxed text-ash-400 animate-fade-up delay-200 sm:text-base">
          {description}
        </p>
      )}
      {action && <div className={classNames('mt-8 animate-fade-up delay-300', align === 'center' && 'flex justify-center')}>{action}</div>}
    </div>
  );
}