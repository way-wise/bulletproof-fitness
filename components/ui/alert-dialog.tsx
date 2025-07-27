"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

// Modal
interface DialogProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  isPending: boolean;
  onClose: () => void;
}

const AlertDialog = ({
  title,
  children,
  isOpen = false,
  isPending = false,
  onClose,
}: DialogProps) => {
  // Close modal if closable
  const close = () => {
    if (!isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={close} transition className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/75 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex size-full items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-lg rounded-lg bg-card shadow-xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <DialogTitle className="p-5 text-lg leading-none font-medium">
            {title}
          </DialogTitle>

          <div className="px-5">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export { AlertDialog };
