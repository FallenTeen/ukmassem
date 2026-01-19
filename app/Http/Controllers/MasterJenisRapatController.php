<?php

namespace App\Http\Controllers;

use App\Models\MasterJenisRapat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MasterJenisRapatController extends Controller
{
    public function index(): Response
    {
        $items = MasterJenisRapat::orderBy('nama')->get();

        return Inertia::render('Rapat/MasterJenis/Index', [
            'jenisRapats' => $items,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
                'unique:master_jenis_rapats,nama',
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
        ]);

        MasterJenisRapat::create($validated);

        return back();
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $jenis = MasterJenisRapat::findOrFail($id);

        $validated = $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
                Rule::unique('master_jenis_rapats', 'nama')->ignore($jenis->id),
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
        ]);

        $jenis->update($validated);

        return back();
    }

    public function destroy(int $id): RedirectResponse
    {
        $jenis = MasterJenisRapat::findOrFail($id);

        $jenis->delete();

        return back();
    }
}
