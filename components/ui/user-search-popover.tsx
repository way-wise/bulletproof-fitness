"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

import { useUserSuggestions } from "@/hooks/useUserSuggestions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserSearchPopoverProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface UserSuggestion {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export function UserSearchPopover({
  value,
  onChange,
  placeholder = "Search by Username...",
  className,
}: UserSearchPopoverProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedUser, setSelectedUser] = useState<UserSuggestion | null>(null);
  const [hasUserSelected, setHasUserSelected] = useState(false);

  const { suggestions, isLoading } = useUserSuggestions({
    searchQuery: inputValue,
    enabled: inputValue.length >= 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear selected user if input doesn't match
    if (
      selectedUser &&
      !newValue.toLowerCase().includes(selectedUser.name.toLowerCase())
    ) {
      setSelectedUser(null);
      setHasUserSelected(false);
      onChange(""); // Clear parent value when user clears selection
    }

    // Show popover only if input has 2+ characters
    if (newValue.length >= 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }

    // If input is empty, clear everything
    if (newValue === "") {
      setSelectedUser(null);
      setHasUserSelected(false);
      onChange("");
    }

    // Don't update parent onChange while user is typing
    // Only update when user selects from popover
  };

  const handleUserSelect = (user: UserSuggestion) => {
    setSelectedUser(user);
    setInputValue(user.name);
    setHasUserSelected(true);
    onChange(user.name); // Only update parent when user selects
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedUser(null);
    setInputValue("");
    setHasUserSelected(false);
    onChange(""); // Clear parent value
    setOpen(false);
  };

  const handleInputFocus = () => {
    // Only show popover if there's enough text
    if (inputValue.length >= 2) {
      setOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Delay closing to allow for suggestion clicks
    setTimeout(() => setOpen(false), 100);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full rounded-sm py-4 pr-8 text-[14px]"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Custom dropdown without Popover */}
      {open && (
        <div className="absolute top-full right-0 left-0 z-50 mt-1 rounded-md border bg-white shadow-md">
          {isLoading ? (
            <div className="p-3 text-sm text-gray-500">Searching users...</div>
          ) : suggestions.length > 0 ? (
            <div className="max-h-60 overflow-y-auto">
              {suggestions.map((user) => (
                <div
                  key={user.id}
                  className="flex cursor-pointer items-center gap-3 border-b p-3 last:border-b-0 hover:bg-gray-50"
                  onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                  onClick={() => handleUserSelect(user)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.image || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-left text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-sm text-gray-500">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}
