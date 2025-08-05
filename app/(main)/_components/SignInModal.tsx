import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SignInPage from "../auth/sign-in/page";
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
        <SignInPage />
      </DialogContent>
    </Dialog>
  );
};

export default SignInModal;
