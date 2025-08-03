"use client";

import { Button } from "@/components/ui/button";
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
import { rackSchema } from "@/schema/rackSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { InferType } from "yup";

type TRack = {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

interface UpdateRacksProps {
  isOpen: boolean;
  onClose: () => void;
  rack: TRack | null;
  url: string;
}

const UpdateRacks = ({ isOpen, onClose, rack, url }: UpdateRacksProps) => {
  // Update Rack Form
  const updateRackForm = useForm({
    resolver: yupResolver(rackSchema),
    defaultValues: {
      name: "",
    },
  });

  // Set form values when rack data changes
  useEffect(() => {
    if (rack) {
      updateRackForm.reset({
        name: rack.name,
      });
    }
  }, [rack, updateRackForm]);

  // Handle Update Rack
  const handleUpdateRack = async (values: InferType<typeof rackSchema>) => {
    if (!rack || !rack.id) return;

    try {
      const response = await fetch(`/api/racks/${rack.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update rack");
      }

      toast.success("Rack updated successfully");
      onClose();
      updateRackForm.reset();
      mutate(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update rack",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Rack"
      isPending={updateRackForm.formState.isSubmitting}
    >
      <Form {...updateRackForm}>
        <form onSubmit={updateRackForm.handleSubmit(handleUpdateRack)}>
          <FormFieldset disabled={updateRackForm.formState.isSubmitting}>
            <FormField
              control={updateRackForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rack Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Rack Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 py-5">
              <Button
                type="button"
                onClick={() => {
                  onClose();
                  updateRackForm.reset();
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={updateRackForm.formState.isSubmitting}
              >
                Update
              </Button>
            </div>
          </FormFieldset>
        </form>
      </Form>
    </Modal>
  );
};

export default UpdateRacks;
