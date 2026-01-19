<?php

use App\Http\Controllers\AnggotaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MainProkerController;
use App\Http\Controllers\MasterJenisRapatController;
use App\Http\Controllers\ProkerController;
use App\Http\Controllers\PresensiRapatController;
use App\Http\Controllers\ProkerStrukturController;
use App\Http\Controllers\RapatController;
use App\Http\Controllers\UserAccountController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/sejarah', function () {
    return Inertia::render('sejarah');
})->name('sejarah');

Route::get('/galeri', function () {
    return Inertia::render('galeri');
})->name('galeri');

Route::prefix('divisi')->group(function () {
    Route::get('/', function () {
        return Inertia::render('divisi/index');
    })->name('divisi.index');

    Route::get('/musik', function () {
        return Inertia::render('divisi/musik');
    })->name('divisi.musik');

    Route::get('/foto', function () {
        return Inertia::render('divisi/foto');
    })->name('divisi.foto');

    Route::get('/film', function () {
        return Inertia::render('divisi/film');
    })->name('divisi.film');

    Route::get('/tari', function () {
        return Inertia::render('divisi/tari');
    })->name('divisi.tari');

    Route::get('/teater', function () {
        return Inertia::render('divisi/teater');
    })->name('divisi.teater');
});

Route::get('/splash', function () {
    return Inertia::render('splash');
})->name('splash');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified', 'role:rajawebsite,ketum_waketum,sekretaris'])->group(function () {
    Route::get('dashboard/statistik', [DashboardController::class, 'statistikKehadiran'])
        ->name('dashboard.statistik');
    Route::get('dashboard/statistik/proker/{proker}', [DashboardController::class, 'statistikPerProker'])
        ->name('dashboard.statistik.proker');
});

Route::middleware(['auth', 'verified', 'role:dm'])->group(function () {
    Route::get('it-dm-only', function () {
        return 'Hanya role dm yang boleh mengakses route ini';
    })->name('it-dm-only');
});

Route::prefix('user-account')
    ->middleware(['auth', 'role:rajawebsite,dm'])
    ->name('user-account.')
    ->group(function (): void {
        Route::get('/', [UserAccountController::class, 'index'])->name('index');
        Route::get('/create/{anggota}', [UserAccountController::class, 'create'])->name('create');
        Route::post('/', [UserAccountController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [UserAccountController::class, 'edit'])->name('edit');
        Route::put('/{user}', [UserAccountController::class, 'update'])->name('update');
        Route::delete('/{user}', [UserAccountController::class, 'destroy'])->name('destroy');
        Route::post('/bulk-create', [UserAccountController::class, 'bulkCreate'])->name('bulkCreate');
        Route::post('/bulk-store', [UserAccountController::class, 'bulkStore'])->name('bulkStore');
    });

Route::prefix('kelola-anggota')
    ->middleware(['auth', 'role:rajawebsite,ketum_waketum,sekretaris'])
    ->name('anggota.')
    ->group(function (): void {
        Route::get('/', [AnggotaController::class, 'index'])->name('index');
        Route::get('/create', [AnggotaController::class, 'create'])->name('create');
        Route::post('/', [AnggotaController::class, 'store'])->name('store');
        Route::get('/{anggota}', [AnggotaController::class, 'show'])->name('show');
        Route::get('/{anggota}/edit', [AnggotaController::class, 'edit'])->name('edit');
        Route::put('/{anggota}', [AnggotaController::class, 'update'])->name('update');
        Route::delete('/{anggota}', [AnggotaController::class, 'destroy'])->name('destroy');
    });

require __DIR__.'/settings.php';

Route::prefix('proker')
    ->middleware(['auth', 'role:rajawebsite,ketum_waketum,sekretaris,kad_fot,kad_fil,kad_tar,kad_mus,kad_tea'])
    ->group(function (): void {
        Route::get('/', [ProkerController::class, 'index'])->name('proker.index');
        Route::get('/create', [ProkerController::class, 'create'])->name('proker.create');
        Route::post('/', [ProkerController::class, 'store'])->name('proker.store');
        Route::get('/{proker}', [ProkerController::class, 'show'])->name('proker.show');
        Route::get('/{proker}/edit', [ProkerController::class, 'edit'])->name('proker.edit');
        Route::put('/{proker}', [ProkerController::class, 'update'])->name('proker.update');
        Route::delete('/{proker}', [ProkerController::class, 'destroy'])->name('proker.destroy');
        Route::post('/{proker}/status', [ProkerController::class, 'updateStatus'])->name('proker.updateStatus');
        Route::post('/{from}/copy-struktur/{to}', [ProkerController::class, 'copyStruktur'])->name('proker.copyStruktur');
    });

Route::prefix('main-proker')
    ->middleware(['auth', 'role:rajawebsite,ketum_waketum,sekretaris'])
    ->group(function (): void {
        Route::get('/', [MainProkerController::class, 'index'])->name('main-proker.index');
        Route::post('/', [MainProkerController::class, 'store'])->name('main-proker.store');
        Route::put('/{mainProker}', [MainProkerController::class, 'update'])->name('main-proker.update');
        Route::delete('/{mainProker}', [MainProkerController::class, 'destroy'])->name('main-proker.destroy');
    });

Route::prefix('proker-struktur')
    ->middleware(['auth', 'role:rajawebsite,ketum_waketum,sekretaris,ketua_pelaksana'])
    ->group(function (): void {
        Route::post('/', [ProkerStrukturController::class, 'store'])->name('proker-struktur.store');
        Route::put('/{struktur}', [ProkerStrukturController::class, 'update'])->name('proker-struktur.update');
        Route::delete('/{struktur}', [ProkerStrukturController::class, 'destroy'])->name('proker-struktur.destroy');
    });

Route::prefix('rapat/master-jenis')
    ->middleware(['auth', 'role:rajawebsite,ketum_waketum,sekretaris,kad_fot,kad_fil,kad_tar,kad_mus,kad_tea'])
    ->group(function (): void {
        Route::get('/', [MasterJenisRapatController::class, 'index'])->name('rapat.master-jenis.index');
        Route::post('/', [MasterJenisRapatController::class, 'store'])->name('rapat.master-jenis.store');
        Route::put('/{jenis}', [MasterJenisRapatController::class, 'update'])->name('rapat.master-jenis.update');
        Route::delete('/{jenis}', [MasterJenisRapatController::class, 'destroy'])->name('rapat.master-jenis.destroy');
    });

Route::prefix('rapat')
    ->middleware(['auth', 'role:rajawebsite,ketum_waketum,sekretaris,kad_fot,kad_fil,kad_tar,kad_mus,kad_tea,anggota'])
    ->group(function (): void {
        Route::get('/', [RapatController::class, 'index'])->name('rapat.index');
        Route::get('/calendar', [RapatController::class, 'calendar'])->name('rapat.calendar');
        Route::get('/create', [RapatController::class, 'create'])->name('rapat.create');
        Route::post('/', [RapatController::class, 'store'])->name('rapat.store');
        Route::get('/{rapat}', [RapatController::class, 'show'])->name('rapat.show');
        Route::get('/{rapat}/edit', [RapatController::class, 'edit'])->name('rapat.edit');
        Route::put('/{rapat}', [RapatController::class, 'update'])->name('rapat.update');
        Route::delete('/{rapat}', [RapatController::class, 'destroy'])->name('rapat.destroy');
        Route::post('/{rapat}/status', [RapatController::class, 'updateStatus'])->name('rapat.updateStatus');

        Route::get('/{rapat}/presensi', [PresensiRapatController::class, 'index'])
            ->name('rapat.presensi.index')
            ->middleware('role:rajawebsite,ketum_waketum,sekretaris');
        Route::post('/{rapat}/presensi/generate', [PresensiRapatController::class, 'generate'])
            ->name('rapat.presensi.generate')
            ->middleware('role:rajawebsite,ketum_waketum,sekretaris');
        Route::post('/{rapat}/presensi/bulk-update', [PresensiRapatController::class, 'bulkUpdate'])
            ->name('rapat.presensi.bulkUpdate')
            ->middleware('role:rajawebsite,ketum_waketum,sekretaris');
        Route::post('/{rapat}/presensi/add-manual', [PresensiRapatController::class, 'addManual'])
            ->name('rapat.presensi.addManual')
            ->middleware('role:rajawebsite,ketum_waketum,sekretaris');
        Route::delete('/{rapat}/presensi/{anggota}', [PresensiRapatController::class, 'remove'])
            ->name('rapat.presensi.remove')
            ->middleware('role:rajawebsite,ketum_waketum,sekretaris');
    });
