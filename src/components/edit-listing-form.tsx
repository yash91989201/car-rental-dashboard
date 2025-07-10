import { useForm, type SubmitHandler } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { EditListingInput } from "@/lib/schema";
import type { EditListingInputType } from "@/lib/types";
import { useEditListing } from "@/hooks/use-edit-listing";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface EditListingFormProps {
  listingId: string;
  defaultValues: EditListingInputType;
}

export const EditListingForm = ({
  listingId,
  defaultValues,
}: EditListingFormProps) => {
  const { mutateAsync: editListing, isPending: isSubmitting } =
    useEditListing();

  const form = useForm<EditListingInputType>({
    resolver: standardSchemaResolver(EditListingInput),
    defaultValues,
  });

  const onSubmit: SubmitHandler<EditListingInputType> = async (formData) => {
    await editListing({
      query: { id: listingId },
      input: formData,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="carName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Honda Civic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. 2020 Model, Petrol, Automatic"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner</FormLabel>
              <FormControl>
                <Input placeholder="Owner name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle className="mr-1.5 animate-spin" />}
          Save
        </Button>
      </form>
    </Form>
  );
};

export const EditListingFormSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
};
