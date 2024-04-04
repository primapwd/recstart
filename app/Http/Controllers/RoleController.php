<?php

namespace App\Http\Controllers;

use App\Actions\Role\DeleteRoleAction;
use App\Actions\Role\StoreRoleAction;
use App\Actions\Role\UpdateRoleAction;
use App\Http\Requests\Role\SaveRoleRequest;
use App\Models\Role;
use App\Repositories\PermissionRepository;
use App\Repositories\RoleRepository;
use App\Utils\FlashMessageBuilder;

class RoleController extends Controller
{

    function __construct(private RoleRepository $roleRepository, private PermissionRepository $permissionRepository)
    {
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia(
            'role/index',
            [
                'roles' => $this->roleRepository->getAllRoles(),
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('role/create', [
            'availablePermissions' => fn () => $this->permissionRepository->getAllPermissionsGrouped(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SaveRoleRequest $request)
    {
        (new StoreRoleAction)->execute($request->validated());

        return redirect()->route('roles.index')->with(FlashMessageBuilder::success(__('crud.store.success')));
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $role->load('permissions');

        return inertia('role/edit', [
            'role' => $role,
            'availablePermissions' => fn () => $this->permissionRepository->getAllPermissionsGrouped(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(SaveRoleRequest $request, Role $role)
    {
        (new UpdateRoleAction)->execute($role, $request->validated());
        return redirect()->route('roles.index')->with(FlashMessageBuilder::success(__('crud.update.success')));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        (new DeleteRoleAction)->execute($role);
        return redirect()->route('roles.index')->with(FlashMessageBuilder::success(__('crud.delete.success')));
    }
}
