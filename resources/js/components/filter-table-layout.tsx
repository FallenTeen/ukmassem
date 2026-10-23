import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    PanelLeft,
    PanelTop,
    SlidersHorizontal,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface FilterTableLayoutProps {
    filterLabel: string;
    filterBody: ReactNode;
    table: ReactNode;
}

const iconButtonClass =
    'rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground';

export default function FilterTableLayout({
    filterLabel,
    filterBody,
    table,
}: FilterTableLayoutProps) {
    const [open, setOpen] = useState(true);
    const [mode, setMode] = useState<'left' | 'top'>('left');

    const toggleButtons = (vertical: boolean) => (
        <div className="flex shrink-0 items-center gap-0.5">
            <button
                type="button"
                onClick={() => setMode(mode === 'left' ? 'top' : 'left')}
                title={
                    mode === 'left'
                        ? 'Pindahkan filter ke atas'
                        : 'Pindahkan filter ke samping'
                }
                className={iconButtonClass}
            >
                {mode === 'left' ? (
                    <PanelTop className="h-4 w-4" />
                ) : (
                    <PanelLeft className="h-4 w-4" />
                )}
            </button>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                title={open ? 'Sembunyikan filter' : 'Tampilkan filter'}
                className={iconButtonClass}
            >
                {open ? (
                    vertical ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronLeft className="h-4 w-4" />
                    )
                ) : vertical ? (
                    <ChevronDown className="h-4 w-4" />
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
            </button>
        </div>
    );

    if (mode === 'top') {
        return (
            <div className="flex min-h-0 flex-1 flex-col gap-4">
                <div className="shrink-0 rounded-lg border bg-background">
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                            <SlidersHorizontal className="h-4 w-4 shrink-0" />
                            {open ? filterLabel : null}
                        </span>
                        {toggleButtons(true)}
                    </div>
                    {open && (
                        <div className="flex flex-wrap items-end gap-x-4 gap-y-3 border-t p-4 [&>div]:flex-1 [&>div]:min-w-[11rem]">
                            {filterBody}
                        </div>
                    )}
                </div>

                <div className="flex min-h-0 flex-1 flex-col">{table}</div>
            </div>
        );
    }

    return (
        <div
            className={`grid min-h-0 flex-1 gap-4 ${
                open
                    ? 'md:grid-cols-[16rem_minmax(0,1fr)]'
                    : 'md:grid-cols-[auto_minmax(0,1fr)]'
            }`}
        >
            <aside className="min-h-0 md:overflow-y-auto md:pr-1">
                <div className="rounded-lg border bg-background md:sticky md:top-0">
                    <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                        <span className="flex items-center gap-2 text-sm font-semibold">
                            <SlidersHorizontal className="h-4 w-4 shrink-0" />
                            {open ? filterLabel : null}
                        </span>
                        {toggleButtons(false)}
                    </div>
                    {open && (
                        <div className="space-y-3 border-t p-4">{filterBody}</div>
                    )}
                </div>
            </aside>

            <div className="flex min-h-0 flex-1 flex-col">{table}</div>
        </div>
    );
}
