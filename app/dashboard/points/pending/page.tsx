"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckIcon, XIcon, EyeIcon, AlertTriangleIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type PointTransaction = {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  actionType: string;
  referenceId?: string;
  points: number;
  description: string;
  status: string;
  createdAt: string;
  notes?: string;
};

const actionTypeColors = {
  LIKE: "bg-blue-100 text-blue-800",
  DISLIKE: "bg-orange-100 text-orange-800",
  RATING: "bg-purple-100 text-purple-800",
  UPLOAD_EXERCISE: "bg-indigo-100 text-indigo-800",
  UPLOAD_LIBRARY: "bg-indigo-100 text-indigo-800",
  DEMO_CENTER: "bg-teal-100 text-teal-800",
};

export default function PendingApprovalsPage() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<PointTransaction | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const { data, error, isLoading, mutate } = useSWR(
    "/api/features/points?pending=true&limit=50",
    fetcher,
  );

  const handleApprove = async (transactionId: string) => {
    setIsApproving(true);
    try {
      const response = await fetch(
        `/api/features/points/transactions/${transactionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "approve",
            approvedBy: "admin", // In real app, get from session
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to approve transaction");
      }

      toast.success("Transaction approved successfully");
      mutate();
    } catch (error) {
      toast.error("Failed to approve transaction");
      console.error("Approval error:", error);
    } finally {
      setIsApproving(false);
      setSelectedTransaction(null);
    }
  };

  const handleReject = async (transactionId: string, notes?: string) => {
    setIsRejecting(true);
    try {
      const response = await fetch(
        `/api/features/points/transactions/${transactionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "reject",
            approvedBy: "admin", // In real app, get from session
            notes: notes || "Rejected by admin",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reject transaction");
      }

      toast.success("Transaction rejected successfully");
      mutate();
    } catch (error) {
      toast.error("Failed to reject transaction");
      console.error("Rejection error:", error);
    } finally {
      setIsRejecting(false);
      setSelectedTransaction(null);
      setRejectionNotes("");
    }
  };

  const confirmReject = () => {
    if (selectedTransaction) {
      handleReject(selectedTransaction.id, rejectionNotes);
    }
  };

  const transactions = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pending Approvals</h1>
          <p className="text-gray-600">
            Review and approve point transactions awaiting verification
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => mutate()}>
            Refresh
          </Button>
        </div>
      </div>

      {transactions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckIcon className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Pending Approvals
            </h3>
            <p className="text-gray-500">
              All point transactions have been processed. Great job!
            </p>
          </CardContent>
        </Card>
      )}

      {transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
              {transactions.length} Pending Transaction
              {transactions.length !== 1 ? "s" : ""}
            </CardTitle>
            <CardDescription>
              Review these transactions and approve or reject them
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span>
                    Failed to load pending transactions. Please try again.
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction: PointTransaction) => (
                  <div
                    key={transaction.id}
                    className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <Badge
                            className={
                              actionTypeColors[
                                transaction.actionType as keyof typeof actionTypeColors
                              ]
                            }
                          >
                            {transaction.actionType.replace("_", " ")}
                          </Badge>
                          <span
                            className={`font-medium ${transaction.points > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {transaction.points > 0 ? "+" : ""}
                            {transaction.points} points
                          </span>
                          <span className="text-sm text-gray-500">
                            {format(
                              new Date(transaction.createdAt),
                              "MMM dd, yyyy HH:mm",
                            )}
                          </span>
                        </div>

                        <div className="mb-2">
                          <div className="font-medium text-gray-900">
                            {transaction.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.user.email}
                          </div>
                        </div>

                        <div className="mb-2 text-sm text-gray-600">
                          {transaction.description}
                        </div>

                        {transaction.referenceId && (
                          <div className="text-xs text-gray-400">
                            Reference ID: {transaction.referenceId}
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleApprove(transaction.id)}
                          disabled={isApproving}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckIcon className="mr-1 h-4 w-4" />
                          Approve
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                setSelectedTransaction(transaction)
                              }
                            >
                              <XIcon className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Transaction</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to reject this point
                                transaction?
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Transaction Details
                                </label>
                                <div className="mt-2 rounded bg-gray-50 p-3 text-sm">
                                  <div>
                                    <strong>User:</strong>{" "}
                                    {selectedTransaction?.user.name}
                                  </div>
                                  <div>
                                    <strong>Action:</strong>{" "}
                                    {selectedTransaction?.actionType}
                                  </div>
                                  <div>
                                    <strong>Points:</strong>{" "}
                                    {selectedTransaction?.points}
                                  </div>
                                  <div>
                                    <strong>Description:</strong>{" "}
                                    {selectedTransaction?.description}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-medium">
                                  Rejection Reason (Optional)
                                </label>
                                <Textarea
                                  placeholder="Why are you rejecting this transaction?"
                                  value={rejectionNotes}
                                  onChange={(e) =>
                                    setRejectionNotes(e.target.value)
                                  }
                                  className="mt-2"
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedTransaction(null);
                                  setRejectionNotes("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={confirmReject}
                                disabled={isRejecting}
                              >
                                {isRejecting
                                  ? "Rejecting..."
                                  : "Reject Transaction"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
