<?php

namespace App\Http\Controllers;

use App\Models\AnggotaAssem;
use App\Models\Proker;
use App\Models\ProkerStruktur;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProkerStrukturController extends Controller
{
    public function index(int $prokerId): Response
    {
        $proker = Proker::with(['prokerStrukturs.anggota.user'])->findOrFail($prokerId);
        $anggota = AnggotaAssem::with('user')
            ->get()
            ->sortBy('nama_lengkap')
            ->values();

        return Inertia::render('ProkerStruktur/Index', [
            'proker' => $proker,
            'anggota' => $anggota,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'proker_id' => [
                'required',
                'integer',
                'exists:prokers,id',
            ],
            'anggota_id' => [
                'required',
                'integer',
                'exists:anggota_assem,id',
            ],
            'jabatan' => [
                'required',
                'string',
                'max:255',
            ],
            'divisi_proker' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        ProkerStruktur::create($validated);

        return to_route('proker-struktur.index', $validated['proker_id']);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $struktur = ProkerStruktur::findOrFail($id);

        $validated = $request->validate([
            'anggota_id' => [
                'required',
                'integer',
                'exists:anggota_assem,id',
            ],
            'jabatan' => [
                'required',
                'string',
                'max:255',
            ],
            'divisi_proker' => [
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $struktur->update($validated);

        return to_route('proker-struktur.index', $struktur->proker_id);
    }

    public function destroy(int $id): RedirectResponse
    {
        $struktur = ProkerStruktur::findOrFail($id);
        $prokerId = $struktur->proker_id;

        $struktur->delete();

        return to_route('proker-struktur.index', $prokerId);
    }
}
