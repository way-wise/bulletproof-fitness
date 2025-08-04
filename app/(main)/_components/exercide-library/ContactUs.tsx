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

const ContactUs = ({ exerciseLibraryId }: { exerciseLibraryId: string }) => {
  const form = useForm();

  return (
    <div>
      <Dialog>
        <form onSubmit={(e) => {}}>
          <DialogTrigger asChild>
            <Button className="mt-5 cursor-pointer rounded bg-black px-5 py-3 text-base text-white">
              {" "}
              FEEDBACK? Contact Us ✉️
            </Button>
          </DialogTrigger>
          <DialogContent className="w-2/3 max-w-2/3">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">
                Feedback Form
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Full Name</Label>
                <Input id="name-1" name="name" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Email</Label>
                <Input id="username-1" name="username" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Phone</Label>
                <Input id="username-1" name="username" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Message</Label>
                <Input id="username-1" name="username" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default ContactUs;
