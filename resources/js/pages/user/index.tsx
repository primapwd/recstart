import { DataTable } from "@/components/ui/data-table";
import MainLayout from "@/layouts/main-layout";
import { PageProps } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { TUserData, columns } from "./components/columns";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LuFilter, LuFilterX, LuPlusCircle, LuSearch } from "react-icons/lu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";

const PageToolbar = () => {
    return (
        <div>
            <Button asChild>
                <Link href={route("users.create")}>
                    <LuPlusCircle className="mr-2 text-base" /> New Data
                </Link>
            </Button>
        </div>
    );
};

type TFilterRole = Role & { users_count: number };

type TDataFilters = {
    roles: string[];
};

type IndexProps = PageProps<{
    users: TUserData[];
    roles: TFilterRole[];
    filters: TDataFilters;
}>;

export default function Index({ users, roles, filters }: IndexProps) {
    const [search, setSearch] = useState<string>("");
    const [dataFilter, setDataFilter] = useState<TDataFilters>(filters);
    const [debouncedDataFilter] = useDebounce(dataFilter, 300);
    const isMounted = useRef(false);

    const handleOnRoleCheckedChange = (
        roleID: string,
        checked: CheckedState
    ) => {
        if (checked === true) {
            setDataFilter((previous) => ({
                ...previous,
                roles: [...previous.roles, roleID],
            }));
        } else {
            setDataFilter((previous) => ({
                ...previous,
                roles: previous.roles.filter((item) => item !== roleID),
            }));
        }
    };

    const clearRoleFilter = () =>
        setDataFilter((previous) => ({
            ...previous,
            roles: [],
        }));

    useEffect(() => {
        if (isMounted.current === true) {
            router.visit(route("users.index", debouncedDataFilter), {
                only: ["users", "filters"],
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            isMounted.current = true;
        }
    }, [debouncedDataFilter]);

    console.info(dataFilter);

    return (
        <MainLayout
            title="Manage Users"
            subTitle="Manage users data in here."
            pageToolbar={<PageToolbar />}
        >
            <Head title="Users" />

            <div className="bg-white rounded-md shadow">
                <div className="flex flex-row p-5 gap-x-2">
                    <div className="relative flex items-center w-full max-w-xs">
                        <LuSearch className="absolute ml-2 text-gray-400" />
                        <Input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Type here to search..."
                            className="pl-8 placeholder:text-gray-400"
                        />
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="text-gray-700">
                                {dataFilter.roles.length > 0 ? (
                                    <LuFilterX className="mr-2" />
                                ) : (
                                    <LuFilter className="mr-2" />
                                )}{" "}
                                Role
                                {dataFilter.roles.length > 0 && (
                                    <>
                                        <Separator
                                            orientation="vertical"
                                            className="mx-2"
                                        />
                                        <Badge
                                            variant={"secondary"}
                                            className="text-gray-500"
                                        >
                                            {dataFilter.roles.length} selected
                                        </Badge>
                                    </>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 pt-4 w-52" align="start">
                            <div className="space-y-3">
                                {roles.map((role) => (
                                    <div
                                        className="flex justify-between"
                                        key={role.id}
                                    >
                                        <label className="flex items-center">
                                            <Checkbox
                                                value={role.id}
                                                checked={dataFilter.roles.includes(
                                                    String(role.id)
                                                )}
                                                onCheckedChange={(checked) => {
                                                    handleOnRoleCheckedChange(
                                                        String(role.id),
                                                        checked
                                                    );
                                                }}
                                            />
                                            <span className="text-sm ms-2">
                                                {role.name.replaceAll("-", " ")}
                                            </span>
                                        </label>
                                        <div className="text-sm font-light">
                                            {role.users_count}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {dataFilter.roles.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <Separator />
                                    <Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        className="w-full"
                                        onClick={() => clearRoleFilter()}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>
                </div>

                <DataTable
                    columns={columns}
                    data={users}
                    globalFilter={search}
                />
            </div>
        </MainLayout>
    );
}
