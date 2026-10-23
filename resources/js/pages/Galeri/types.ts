export type JenisGaleri = 'kegiatan' | 'pagelaran' | 'karya';

export type DivisiGaleri = 'musik' | 'tari' | 'film' | 'foto' | 'teater';

export type StatusGaleri = 'draft' | 'menunggu' | 'published' | 'ditolak';

export interface GaleriItem {
    id: number;
    jenis: JenisGaleri;
    judul: string;
    slug: string;
    ringkasan: string | null;
    cover_path: string | null;
    tanggal: string | null;
    divisi: DivisiGaleri | null;
    pembuat: string | null;
    status: StatusGaleri;
    video_link: string | null;
    deskripsi: string | null;
    catatan_admin: string | null;
    created_by: number | null;
    approved_by: number | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface GaleriIndexItem extends GaleriItem {
    [key: string]: unknown;
}

export interface GaleriFotoItem {
    id: number;
    galeri_id: number;
    tipe: 'cover' | 'carousel' | 'dokumentasi';
    path: string;
    urutan: number;
}

export interface ProkerRingkas {
    id: number;
    nama_lengkap: string;
    tahun: number;
    status: string;
    tanggal_mulai?: string | null;
    tanggal_selesai?: string | null;
    deskripsi?: string | null;
    main_proker?: { id: number; nama_proker: string } | null;
}

export interface GaleriDetail extends GaleriItem {
    carouselFotos: GaleriFotoItem[];
    dokumentasiFotos: GaleriFotoItem[];
    prokers: ProkerRingkas[];
    creator?: { id: number; name: string; email: string } | null;
    approver?: { id: number; name: string } | null;
    [key: string]: unknown;
}

export const LABEL_JENIS: Record<JenisGaleri, string> = {
    kegiatan: 'Galeri Kegiatan',
    pagelaran: 'Pagelaran Seni',
    karya: 'Karya Anggota',
};

export const LABEL_DIVISI: Record<DivisiGaleri, string> = {
    musik: 'Musik',
    tari: 'Tari',
    film: 'Film',
    foto: 'Foto',
    teater: 'Teater',
};

export const LABEL_STATUS: Record<StatusGaleri, string> = {
    draft: 'Draft',
    menunggu: 'Menunggu Persetujuan',
    published: 'Tayang',
    ditolak: 'Ditolak',
};

export const coverUrl = (path: string | null | undefined): string | null =>
    path ? `/storage/${path}` : null;

export const formatTanggal = (tanggal?: string | null): string => {
    if (!tanggal) return '-';
    const date = new Date(tanggal);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const embedVideo = (link: string | null | undefined): string | null => {
    if (!link) return null;
    const youtube = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/);
    if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;
    return null;
};
