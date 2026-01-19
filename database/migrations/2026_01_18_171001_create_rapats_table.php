<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rapats', function (Blueprint $table) {
            $table->id();

            $table->string('judul');

            $table->foreignId('jenis_rapat_id')
                ->constrained('master_jenis_rapats')
                ->onDelete('cascade');

            $table->enum('kategori', ['proker', 'non_proker']);

            $table->foreignId('proker_id')
                ->nullable()
                ->constrained('prokers')
                ->onDelete('set null');

            $table->text('deskripsi')->nullable();

            $table->dateTime('tanggal');

            $table->time('waktu_mulai')->nullable();
            $table->time('waktu_selesai')->nullable();

            $table->string('lokasi')->nullable();

            $table->longText('notulensi')->nullable();

            $table->json('hasil')->nullable();

            $table->text('evaluasi')->nullable();

            $table->string('link_dokumentasi')->nullable();

            $table->enum('status', ['draft', 'akan_datang', 'selesai', 'ditunda', 'dibatalkan'])
                ->default('draft');

            $table->enum('target_peserta', ['semua', 'divisi', 'role', 'proker_team', 'custom'])
                ->default('semua');

            $table->json('target_detail')->nullable();

            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rapats');
    }
};