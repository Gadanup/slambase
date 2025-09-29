"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WrestlerWithPromotion } from "@/lib/types";

interface DeleteWrestlerDialogProps {
  wrestler: WrestlerWithPromotion;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  redirectAfterDelete?: boolean;
}

export function DeleteWrestlerDialog({
  wrestler,
  onSuccess,
  trigger,
  redirectAfterDelete = false,
}: DeleteWrestlerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const deleteImageFromStorage = async (imageUrl: string | null) => {
    if (!imageUrl) return;

    try {
      const supabase = createClient();

      // Extract file path from URL
      const urlParts = imageUrl.split("/");
      const bucketIndex = urlParts.findIndex((part) => part === "wrestlers");
      if (bucketIndex === -1) return;

      const filePath = urlParts.slice(bucketIndex + 1).join("/");

      const { error } = await supabase.storage
        .from("wrestlers")
        .remove([filePath]);

      if (error) {
        console.warn("Failed to delete image from storage:", error);
        // Don't throw here, as the wrestler record is more important
      }
    } catch (error) {
      console.warn("Error deleting image:", error);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const supabase = createClient();

      // Delete the wrestler record from database
      const { error } = await supabase
        .from("wrestlers")
        .delete()
        .eq("id", wrestler.id);

      if (error) {
        throw error;
      }

      // Delete associated image from storage (non-blocking)
      if (wrestler.image_url) {
        deleteImageFromStorage(wrestler.image_url);
      }

      // Show success notification
      toast.success("Wrestler deleted!", {
        description: `${
          wrestler.ring_name || wrestler.name
        } has been removed from the roster.`,
      });

      // Close dialog
      setIsOpen(false);

      // Call success callback or redirect
      if (onSuccess) {
        onSuccess();
      }

      if (redirectAfterDelete) {
        router.push("/admin/wrestlers");
        router.refresh();
      } else {
        // Refresh current page to update the list
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting wrestler:", error);
      toast.error("Failed to delete wrestler", {
        description: "Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const defaultTrigger = (
    <Button
      variant="destructive"
      size="sm"
      className="cursor-pointer"
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="bg-dark-900 border-dark-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            Delete Wrestler
          </DialogTitle>
          <DialogDescription className="text-dark-400">
            This action cannot be undone. This will permanently delete the
            wrestler and remove all associated data.
          </DialogDescription>
        </DialogHeader>

        {/* Wrestler Info */}
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 p-4 bg-dark-800 rounded-lg">
            {wrestler.image_url ? (
              <img
                src={wrestler.image_url}
                alt={wrestler.ring_name || wrestler.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-dark-700 rounded-lg flex items-center justify-center">
                <span className="text-lg font-display text-dark-400">
                  {(wrestler.ring_name || wrestler.name).charAt(0)}
                </span>
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-medium text-dark-100">
                {wrestler.ring_name || wrestler.name}
              </h3>
              {wrestler.ring_name && (
                <p className="text-sm text-dark-400">
                  Real name: {wrestler.name}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {wrestler.promotion && (
                  <Badge
                    variant="outline"
                    className="text-xs border-secondary-500 text-secondary-400"
                  >
                    {wrestler.promotion.abbreviation || wrestler.promotion.name}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-xs border-primary-500 text-primary-400"
                >
                  {wrestler.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <p className="font-medium mb-1">Warning:</p>
            <ul className="space-y-1 text-xs">
              <li>• Wrestler profile will be permanently deleted</li>
              <li>• Associated image will be removed from storage</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Wrestler
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
