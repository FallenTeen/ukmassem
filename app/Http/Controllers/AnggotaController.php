<?php

namespace App\Http\Controllers;

use App\Models\AnggotaAssem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AnggotaController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AnggotaAssem::query()
            ->with('user');

        $search = $request->string('search')->toString();

        if ($search !== '') {
            $query->where(function ($q) use ($search): void {
                $q->where('NIM', 'like', '%'.$search.'%')
                    ->orWhere('nomor_anggota', 'like', '%'.$search.'%')
                    ->orWhereHas('user', function ($userQuery) use ($search): void {
                        $userQuery->where('name', 'like', '%'.$search.'%');
                    });
            });
        }

        $divisi = $request->string('divisi')->toString();

        if ($divisi !== '') {
            $query->where('divisi', $divisi);
        }

        $statusAnggota = $request->string('status_anggota')->toString();

        if ($statusAnggota !== '') {
            $query->where('status_anggota', $statusAnggota);
        }

        $role = $request->string('role')->toString();

        if ($role !== '') {
            $query->whereHas('user', function ($userQuery) use ($role): void {
                $userQuery->where('role', $role);
            });
        }

        $anggotas = $query
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('KelolaAnggota/Index', [
            'anggotas' => $anggotas,
            'filters' => [
                'search' => $search,
                'divisi' => $divisi,
                'status_anggota' => $statusAnggota,
                'role' => $role,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('KelolaAnggota/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'NIM' => [
                'nullable',
                'string',
                'max:255',
                'unique:anggota_assem,NIM',
            ],
            'nomor_anggota' => ['nullable', 'string', 'max:255'],
            'tanggal_lahir' => ['nullable', 'date'],
            'nama_panggilan' => ['nullable', 'array'],
            'status_anggota' => [
                'required',
                'string',
                Rule::in(['calon_anggota', 'anggota_muda', 'anggota_tetap', 'nonaktif', 'alumni', 'pembina', 'pelatih', 'lain']),
            ],
            'divisi' => [
                'nullable',
                'string',
                Rule::in(['musik', 'tari', 'film', 'foto', 'teater']),
            ],
            'angkatan' => ['nullable', 'integer'],
            'alamat' => ['nullable', 'string'],
            'nomor_telepon' => ['nullable', 'string', 'max:255'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'email' => ['nullable', 'email', 'max:255', 'unique:users,email'],
        ]);

        $data = collect($validated)->except('email')->toArray();

        AnggotaAssem::create($data);

        return to_route('anggota.index');
    }

    public function show(int $id): Response
    {
        $anggota = AnggotaAssem::with('user')->findOrFail($id);

        return Inertia::render('KelolaAnggota/Show', [
            'anggota' => $anggota,
        ]);
    }

    public function edit(int $id): Response
    {
        $anggota = AnggotaAssem::with('user')->findOrFail($id);

        return Inertia::render('KelolaAnggota/Edit', [
            'anggota' => $anggota,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $anggota = AnggotaAssem::findOrFail($id);

        $validated = $request->validate([
            'NIM' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('anggota_assem', 'NIM')->ignore($anggota->id),
            ],
            'nomor_anggota' => ['nullable', 'string', 'max:255'],
            'tanggal_lahir' => ['nullable', 'date'],
            'nama_panggilan' => ['nullable', 'array'],
            'status_anggota' => [
                'required',
                'string',
                Rule::in(['calon_anggota', 'anggota_muda', 'anggota_tetap', 'nonaktif', 'alumni', 'pembina', 'pelatih', 'lain']),
            ],
            'divisi' => [
                'nullable',
                'string',
                Rule::in(['musik', 'tari', 'film', 'foto', 'teater']),
            ],
            'angkatan' => ['nullable', 'integer'],
            'alamat' => ['nullable', 'string'],
            'nomor_telepon' => ['nullable', 'string', 'max:255'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore(optional($anggota->user)->id),
            ],
        ]);

        $data = collect($validated)->except('email')->toArray();

        $anggota->update($data);

        return to_route('anggota.index');
    }

    public function destroy(int $id): RedirectResponse
    {
        $anggota = AnggotaAssem::findOrFail($id);

        $anggota->delete();

        return to_route('anggota.index');
    }
}

