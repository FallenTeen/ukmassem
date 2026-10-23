export interface MainProkerItem {
    id: number;
    nama_proker: string;
    deskripsi: string | null;
    gambar: string | null;
    prokers_count: number;
}

export interface ProkerRingkas {
    id: number;
    nama_lengkap: string;
    tahun: number;
    tanggal_mulai: string | null;
    tanggal_selesai: string | null;
    deskripsi: string | null;
    status: string;
    ketua_pelaksana?: {
        user?: { name: string } | null;
    } | null;
    galeris?: ProkerGaleri[];
}

export interface ProkerGaleri {
    id: number;
    jenis: string;
    judul: string;
    slug: string;
    cover_path: string | null;
    tanggal: string;
}

export interface PagelaranRingkas {
    id: number;
    judul: string;
    slug: string;
    ringkasan: string | null;
    cover_path: string | null;
    tanggal: string;
    prokers: { id: number; nama_lengkap: string; tahun: number }[];
}

export const LABEL_STATUS_PROKER: Record<string, string> = {
    draft: 'Draft',
    aktif: 'Aktif',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
};

export const gambarUrl = (gambar: string | null): string =>
    gambar ? `/storage/${gambar}` : '/storage/main-proker/default.svg';

export const formatTanggal = (value: string | null): string => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};
