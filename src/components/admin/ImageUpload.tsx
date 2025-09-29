"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (url: string | null) => void; // Callback when image changes
  disabled?: boolean;
  className?: string;
  bucketName?: string; // Supabase storage bucket name
  maxFileSize?: number; // Max file size in bytes (default: 5MB)
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  className,
  bucketName = "wrestlers",
  maxFileSize = 5 * 1024 * 1024, // 5MB default
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(value || null);

  const supabase = createClient();

  // Handle file upload to Supabase Storage
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `wrestlers/${fileName}`;

      // Simulate upload progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  // Handle file deletion from Supabase Storage
  const deleteFile = async (url: string) => {
    try {
      // Extract file path from URL
      const urlParts = url.split("/");
      const bucketIndex = urlParts.findIndex((part) => part === bucketName);
      if (bucketIndex === -1) return;

      const filePath = urlParts.slice(bucketIndex + 1).join("/");

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.error("Delete error:", error);
        // Don't throw here, as the file might already be deleted
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled || acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type", {
          description: "Please upload an image file (JPG, PNG, WebP)",
        });
        return;
      }

      // Validate file size
      if (file.size > maxFileSize) {
        toast.error("File too large", {
          description: `Please upload an image smaller than ${(
            maxFileSize /
            1024 /
            1024
          ).toFixed(1)}MB`,
        });
        return;
      }

      try {
        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);

        // Upload file
        const publicUrl = await uploadFile(file);

        if (publicUrl) {
          // Clean up preview
          URL.revokeObjectURL(previewUrl);
          setPreview(publicUrl);
          onChange(publicUrl);

          toast.success("Image uploaded successfully!");
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setPreview(value || null);
        toast.error("Upload failed", {
          description: "Please try again",
        });
      }
    },
    [disabled, maxFileSize, value, onChange, bucketName]
  );

  // Handle image removal
  const handleRemove = async () => {
    if (disabled || !preview) return;

    try {
      // Delete from storage if it's a Supabase URL
      if (preview && preview.includes(bucketName)) {
        await deleteFile(preview);
      }

      // Clean up preview if it's a blob URL
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      setPreview(null);
      onChange(null);

      toast.success("Image removed");
    } catch (error) {
      console.error("Remove failed:", error);
      toast.error("Failed to remove image");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload Area */}
      {!preview && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed border-dark-700 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-dark-600 hover:bg-dark-900/50",
            isDragActive && "border-primary-500 bg-primary-500/10",
            (disabled || isUploading) && "cursor-not-allowed opacity-50"
          )}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-dark-800 rounded-full">
              <Upload className="h-8 w-8 text-dark-400" />
            </div>

            <div>
              <p className="text-lg font-medium text-dark-200">
                {isDragActive ? "Drop image here" : "Upload wrestler image"}
              </p>
              <p className="text-sm text-dark-500 mt-1">
                Drag & drop or click to select (JPG, PNG, WebP up to{" "}
                {(maxFileSize / 1024 / 1024).toFixed(1)}MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-dark-300">Uploading...</span>
            <span className="text-dark-400">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Image Preview */}
      {preview && !isUploading && (
        <div className="relative group">
          <div className="relative w-full max-w-md mx-auto bg-dark-800 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Wrestler preview"
              className="w-full h-auto object-contain max-h-96"
              onLoad={() => {
                // Clean up blob URL after image loads
                if (preview.startsWith("blob:") && value) {
                  URL.revokeObjectURL(preview);
                }
              }}
            />

            {/* Remove Button Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="cursor-pointer"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>

          {/* Image Info */}
          <div className="text-center mt-2">
            <p className="text-sm text-dark-400">
              <ImageIcon className="inline h-4 w-4 mr-1" />
              Wrestler Image
            </p>
          </div>
        </div>
      )}

      {/* Manual Upload Button (when preview exists) */}
      {preview && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  onDrop([file]);
                }
              };
              input.click();
            }}
            disabled={disabled || isUploading}
            className="cursor-pointer"
          >
            <Upload className="h-4 w-4 mr-2" />
            Change Image
          </Button>
        </div>
      )}
    </div>
  );
}
