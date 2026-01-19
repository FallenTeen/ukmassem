<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proker_strukturs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('proker_id')
                ->constrained('prokers')
                ->onDelete('cascade');

            $table->foreignId('anggota_id')
                ->constrained('anggota_assem')
                ->onDelete('cascade');

            $table->string('jabatan');
            $table->string('divisi_proker')->nullable();

            $table->timestamps();

            $table->unique(['proker_id', 'anggota_id', 'jabatan']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proker_strukturs');
    }
};