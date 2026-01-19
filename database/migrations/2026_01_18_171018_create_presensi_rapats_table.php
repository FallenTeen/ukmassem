<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presensi_rapats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rapat_id')
                ->constrained('rapats')
                ->onDelete('cascade');

            $table->foreignId('anggota_id')
                ->constrained('anggota_assem')
                ->onDelete('cascade');

            $table->enum('status_kehadiran', ['hadir', 'izin', 'sakit', 'alpa']);

            $table->text('keterangan')->nullable();

            $table->timestamps();

            $table->unique(['rapat_id', 'anggota_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presensi_rapats');
    }
};