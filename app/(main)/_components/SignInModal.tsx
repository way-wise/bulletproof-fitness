import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SigninForm from "../auth/sign-in/signin-form";
const SignInModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl p-0 sm:max-w-md">
        <SigninForm />
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
