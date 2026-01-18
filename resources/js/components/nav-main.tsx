import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { downloadFileWithProgress, resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';


function isDownloadHref(href: NavItem['href']) {
    return resolveUrl(href).includes('/export-pdf');
}

export function NavMain({
    items = [],
}: {
    items: Array<NavItem | (Omit<NavItem, 'href'> & { items: NavItem[] })>;
}) {
    const page = usePage();
    const [downloadOpen, setDownloadOpen] = useState(false);
    const [downloadPercent, setDownloadPercent] = useState<number | null>(
        null,
    );
    const [downloadLoaded, setDownloadLoaded] = useState(0);
    const [downloadTotal, setDownloadTotal] = useState<number | null>(null);
    const [downloadState, setDownloadState] = useState<
        'starting' | 'downloading' | 'saving'
    >('starting');
    const [downloadError, setDownloadError] = useState<string | null>(null);
    const abortDownloadRef = useRef<(() => void) | null>(null);
    const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
        const initialOpen: Record<string, boolean> = {};

        items.forEach((item) => {
            const hasChildren =
                'items' in item &&
                Array.isArray(item.items) &&
                item.items.length > 0;

            if (hasChildren) {
                const hasActiveChild = item.items!.some((child) =>
                    page.url.startsWith(resolveUrl(child.href)),
                );

                if (hasActiveChild) {
                    initialOpen[item.title] = true;
                }
            }
        });

        return initialOpen;
    });

    const toggleItem = (title: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    useEffect(() => {
        items.forEach((item) => {
            const hasChildren =
                'items' in item &&
                Array.isArray(item.items) &&
                item.items.length > 0;

            if (hasChildren) {
                const hasActiveChild = item.items!.some((child) =>
                    page.url.startsWith(resolveUrl(child.href)),
                );

                if (hasActiveChild && !openItems[item.title]) {
                    setOpenItems((prev) => ({
                        ...prev,
                        [item.title]: true,
                    }));
                }
            }
        });
    }, [items, openItems, page.url]);

    const formatBytes = (bytes: number) => {
        if (!Number.isFinite(bytes) || bytes <= 0) {
            return '0 B';
        }

        const units = ['B', 'KB', 'MB', 'GB'];
        const idx = Math.min(
            units.length - 1,
            Math.floor(Math.log(bytes) / Math.log(1024)),
        );
        const value = bytes / Math.pow(1024, idx);

        return `${value.toFixed(value >= 10 || idx === 0 ? 0 : 1)} ${
            units[idx]
        }`;
    };

    const startDownload = (url: string) => {
        abortDownloadRef.current?.();

        setDownloadError(null);
        setDownloadPercent(null);
        setDownloadLoaded(0);
        setDownloadTotal(null);
        setDownloadState('starting');
        setDownloadOpen(true);

        const { promise, abort } = downloadFileWithProgress(url, {
            onProgress: (p) => {
                setDownloadLoaded(p.loaded);
                setDownloadTotal(p.total);
                setDownloadPercent(p.percent);
            },
            onStateChange: (s) => setDownloadState(s),
        });

        abortDownloadRef.current = abort;

        promise
            .then(() => {
                setTimeout(() => setDownloadOpen(false), 600);
            })
            .catch((err: unknown) => {
                if (err instanceof Error) {
                    if (
                        err.message === 'Download aborted' ||
                        err.name === 'AbortError'
                    ) {
                        return;
                    }

                    setDownloadError(err.message);
                    return;
                }

                setDownloadError('Gagal mengunduh file');
            })
            .finally(() => {
                abortDownloadRef.current = null;
            });
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-xs font-semibold tracking-wider uppercase opacity-60">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu className="gap-2">
                <Dialog open={downloadOpen} onOpenChange={setDownloadOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                    <svg
                                        className="h-4 w-4 text-primary"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                                        />
                                    </svg>
                                </div>
                                Export PDF
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-muted-foreground">
                                        {downloadState === 'starting'
                                            ? 'Menyiapkan laporan…'
                                            : downloadState === 'saving'
                                              ? 'Menyimpan file…'
                                              : 'Mengunduh…'}
                                    </span>
                                    {downloadPercent !== null && (
                                        <span className="tabular-nums font-semibold text-primary">
                                            {downloadPercent.toFixed(1)}%
                                        </span>
                                    )}
                                </div>
                                <Progress
                                    value={downloadPercent ?? 0}
                                    className="h-2"
                                />
                                <div className="flex items-center justify-between text-xs tabular-nums text-muted-foreground">
                                    <div>
                                        {downloadPercent === null &&
                                            formatBytes(downloadLoaded)}
                                    </div>
                                    <div>
                                        {downloadTotal
                                            ? formatBytes(downloadTotal)
                                            : downloadTotal === 0
                                              ? '0 B'
                                              : ''}
                                    </div>
                                </div>
                            </div>
                            {downloadError && (
                                <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                                    {downloadError}
                                </div>
                            )}
                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        abortDownloadRef.current?.();
                                        setDownloadOpen(false);
                                    }}
                                    className="hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                                >
                                    Batal
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                {items.map((item) => {
                    const hasChildren =
                        'items' in item &&
                        Array.isArray(item.items) &&
                        item.items.length > 0;
                    const isOpen = openItems[item.title] || false;
                    const isActive = hasChildren
                        ? item.items!.some((child) =>
                              page.url.startsWith(resolveUrl(child.href)),
                          )
                        : 'href' in item
                          ? page.url.startsWith(resolveUrl(item.href))
                          : false;

                    return (
                        <SidebarMenuItem key={item.title}>
                            {hasChildren ? (
                                <Collapsible
                                    open={isOpen}
                                    onOpenChange={() => toggleItem(item.title)}
                                    className="group/collapsible"
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            tooltip={{ children: item.title }}
                                            className={`w-full transition-all duration-200 group/button hover:scale-[1.02] active:scale-[0.98] ${
                                                isActive ? 'shadow-sm' : ''
                                            }`}
                                        >
                                            {item.icon && (
                                                <item.icon className="transition-transform duration-200 group-hover/button:scale-110" />
                                            )}
                                            <span className="font-medium">
                                                {item.title}
                                            </span>
                                            <ChevronRight
                                                className={`ml-auto h-4 w-4 shrink-0 transition-all duration-300 ease-out ${
                                                    isOpen
                                                        ? 'rotate-90 text-primary'
                                                        : 'rotate-0'
                                                } group-hover/button:text-primary`}
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="overflow-hidden transition-all duration-300 ease-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                        <SidebarMenuSub className="mt-2 mb-1 ml-0 border-l-2 border-primary/20 pl-0">
                                            {item.items!.map(
                                                (child, idx) => (
                                                    <SidebarMenuSubItem
                                                        key={child.title}
                                                        className="relative"
                                                    >
                                                        <div
                                                            className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-primary/20"
                                                            style={{
                                                                animation: isOpen
                                                                    ? `slideInLeft 0.3s ease-out ${
                                                                          idx *
                                                                          0.05
                                                                      }s both`
                                                                    : 'none',
                                                            }}
                                                        />
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={page.url.startsWith(
                                                                resolveUrl(
                                                                    child.href,
                                                                ),
                                                            )}
                                                            className="ml-3 pl-4 transition-all duration-200 group/subbutton hover:translate-x-1 hover:bg-primary/5 active:scale-[0.98]"
                                                            style={{
                                                                animation: isOpen
                                                                    ? `fadeInUp 0.3s ease-out ${
                                                                          idx *
                                                                          0.05
                                                                      }s both`
                                                                    : 'none',
                                                            }}
                                                        >
                                                            {isDownloadHref(
                                                                child.href,
                                                            ) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        startDownload(
                                                                            resolveUrl(
                                                                                child.href,
                                                                            ),
                                                                        )
                                                                    }
                                                                >
                                                                    {child.icon && (
                                                                        <child.icon className="transition-transform duration-200 group-hover/subbutton:scale-110" />
                                                                    )}
                                                                    <span className="text-sm">
                                                                        {
                                                                            child.title
                                                                        }
                                                                    </span>
                                                                </button>
                                                            ) : (
                                                                <Link
                                                                    href={
                                                                        child.href
                                                                    }
                                                                    prefetch
                                                                >
                                                                    {child.icon && (
                                                                        <child.icon className="transition-transform duration-200 group-hover/subbutton:scale-110" />
                                                                    )}
                                                                    <span className="text-sm">
                                                                        {
                                                                            child.title
                                                                        }
                                                                    </span>
                                                                </Link>
                                                            )}
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                ),
                                            )}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            ) : 'href' in item ? (
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={{ children: item.title }}
                                    className={`transition-all duration-200 group/button hover:scale-[1.02] active:scale-[0.98] ${
                                        isActive ? 'shadow-sm' : ''
                                    }`}
                                >
                                    {isDownloadHref(item.href) ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                startDownload(
                                                    resolveUrl(item.href),
                                                )
                                            }
                                        >
                                            {item.icon && (
                                                <item.icon className="transition-transform duration-200 group-hover/button:scale-110" />
                                            )}
                                            <span className="font-medium">
                                                {item.title}
                                            </span>
                                        </button>
                                    ) : (
                                        <Link href={item.href} prefetch>
                                            {item.icon && (
                                                <item.icon className="transition-transform duration-200 group-hover/button:scale-110" />
                                            )}
                                            <span className="font-medium">
                                                {item.title}
                                            </span>
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            ) : (
                                <SidebarMenuButton
                                    isActive={isActive}
                                    tooltip={{ children: item.title }}
                                    className="transition-all duration-200 group/button hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {item.icon && (
                                        <item.icon className="transition-transform duration-200 group-hover/button:scale-110" />
                                    )}
                                    <span className="font-medium">
                                        {item.title}
                                    </span>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideInLeft {
                    from {
                        width: 0;
                        opacity: 0;
                    }
                    to {
                        width: 0.75rem;
                        opacity: 1;
                    }
                }
            `}</style>
        </SidebarGroup>
    );
}
