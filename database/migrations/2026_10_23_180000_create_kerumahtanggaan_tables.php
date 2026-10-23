<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('kunci')->unique();
            $table->string('nilai')->nullable();
            $table->timestamps();
        });

        Schema::create('kategori_barangs', function (Blueprint $table) {
            $table->id();
            $table->string('kode', 5)->unique();
            $table->string('nama');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        Schema::create('inventariss', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_barang_id')
                ->constrained('kategori_barangs')
                ->onDelete('restrict');
            $table->string('kode')->unique();
            $table->string('nama_barang');
            $table->enum('kondisi', ['bagus', 'rusak_ringan', 'rusak_berat'])
                ->default('bagus');
            $table->enum('status', ['tersedia', 'dipinjam', 'perbaikan', 'hilang'])
                ->default('tersedia');
            $table->boolean('boleh_dipinjam')->default(true);
            $table->decimal('harga_sewa', 12, 2)->nullable();
            $table->string('foto')->nullable();
            $table->string('lokasi')->nullable();
            $table->text('catatan')->nullable();
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');
            $table->timestamps();

            $table->index(['status', 'boleh_dipinjam']);
        });

        Schema::create('peminjamen', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique();
            $table->enum('sifat', ['anggota_amikom', 'eksternal']);
            $table->string('nama_peminjam');
            $table->string('asal_organisasi')->nullable();
            $table->string('kontak', 100);
            $table->date('tanggal_pinjam');
            $table->date('rencana_kembali')->nullable();
            $table->date('dikembalikan')->nullable();
            $table->enum('status', ['menunggu', 'dipinjam', 'selesai', 'ditolak', 'batal'])
                ->default('menunggu');
            $table->text('catatan')->nullable();
            $table->text('catatan_rt')->nullable();
            $table->foreignId('diajukan_oleh')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');
            $table->foreignId('disetujui_oleh')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');
            $table->timestamps();

            $table->index('status');
        });

        Schema::create('inventaris_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventaris_id')
                ->constrained('inventariss')
                ->onDelete('cascade');
            $table->foreignId('peminjaman_id')
                ->nullable()
                ->constrained('peminjamen')
                ->onDelete('set null');
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');
            $table->enum('tipe', ['masuk', 'pinjam', 'kembali', 'kondisi', 'perbaikan', 'hilang']);
            $table->text('keterangan')->nullable();
            $table->timestamps();

            $table->index(['inventaris_id', 'created_at']);
        });

        Schema::create('peminjaman_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('peminjaman_id')
                ->constrained('peminjamen')
                ->onDelete('cascade');
            $table->foreignId('inventaris_id')
                ->constrained('inventariss')
                ->onDelete('restrict');
            $table->boolean('kembali')->default(false);
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->unique(['peminjaman_id', 'inventaris_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peminjaman_items');
        Schema::dropIfExists('inventaris_logs');
        Schema::dropIfExists('peminjamen');
        Schema::dropIfExists('inventariss');
        Schema::dropIfExists('kategori_barangs');
        Schema::dropIfExists('site_settings');
    }
};
