<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->enum('role', [
                'ketum_waketum',
                'sekretaris',
                'bendahara',
                'dm',
                'humas',
                'kad_fot',
                'kad_fil',
                'kad_tar',
                'kad_mus',
                'kad_tea',
                'rt',
                'litbang',
                'pelatih',
                'pembina',
                'po',
                'anggota',
                'rajawebsite',
            ])->nullable()->after('password');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('role');
        });
    }
};
