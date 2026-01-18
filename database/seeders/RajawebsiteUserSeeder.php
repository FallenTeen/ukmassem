<?php

namespace Database\Seeders;

use App\Models\AnggotaAssem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RajawebsiteUserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'vlamingvlaming0@gmail.com'],
            [
                'name' => 'Hanafi Dana Bastyan',
                'password' => Hash::make('HanafiDanaBastyan123'),
                'role' => 'rajawebsite',
            ]
        );

        AnggotaAssem::updateOrCreate(
            ['user_id' => $user->id],
            [
                'NIM' => '22SA11A056',
                'nomor_anggota' => 'NA.22.SA.0008',
                'tanggal_lahir' => '2004-01-21',
                'nama_panggilan' => 'Hanafi Dana Bastyan',
                'status_anggota' => 'anggota_tetap',
                'divisi' => 'musik',
                'angkatan' => 2022,
                'alamat' => 'Ds. XXX, Kec. XXX',
                'nomor_telepon' => '085156208507',
            ]
        );
    }
}
