<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('galeris', function (Blueprint $table) {
            $table->id();

            $table->enum('jenis', ['kegiatan', 'pagelaran', 'karya']);

            $table->string('judul');
            $table->string('slug')->unique();

            $table->text('ringkasan')->nullable();
            $table->longText('deskripsi')->nullable();

            $table->string('cover_path')->nullable();

            $table->string('video_link')->nullable();

            $table->date('tanggal')->nullable();

            $table->enum('divisi', ['musik', 'tari', 'film', 'foto', 'teater'])
                ->nullable();

            $table->string('pembuat')->nullable();

            $table->enum('status', ['draft', 'menunggu', 'published', 'ditolak'])
                ->default('draft');

            $table->timestamp('published_at')->nullable();

            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->text('catatan_admin')->nullable();

            $table->timestamps();

            $table->index(['jenis', 'status']);
        });

        Schema::create('galeri_fotos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('galeri_id')
                ->constrained('galeris')
                ->onDelete('cascade');

            $table->enum('tipe', ['cover', 'carousel', 'dokumentasi']);

            $table->string('path');

            $table->unsignedInteger('urutan')->default(0);

            $table->timestamps();
        });

        Schema::create('galeri_proker', function (Blueprint $table) {
            $table->id();

            $table->foreignId('galeri_id')
                ->constrained('galeris')
                ->onDelete('cascade');

            $table->foreignId('proker_id')
                ->constrained('prokers')
                ->onDelete('cascade');

            $table->timestamps();

            $table->unique(['galeri_id', 'proker_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('galeri_proker');
        Schema::dropIfExists('galeri_fotos');
        Schema::dropIfExists('galeris');
    }
};
