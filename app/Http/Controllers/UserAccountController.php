<?php

namespace App\Http\Controllers;

use App\Models\AnggotaAssem;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserAccountController extends Controller
{
    public function index(Request $request): Response
    {
        $anggotas = AnggotaAssem::with('user')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('UserAccount/Index', [
            'anggotas' => $anggotas,
        ]);
    }

    public function create(int $anggotaId): Response
    {
        $anggota = AnggotaAssem::with('user')->findOrFail($anggotaId);

        return Inertia::render('UserAccount/Create', [
            'anggota' => $anggota,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'anggota_id' => [
                'required',
                'integer',
                'exists:anggota_assem,id',
            ],
            'name' => [
                'nullable',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
            ],
            'role' => [
                'required',
                'string',
                Rule::in([
                    'rajawebsite',
                    'ketum_waketum',
                    'sekretaris',
                    'bendahara',
                    'dm',
                    'humas',
                    'kad_fot',
                    'kad_fil',
                    'kad_tar',
                    'kad_mus',
                    'kad_tea',
                    'rt',
                    'litbang',
                    'pelatih',
                    'pembina',
                    'po',
                    'anggota',
                ]),
            ],
        ]);

        $anggota = AnggotaAssem::findOrFail($validated['anggota_id']);

        $user = User::create([
            'name' => $validated['name'] ?: ($anggota->nama_lengkap ?? 'Anggota '.$anggota->id),
            'email' => $validated['email'],
            'password' => $validated['password'],
            'role' => $validated['role'],
        ]);

        $anggota->user_id = $user->id;
        $anggota->save();

        return to_route('user-account.index');
    }

    public function edit(int $userId): Response
    {
        $user = User::with('anggotaAssem')->findOrFail($userId);

        return Inertia::render('UserAccount/Edit', [
            'user' => $user,
            'anggota' => $user->anggotaAssem,
        ]);
    }

    public function update(Request $request, int $userId): RedirectResponse
    {
        $user = User::findOrFail($userId);

        $validated = $request->validate([
            'name' => [
                'nullable',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => [
                'nullable',
                'string',
                'min:8',
            ],
            'role' => [
                'required',
                'string',
                Rule::in([
                    'rajawebsite',
                    'ketum_waketum',
                    'sekretaris',
                    'bendahara',
                    'dm',
                    'humas',
                    'kad_fot',
                    'kad_fil',
                    'kad_tar',
                    'kad_mus',
                    'kad_tea',
                    'rt',
                    'litbang',
                    'pelatih',
                    'pembina',
                    'po',
                    'anggota',
                ]),
            ],
        ]);

        $user->name = $validated['name'] ?: $user->name;
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (! empty($validated['password'])) {
            $user->password = $validated['password'];
        }

        $user->save();

        return to_route('user-account.index');
    }

    public function destroy(int $userId): RedirectResponse
    {
        $user = User::with('anggotaAssem')->findOrFail($userId);

        if ($user->anggotaAssem) {
            $user->anggotaAssem->user_id = null;
            $user->anggotaAssem->save();
        }

        $user->delete();

        return to_route('user-account.index');
    }

    public function bulkCreate(Request $request): Response
    {
        $anggotas = AnggotaAssem::with('user')
            ->whereNull('user_id')
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('UserAccount/BulkCreate', [
            'anggotas' => $anggotas,
        ]);
    }

    public function bulkStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => [
                'required',
                'array',
            ],
            'items.*.anggota_id' => [
                'required',
                'integer',
                'exists:anggota_assem,id',
            ],
            'items.*.name' => [
                'nullable',
                'string',
                'max:255',
            ],
            'items.*.email' => [
                'required',
                'string',
                'email',
                'max:255',
                'distinct',
                'unique:users,email',
            ],
            'items.*.password' => [
                'nullable',
                'string',
                'min:8',
            ],
            'items.*.role' => [
                'required',
                'string',
                Rule::in([
                    'rajawebsite',
                    'ketum_waketum',
                    'sekretaris',
                    'bendahara',
                    'dm',
                    'humas',
                    'kad_fot',
                    'kad_fil',
                    'kad_tar',
                    'kad_mus',
                    'kad_tea',
                    'rt',
                    'litbang',
                    'pelatih',
                    'pembina',
                    'po',
                    'anggota',
                ]),
            ],
        ]);

        foreach ($validated['items'] as $item) {
            $anggota = AnggotaAssem::find($item['anggota_id']);

            if (! $anggota || $anggota->user_id !== null) {
                continue;
            }

            $password = $item['password'] ?: 'password123';

            $user = User::create([
                'name' => $item['name'] ?: ($anggota->nama_lengkap ?? 'Anggota '.$anggota->id),
                'email' => $item['email'],
                'password' => $password,
                'role' => $item['role'],
            ]);

            $anggota->user_id = $user->id;
            $anggota->save();
        }

        return to_route('user-account.index');
    }
}

