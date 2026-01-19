<?php

namespace App\Http\Controllers;

use App\Models\MainProker;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MainProkerController extends Controller
{
    public function index(): Response
    {
        $mainProkers = MainProker::withCount('prokers')
            ->orderBy('nama_proker')
            ->get();

        return Inertia::render('Proker/MainProker/Index', [
            'mainProkers' => $mainProkers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_proker' => [
                'required',
                'string',
                'max:255',
                'unique:main_prokers,nama_proker',
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
            'gambar' => [
                'nullable',
                'image',
                'max:2048',
            ],
        ]);

        $data = [
            'nama_proker' => $validated['nama_proker'],
            'deskripsi' => $validated['deskripsi'] ?? null,
        ];

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('main_prokers', 'public');
        }

        MainProker::create($data);

        return to_route('main-proker.index');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $mainProker = MainProker::findOrFail($id);

        $validated = $request->validate([
            'nama_proker' => [
                'required',
                'string',
                'max:255',
                Rule::unique('main_prokers', 'nama_proker')->ignore($mainProker->id),
            ],
            'deskripsi' => [
                'nullable',
                'string',
            ],
            'gambar' => [
                'nullable',
                'image',
                'max:2048',
            ],
        ]);

        $data = [
            'nama_proker' => $validated['nama_proker'],
            'deskripsi' => $validated['deskripsi'] ?? null,
        ];

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('main_prokers', 'public');
        }

        $mainProker->update($data);

        return to_route('main-proker.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $mainProker = MainProker::findOrFail($id);

        $mainProker->delete();

        return to_route('main-proker.index');
    }
}

