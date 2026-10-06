import { classNames } from '../../utils/format';

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (tab: T) => void;
  className?: string;
}

export function Tabs<T extends string>({ tabs, active, onChange, className }: TabsProps<T>) {
  return (
    <div className={classNames('flex flex-wrap gap-2', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={classNames(
            'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200',
            active === tab.id
              ? 'border-crimson-500/60 bg-crimson-500/10 text-crimson-300 shadow-[0_0_0_1px_rgba(239,68,68,0.2)]'
              : 'border-white/10 text-ash-400 hover:border-white/20 hover:text-ash-200 hover:bg-white/[0.03]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}