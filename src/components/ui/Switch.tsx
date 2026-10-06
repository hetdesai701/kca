import { classNames } from '../../utils/format';

interface SwitchProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? 'toggle'}
      onClick={() => onChange(!checked)}
      className={classNames(
        'relative h-6 w-11 shrink-0 rounded-full transition-all duration-200 ease-butter focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500/50',
        checked ? 'bg-crimson-600' : 'bg-carbon-600',
      )}
    >
      <span
        className={classNames(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-all duration-200 ease-butter',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}