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
import { admin } from "@/lib/auth-client";
import { formatDate } from "@/lib/date-format";
import { signUpSchema } from "@/schema/authSchema";
import { User } from "@/schema/userSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Ban, Eye, MoreVertical, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { InferType } from "yup";

export const UsersTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [unbanModalOpen, setUnbanModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  // Get users data
  const url = `/api/users?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
  const { isValidating, data } = useSWR(url);

  // Add User Form
  const addUserForm = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handle Add User
  const handleAddUser = async (values: InferType<typeof signUpSchema>) => {
    const { error } = await admin.createUser({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setAddUserModalOpen(false);
      addUserForm.reset();
      return toast.error(error.message);
    }

    toast.success("User added successfully");
    setAddUserModalOpen(false);
    addUserForm.reset();
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

  // Table columns
  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
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
    // {
    //   header: "Updated At",
    //   accessorKey: "updatedAt",
    //   cell: ({ row }) => formatDate(row.original.updatedAt),
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const { id, banned } = row.original;

        return (
          <>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <MoreVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/users/${id}`}>
                    <Eye />
                    <span>View</span>
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Pencil />
                  <span>Edit</span>
                </DropdownMenuItem> */}
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
        <div className="flex items-center justify-between gap-4 pb-6">
          <Input type="search" placeholder="Search..." className="max-w-xs" />
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
    </>
  );
};
