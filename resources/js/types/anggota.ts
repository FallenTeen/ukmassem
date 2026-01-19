import type { User } from '@/types';

export type Divisi = 'musik' | 'tari' | 'film' | 'foto' | 'teater';

export type StatusAnggota =
    | 'calon_anggota'
    | 'anggota_muda'
    | 'anggota_tetap'
    | 'nonaktif'
    | 'alumni'
    | 'pembina'
    | 'pelatih'
    | 'lain';

export type Role =
    | 'rajawebsite'
    | 'ketum_waketum'
    | 'sekretaris'
    | 'bendahara'
    | 'dm'
    | 'humas'
    | 'kad_fot'
    | 'kad_fil'
    | 'kad_tar'
    | 'kad_mus'
    | 'kad_tea'
    | 'rt'
    | 'litbang'
    | 'pelatih'
    | 'pembina'
    | 'po'
    | 'anggota';

export interface Anggota {
    id: number;
    NIM: string | null;
    nomor_anggota: string | null;
    tanggal_lahir: string | null;
    nama_panggilan: string[] | null;
    status_anggota: StatusAnggota;
    divisi: Divisi | null;
    angkatan: number | null;
    alamat: string | null;
    nomor_telepon: string | null;
    user_id: number | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    nama_lengkap?: string | null;
    user?: User | null;
}

export interface AnggotaForm {
    NIM: string;
    nomor_anggota: string;
    tanggal_lahir: string;
    nama_panggilan: string[];
    status_anggota: StatusAnggota | '';
    divisi: Divisi | '';
    angkatan: string;
    alamat: string;
    nomor_telepon: string;
    user_id: string;
    email: string;
}

export interface FilterAnggota {
    search?: string;
    divisi?: Divisi[];
    status_anggota?: StatusAnggota | '';
    role?: Role | '';
    per_page?: number | string;
}

export interface Paginator<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

