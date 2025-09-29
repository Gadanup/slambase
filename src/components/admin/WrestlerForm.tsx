"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedDatePicker } from "@/components/ui/enhanced-date-picker";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Wrestler, Promotion } from "@/lib/types";

// Updated validation schema with image_url
const wrestlerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  ring_name: z.string().optional(),
  bio: z.string().optional(),
  birthplace: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  finishing_move: z.string().optional(),
  signature_move: z.string().optional(),
  debut_date: z.date().optional(),
  birth_date: z.date().optional(),
  promotion_id: z.number().optional().nullable(),
  brand: z.string().optional(),
  status: z.enum(["active", "retired", "released", "injured"]),
  image_url: z.string().url().optional().or(z.literal("")), // Added image_url field
});

type WrestlerFormValues = z.infer<typeof wrestlerSchema>;

interface WrestlerFormProps {
  wrestler?: Wrestler;
  promotions: Promotion[];
}

export function WrestlerForm({ wrestler, promotions }: WrestlerFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!wrestler;

  const form = useForm<WrestlerFormValues>({
    resolver: zodResolver(wrestlerSchema),
    defaultValues: {
      name: wrestler?.name || "",
      ring_name: wrestler?.ring_name || "",
      bio: wrestler?.bio || "",
      birthplace: wrestler?.birthplace || "",
      height: wrestler?.height || "",
      weight: wrestler?.weight || "",
      finishing_move: wrestler?.finishing_move || "",
      signature_move: wrestler?.signature_move || "",
      debut_date: wrestler?.debut_date
        ? new Date(wrestler.debut_date)
        : undefined,
      birth_date: wrestler?.birth_date
        ? new Date(wrestler.birth_date)
        : undefined,
      promotion_id: wrestler?.promotion_id || null,
      brand: wrestler?.brand || "",
      status: wrestler?.status || "active",
      image_url: wrestler?.image_url || "", // Added image_url default
    },
  });

  async function onSubmit(values: WrestlerFormValues) {
    setIsLoading(true);

    try {
      const supabase = createClient();

      // Format dates for database
      const formattedData = {
        ...values,
        debut_date: values.debut_date
          ? format(values.debut_date, "yyyy-MM-dd")
          : null,
        birth_date: values.birth_date
          ? format(values.birth_date, "yyyy-MM-dd")
          : null,
        image_url: values.image_url || null, // Handle empty string as null
      };

      if (isEditing) {
        // Update existing wrestler
        const { error } = await supabase
          .from("wrestlers")
          .update(formattedData)
          .eq("id", wrestler.id);

        if (error) throw error;

        toast.success("Wrestler updated!", {
          description: `${
            values.ring_name || values.name
          } has been updated successfully.`,
        });
      } else {
        // Create new wrestler
        const { error } = await supabase
          .from("wrestlers")
          .insert([formattedData]);

        if (error) throw error;

        toast.success("Wrestler created!", {
          description: `${
            values.ring_name || values.name
          } has been added to the roster.`,
        });
      }

      router.push("/admin/wrestlers");
      router.refresh();
    } catch (error) {
      console.error("Error saving wrestler:", error);
      toast.error("Failed to save wrestler", {
        description: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload Section */}
        <Card className="bg-dark-900 border-dark-800">
          <CardHeader>
            <CardTitle className="text-xl text-primary-400">
              Wrestler Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      bucketName="wrestlers"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="bg-dark-900 border-dark-800">
          <CardHeader>
            <CardTitle className="text-xl text-primary-400">
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Felix Anthony Cena"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Legal/birth name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ring Name */}
              <FormField
                control={form.control}
                name="ring_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ring Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Cena"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Stage/performance name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birthplace */}
              <FormField
                control={form.control}
                name="birthplace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthplace</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="West Newbury, Massachusetts"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Date */}
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <EnhancedDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select birth date"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Debut Date */}
              <FormField
                control={form.control}
                name="debut_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Debut Date</FormLabel>
                    <FormControl>
                      <EnhancedDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select debut date"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="active">
                          Active
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="retired">
                          Retired
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="injured">
                          Injured
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="released">
                          Released
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Career Information */}
        <Card className="bg-dark-900 border-dark-800">
          <CardHeader>
            <CardTitle className="text-xl text-primary-400">
              Career Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Promotion */}
              <FormField
                control={form.control}
                name="promotion_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promotion</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={(value) =>
                        field.onChange(
                          value === "none" ? null : parseInt(value)
                        )
                      }
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="cursor-pointer">
                          <SelectValue placeholder="Select promotion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="none">
                          None
                        </SelectItem>
                        {promotions.map((promotion) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={promotion.id}
                            value={promotion.id.toString()}
                          >
                            {promotion.name} ({promotion.abbreviation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Brand */}
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Raw, SmackDown, Dynamite, etc."
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Finishing Move */}
              <FormField
                control={form.control}
                name="finishing_move"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Finishing Move</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Attitude Adjustment"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Signature Move */}
              <FormField
                control={form.control}
                name="signature_move"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature Move</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Five Knuckle Shuffle"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Physical Stats */}
        <Card className="bg-dark-900 border-dark-800">
          <CardHeader>
            <CardTitle className="text-xl text-primary-400">
              Physical Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Height */}
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="6'1&quot; (185 cm)"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Weight */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="251 lbs (114 kg)"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        <Card className="bg-dark-900 border-dark-800">
          <CardHeader>
            <CardTitle className="text-xl text-primary-400">
              Biography
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter wrestler biography..."
                      className="min-h-[120px] resize-none"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief description of the wrestler's career and achievements
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="cursor-pointer"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEditing ? "Update Wrestler" : "Create Wrestler"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
