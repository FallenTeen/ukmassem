<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('anggota_assem', function (Blueprint $table): void {
            $table->id();
            $table->string('NIM')->unique()->nullable();
            $table->string('nomor_anggota')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->json('nama_panggilan')->nullable();
            $table->enum('status_anggota', ['calon_anggota', 'anggota_muda', 'anggota_tetap', 'nonaktif', 'alumni', 'pembina', 'pelatih', 'lain']);
            $table->enum('divisi', ['musik', 'tari', 'film', 'foto', 'teater'])->nullable();
            $table->integer('angkatan')->nullable();
            $table->text('alamat')->nullable();
            $table->string('nomor_telepon')->nullable();
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->onUpdate('cascade')
                ->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggota_assem');
    }
};
