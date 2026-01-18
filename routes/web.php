<?php

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

Route::middleware(['auth', 'verified', 'role:dm'])->group(function () {
    Route::get('it-dm-only', function () {
        return 'Hanya role dm yang boleh mengakses route ini';
    })->name('it-dm-only');
});

require __DIR__.'/settings.php';
