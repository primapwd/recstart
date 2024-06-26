<?php

namespace App\Repositories;

use App\Models\Role;

class RoleRepository extends BaseRepository
{

    public function __construct(Role $role)
    {
        $this->model = $role;
    }

    function getAllRoles(bool $withUsersCount = false)
    {
        return $this->model->query()
            ->when($withUsersCount, fn ($query) => $query->withCount('users'))
            ->where('name', '<>', 'Superadmin')
            ->get();
    }
}
