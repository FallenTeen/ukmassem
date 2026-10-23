export interface KategoriBarang {
    id: number;
    kode: string;
    nama: string;
    keterangan?: string | null;
    inventariss_count?: number;
}

export type KondisiBarang = 'bagus' | 'rusak_ringan' | 'rusak_berat';

export type StatusBarang = 'tersedia' | 'dipinjam' | 'perbaikan' | 'hilang';

export interface InventarisItem {
    id: number;
    kode: string;
    nama_barang: string;
    kondisi: KondisiBarang;
    status: StatusBarang;
    boleh_dipinjam: boolean;
    harga_sewa: string | null;
    foto: string | null;
    lokasi: string | null;
    catatan: string | null;
    kategori_barang_id: number;
    kategori?: KategoriBarang | null;
    creator?: { id: number; name: string } | null;
    logs?: InventarisLogItem[];
}

export interface InventarisLogItem {
    id: number;
    tipe: string;
    keterangan: string | null;
    created_at: string;
    user?: { id: number; name: string } | null;
    peminjaman?: { id: number; kode: string } | null;
}

export type SifatPinjam = 'anggota_amikom' | 'eksternal';

export type StatusPeminjaman = 'menunggu' | 'dipinjam' | 'selesai' | 'ditolak' | 'batal';

export interface PeminjamanDetail {
    id: number;
    kode: string;
    sifat: SifatPinjam;
    nama_peminjam: string;
    asal_organisasi: string | null;
    kontak: string;
    tanggal_pinjam: string;
    rencana_kembali: string | null;
    dikembalikan: string | null;
    status: StatusPeminjaman;
    catatan: string | null;
    catatan_rt: string | null;
    created_at: string;
    pengaju?: { id: number; name: string } | null;
    penyetuju?: { id: number; name: string } | null;
    items?: ItemPinjam[];
}

export interface ItemPinjam {
    id: number;
    kembali: boolean;
    catatan: string | null;
    inventaris?: InventarisItem | null;
}

export interface PeminjamanMendatang {
    kode: string;
    nama_peminjam: string;
    status: string;
    tanggal_pinjam: string;
    rencana_kembali: string | null;
}

export const LABEL_KONDISI: Record<KondisiBarang, string> = {
    bagus: 'Bagus',
    rusak_ringan: 'Rusak Ringan',
    rusak_berat: 'Rusak Berat',
};

export const LABEL_STATUS_BARANG: Record<StatusBarang, string> = {
    tersedia: 'Tersedia',
    dipinjam: 'Dipinjam',
    perbaikan: 'Perbaikan',
    hilang: 'Hilang',
};

export const LABEL_STATUS_PINJAM: Record<StatusPeminjaman, string> = {
    menunggu: 'Menunggu',
    dipinjam: 'Dipinjam',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
    batal: 'Batal',
};

export const LABEL_SIFAT: Record<SifatPinjam, string> = {
    anggota_amikom: 'Anggota Amikom',
    eksternal: 'Eksternal',
};

export const VARIANT_KONDISI: Record<KondisiBarang, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    bagus: 'secondary',
    rusak_ringan: 'outline',
    rusak_berat: 'destructive',
};

export const VARIANT_STATUS_BARANG: Record<StatusBarang, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    tersedia: 'secondary',
    dipinjam: 'default',
    perbaikan: 'outline',
    hilang: 'destructive',
};

export const VARIANT_STATUS_PINJAM: Record<StatusPeminjaman, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    menunggu: 'destructive',
    dipinjam: 'default',
    selesai: 'secondary',
    ditolak: 'outline',
    batal: 'outline',
};

export const fotoUrl = (path: string | null): string | null =>
    path ? `/storage/${path}` : null;
