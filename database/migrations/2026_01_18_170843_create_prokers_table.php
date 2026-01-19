<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prokers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('main_proker_id')
                ->constrained('main_prokers')
                ->onDelete('cascade');

            $table->string('nama_lengkap');
            $table->integer('tahun');

            $table->date('tanggal_mulai')->nullable();
            $table->date('tanggal_selesai')->nullable();

            $table->text('deskripsi')->nullable();

            $table->enum('status', ['draft', 'aktif', 'selesai', 'dibatalkan'])
                ->default('draft');

            $table->foreignId('ketua_pelaksana_id')
                ->nullable()
                ->constrained('anggota_assem')
                ->onDelete('set null');

            $table->json('ketua_pelaksana_history')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prokers');
    }
};