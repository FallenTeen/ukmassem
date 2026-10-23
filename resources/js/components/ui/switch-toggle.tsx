import { cn } from '@/lib/utils';

export default function SwitchToggle({
    checked,
    onCheckedChange,
    disabled,
}: {
    checked: boolean;
    onCheckedChange: (next: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-50',
                checked ? 'bg-primary' : 'bg-input',
            )}
        >
            <span
                className={cn(
                    'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm transition-transform',
                    checked ? 'translate-x-4' : 'translate-x-0.5',
                )}
            />
        </button>
    );
}
