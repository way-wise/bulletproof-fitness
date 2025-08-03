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
import { bodyPartSchema } from "@/schema/bodyparts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mutate } from "swr";
import { InferType } from "yup";

type TBodyPart = {
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

interface UpdatesBodyPartsProps {
  isOpen: boolean;
  onClose: () => void;
  bodyPart: TBodyPart | null;
  url: string;
}

const UpdatesBodyParts = ({
  isOpen,
  onClose,
  bodyPart,
  url,
}: UpdatesBodyPartsProps) => {
  // Update Body Part Form
  const updateBodyPartForm = useForm({
    resolver: yupResolver(bodyPartSchema),
    defaultValues: {
      name: "",
    },
  });

  // Set form values when rack data changes
  useEffect(() => {
    if (bodyPart) {
      updateBodyPartForm.reset({
        name: bodyPart.name,
      });
    }
  }, [bodyPart, updateBodyPartForm]);

  // Handle Update Rack
  const handleUpdateBodyPart = async (
    values: InferType<typeof bodyPartSchema>,
  ) => {
    if (!bodyPart || !bodyPart.id) return;

    try {
      const response = await fetch(`/api/body-parts/${bodyPart.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update body part");
      }

      toast.success("Body part updated successfully");
      onClose();
      updateBodyPartForm.reset();
      mutate(url);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update body part",
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Body Part"
      isPending={updateBodyPartForm.formState.isSubmitting}
    >
      <Form {...updateBodyPartForm}>
        <form onSubmit={updateBodyPartForm.handleSubmit(handleUpdateBodyPart)}>
          <FormFieldset disabled={updateBodyPartForm.formState.isSubmitting}>
            <FormField
              control={updateBodyPartForm.control}
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
                  updateBodyPartForm.reset();
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={updateBodyPartForm.formState.isSubmitting}
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

export default UpdatesBodyParts;
