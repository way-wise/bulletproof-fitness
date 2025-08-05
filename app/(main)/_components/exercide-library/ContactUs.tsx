"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";

interface FeedbackForm {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
}

const ContactUs = ({ exerciseLibraryId }: { exerciseLibraryId: string }) => {
  const { register, handleSubmit, reset, formState } = useForm<FeedbackForm>();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: FeedbackForm) => {
    try {
      const res = await fetch("/api/action/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast.error(result.message || "Something went wrong");
        return;
      }

      toast.success("Feedback submitted successfully");
      reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mt-5 cursor-pointer rounded bg-black px-5 py-3 text-base text-white">
            FEEDBACK? Contact Us ✉️
          </Button>
        </DialogTrigger>
        <DialogContent className="w-2/3 max-w-2/3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                Feedback Form
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register("fullName", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  {...register("message", { required: true })}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={formState.isSubmitting}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactUs;
