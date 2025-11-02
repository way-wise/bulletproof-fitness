"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormFieldset,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { admin } from "@/lib/auth-client";
import { formatDate } from "@/lib/date-format";
import { signUpSchema } from "@/schema/authSchema";
import { User } from "@/schema/userSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  Ban,
  Eye,
  MoreVertical,
  Plus,
  Trash,
  UserCog,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { InferType } from "yup";
import { TableFilters, FilterValues } from "../_components/shared/TableFilters";

export const UsersTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [unbanModalOpen, setUnbanModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [updateRoleModalOpen, setUpdateRoleModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>("");
  const [selectedRole, setSelectedRole] = useState<string>("user");
  const [updatingRole, setUpdatingRole] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  // Filter state
  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    role: [],
    banned: [],
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Build URL with all filters
  const buildUrl = () => {
    const params = new URLSearchParams({
      page: pagination.pageIndex.toString(),
      limit: pagination.pageSize.toString(),
    });

    if (filters.search) params.append("search", filters.search);
    if (Array.isArray(filters.role) && filters.role.length > 0) {
      params.append("role", filters.role[0]);
    }
    if (Array.isArray(filters.banned) && filters.banned.length > 0) {
      params.append("banned", filters.banned[0]);
    }
    if (filters.sortBy) params.append("sortBy", filters.sortBy);
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

    return `/api/users?${params.toString()}`;
  };

  const url = buildUrl();
  const { isValidating, data } = useSWR(url);

  // Fetch roles list with shared cache key (excluding admin role)
  const { data: rolesData } = useSWR("/api/admin/roles", {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    dedupingInterval: 2000,
  });

  // Filter out admin role from the list
  const availableRoles = rolesData?.filter((role: any) => role.name !== "admin") || [];

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  }, [filters]);

  // Revalidate roles when add user modal opens
  useEffect(() => {
    if (addUserModalOpen) {
      mutate("/api/admin/roles");
    }
  }, [addUserModalOpen]);

  // Add User Form
  const addUserForm = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [newUserRole, setNewUserRole] = useState("user");

  // Handle Add User
  const handleAddUser = async (values: InferType<typeof signUpSchema>) => {
    const { error, data } = await admin.createUser({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setAddUserModalOpen(false);
      addUserForm.reset();
      return toast.error(error.message);
    }

    // Update the user's role if it's not the default "user"
    if (data?.user?.id && newUserRole !== "user") {
      try {
        await fetch(`/api/users/${data.user.id}/role`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newUserRole }),
        });
      } catch (err) {
        console.error("Failed to set user role:", err);
      }
    }

    toast.success("User added successfully");
    setAddUserModalOpen(false);
    addUserForm.reset();
    setNewUserRole("user");
    mutate(url);
  };

  // Ban Form
  const banForm = useForm({
    defaultValues: {
      banReason: "",
    },
  });

  // Handle User Ban
  const handleBanUser = async () => {
    const { error } = await admin.banUser({
      userId,
      banReason: banForm.getValues("banReason"),
    });

    if (error) {
      setBanModalOpen(false);
      banForm.reset();
      return toast.error(error.message);
    }

    toast.error("User banned");
    setBanModalOpen(false);
    banForm.reset();
    mutate(url);
  };

  // Unban Form
  const unbanForm = useForm();
  const handleUnbanUser = async () => {
    const { error } = await admin.unbanUser({
      userId,
    });

    if (error) {
      setUnbanModalOpen(false);
      return toast.error(error.message);
    }

    toast.success("User unbanned");
    setUnbanModalOpen(false);
    mutate(url);
  };

  // Delete Form
  const deleteForm = useForm();

  // Handle User Deletion
  const handleDeleteUser = async () => {
    const { error, data } = await admin.removeUser({
      userId,
    });

    if (error) {
      toast.error(error.message);
    }

    if (data?.success) {
      toast.success("User deleted successfully");
    }

    setDeleteModalOpen(false);
    mutate(url);
  };

  // Handle Update Role
  const handleUpdateRole = async () => {
    setUpdatingRole(true);
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (res.ok) {
        toast.success("User role updated successfully");
        setUpdateRoleModalOpen(false);
        mutate(url);
        mutate("/api/admin/roles"); // Revalidate roles cache
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update role");
      }
    } catch (error) {
      toast.error("Failed to update role");
    } finally {
      setUpdatingRole(false);
    }
  };

  // Table columns
  const columns: ColumnDef<User>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    // {
    //   header: () => (
    //     <div className="flex items-center justify-center">Email Verified</div>
    //   ),
    //   accessorKey: "emailVerified",
    //   cell: ({ row }) => {
    //     return (
    //       <div className="text-center">
    //         {row.original.emailVerified ? (
    //           <Badge variant="success" size="icon">
    //             <Check className="size-4" />
    //           </Badge>
    //         ) : (
    //           <Badge variant="destructive" size="icon">
    //             <X className="size-4" />
    //           </Badge>
    //         )}
    //       </div>
    //     );
    //   },
    // },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => {
        return row.original.role === "admin" ? (
          <Badge variant="success">Admin</Badge>
        ) : (
          <Badge variant="secondary">User</Badge>
        );
      },
    },
    {
      header: "Banned",
      accessorKey: "banned",
      cell: ({ row }) => {
        return row.original.banned ? (
          <Badge variant="destructive">Banned</Badge>
        ) : (
          <Badge variant="secondary">Not Banned</Badge>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id, banned, role } = row.original;
        const isAdminUser = role === "admin";

        return (
          <>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/users/${id}`}>
                    <Eye />
                    <span>View</span>
                  </Link>
                </DropdownMenuItem>
                {!isAdminUser && (
                  <DropdownMenuItem
                    onClick={() => {
                      setUserId(id);
                      setSelectedRole(row.original.role || "user");
                      setUpdateRoleModalOpen(true);
                    }}
                  >
                    <UserCog />
                    <span>Update Role</span>
                  </DropdownMenuItem>
                )}
                {!isAdminUser && (
                  <>
                    {banned ? (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          setUserId(id);
                          setUnbanModalOpen(true);
                        }}
                      >
                        <Ban />
                        <span>Unban</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          setUserId(id);
                          setBanModalOpen(true);
                        }}
                      >
                        <Ban />
                        <span>Ban</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => {
                        setUserId(id);
                        setDeleteModalOpen(true);
                      }}
                    >
                      <Trash />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-medium">Users</h1>
        <Button onClick={() => setAddUserModalOpen(true)}>
          <Plus />
          <span>Add User</span>
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-6">
        {/* Filters */}
        <div className="mb-6">
          <TableFilters
            config={{
              showSearch: true,
              searchPlaceholder: "Search by name or email...",
              multiSelects: [
                {
                  key: "role",
                  label: "Role",
                  placeholder: "Filter by role",
                  options:
                    availableRoles.map((role: any) => ({
                      value: role.name,
                      label:
                        role.name.charAt(0).toUpperCase() + role.name.slice(1),
                    })),
                },
                {
                  key: "banned",
                  label: "Banned Users",
                  placeholder: "Show banned users",
                  options: [{ value: "true", label: "Banned" }],
                },
              ],
              sortOptions: [
                { field: "createdAt", label: "Created Date" },
                { field: "updatedAt", label: "Updated Date" },
                { field: "name", label: "Name" },
                { field: "email", label: "Email" },
                { field: "totalPoints", label: "Total Points" },
              ],
            }}
            values={filters}
            onChange={setFilters}
          />
        </div>

        <DataTable
          data={data}
          columns={columns}
          isPending={isValidating}
          pagination={pagination}
          onPaginationChange={setPagination}
        />
      </div>

      {/* User Creation Modal */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Add User"
        isPending={addUserForm.formState.isSubmitting}
      >
        <Form {...addUserForm}>
          <form onSubmit={addUserForm.handleSubmit(handleAddUser)}>
            <FormFieldset disabled={addUserForm.formState.isSubmitting}>
              <FormField
                control={addUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addUserForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {availableRoles.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Role
                  </label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      {availableRoles.map((role: any) => (
                        <SelectItem key={role.id} value={role.name}>
                          <span className="capitalize">{role.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => {
                    setAddUserModalOpen(false);
                    addUserForm.reset();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={addUserForm.formState.isSubmitting}
                >
                  Add
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Ban User Modal */}
      <Modal
        isOpen={banModalOpen}
        onClose={() => setBanModalOpen(false)}
        title="Ban User"
        isPending={banForm.formState.isSubmitting}
      >
        <Form {...banForm}>
          <form onSubmit={banForm.handleSubmit(handleBanUser)}>
            <FormFieldset disabled={banForm.formState.isSubmitting}>
              <p className="mb-5 text-muted-foreground">
                This will prevent the user from logging in and using the
                application.
              </p>
              <FormField
                control={banForm.control}
                name="banReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ban Reason</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter ban reason" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => {
                    setBanModalOpen(false);
                    banForm.reset();
                  }}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  isLoading={banForm.formState.isSubmitting}
                >
                  Continue
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Unban User Modal */}
      <Modal
        isOpen={unbanModalOpen}
        onClose={() => setUnbanModalOpen(false)}
        title="Unban User"
        isPending={unbanForm.formState.isSubmitting}
      >
        <Form {...unbanForm}>
          <form onSubmit={unbanForm.handleSubmit(handleUnbanUser)}>
            <FormFieldset disabled={unbanForm.formState.isSubmitting}>
              <p className="mb-5 text-muted-foreground">
                This will allow the user to log in and use the application
                again.
              </p>
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => setUnbanModalOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  isLoading={unbanForm.formState.isSubmitting}
                >
                  Continue
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User"
        isPending={deleteForm.formState.isSubmitting}
      >
        <Form {...deleteForm}>
          <form onSubmit={deleteForm.handleSubmit(handleDeleteUser)}>
            <FormFieldset disabled={deleteForm.formState.isSubmitting}>
              <p className="text-muted-foreground">
                This action cannot be undone. This will permanently delete the
                user and remove associated data.
              </p>
              <div className="flex justify-end gap-3 py-5">
                <Button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  isLoading={deleteForm.formState.isSubmitting}
                >
                  Continue
                </Button>
              </div>
            </FormFieldset>
          </form>
        </Form>
      </Modal>

      {/* Update Role Modal */}
      <Modal
        isOpen={updateRoleModalOpen}
        onClose={() => setUpdateRoleModalOpen(false)}
        title="Update User Role"
        isPending={false}
      >
        <div>
          <div>
            <label className="mb-2 block text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Role
            </label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={5}>
                {availableRoles.map((role: any) => (
                  <SelectItem key={role.id} value={role.name}>
                    <span className="capitalize">{role.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 py-5">
            <Button
              type="button"
              onClick={() => setUpdateRoleModalOpen(false)}
              variant="secondary"
              disabled={updatingRole}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={updatingRole}>
              {updatingRole && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Role
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
