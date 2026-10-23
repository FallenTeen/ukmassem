<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RajawebsiteUserSeeder::class,
            ProkerSeeder::class,
            ProkerSeeder2::class,
            RapatSeeder::class,
            PresensiRapatSeeder::class,
            GaleriSeeder::class,
        ]);
    }
}
