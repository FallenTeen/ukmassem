import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

type DownloadState = 'starting' | 'downloading' | 'saving';

type DownloadProgress = {
    loaded: number;
    total: number;
    percent: number;
};

type DownloadOptions = {
    onProgress?: (progress: DownloadProgress) => void;
    onStateChange?: (state: DownloadState) => void;
    filename?: string;
};

export function resolveUrl(
    href: NonNullable<InertiaLinkProps['href']>,
): string {
    return toUrl(href);
}

export function downloadFileWithProgress(
    url: string,
    options: DownloadOptions,
): { promise: Promise<void>; abort: () => void } {
    const controller = new AbortController();
    const signal = controller.signal;
    let aborted = false;
    let rejectFn: ((reason?: unknown) => void) | null = null;

    const promise = new Promise<void>((resolve, reject) => {
        rejectFn = reject;

        (async () => {
            try {
                options.onStateChange?.('downloading');

                const response = await fetch(url, { signal });

                if (!response.ok) {
                    throw new Error('Gagal mengunduh file');
                }

                const contentLength =
                    response.headers.get('Content-Length');
                const total = contentLength
                    ? Number.parseInt(contentLength, 10) || 0
                    : 0;

                const reader = response.body?.getReader();
                const chunks: BlobPart[] = [];
                let loaded = 0;

                if (!reader) {
                    const blob = await response.blob();
                    loaded = blob.size;
                    options.onProgress?.({
                        loaded,
                        total: blob.size,
                        percent: 100,
                    });
                    options.onStateChange?.('saving');
                    const filename = getFilenameFromResponse(
                        response,
                        url,
                        options.filename,
                    );
                    saveBlob(blob, filename);
                    resolve();
                    return;
                }

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    if (value) {
                        chunks.push(value);
                        loaded += value.length;

                        const percent =
                            total > 0 ? (loaded / total) * 100 : 0;

                        options.onProgress?.({
                            loaded,
                            total,
                            percent,
                        });
                    }
                }

                options.onStateChange?.('saving');

                const blob = new Blob(chunks);
                const filename = getFilenameFromResponse(
                    response,
                    url,
                    options.filename,
                );
                saveBlob(blob, filename);

                resolve();
            } catch (error) {
                if (aborted) {
                    reject(new Error('Download aborted'));
                    return;
                }

                reject(error);
            }
        })();
    });

    const abort = () => {
        if (aborted) {
            return;
        }

        aborted = true;
        controller.abort();

        if (rejectFn) {
            rejectFn(new Error('Download aborted'));
        }
    };

    return { promise, abort };
}

function getFilenameFromResponse(
    response: Response,
    url: string,
    explicitFilename?: string,
): string {
    if (explicitFilename) {
        return explicitFilename;
    }

    const disposition = response.headers.get('Content-Disposition');

    if (disposition) {
        const match = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(
            disposition,
        );

        if (match && match[1]) {
            return decodeURIComponent(match[1].trim());
        }
    }

    try {
        const urlObject = new URL(url, window.location.href);
        const segments = urlObject.pathname.split('/').filter(Boolean);

        if (segments.length > 0) {
            return segments[segments.length - 1];
        }
    } catch {
        const segments = url.split('/').filter(Boolean);

        if (segments.length > 0) {
            return segments[segments.length - 1];
        }
    }

    return 'download';
}

function saveBlob(blob: Blob, filename: string) {
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(objectUrl);
}
