import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { getListingQueryOptions } from "@/hooks/use-get-listing";
import type { EditListingInputType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { EditListingInput } from "@/lib/schema";
import { useEffect } from "react";
import { useEditListing } from "@/hooks/use-edit-listing";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function EditListingPage() {
  const router = useRouter();

  const { id } = router.query;
  const listingId = id ? (Array.isArray(id) ? id[0] : id) : undefined;

  const { data, isFetching } = useQuery({
    ...getListingQueryOptions({ id: listingId! }),
    enabled: !!listingId,
  });

  const { mutateAsync: editListing } = useEditListing();

  const form = useForm<EditListingInputType>({
    resolver: standardSchemaResolver(EditListingInput),
    defaultValues: {
      carName: "",
      description: "",
      owner: "",
    },
  });

  const listing = data?.data?.listing;

  useEffect(() => {
    if (listing) {
      form.setValue("carName", listing.carName);
      form.setValue("description", listing.description);
      form.setValue("owner", listing.owner);
    }
  }, [listingId, isFetching, form, listing]);

  const onSubmit: SubmitHandler<EditListingInputType> = async (formData) => {
    if (!listingId) return;
    await editListing({
      query: { id: listingId },
      input: formData,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="carName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Car Name</FormLabel>
              <FormControl>
                <Input placeholder="Car Name" {...field} />
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
                <Input placeholder="Description" {...field} />
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
                <Input placeholder="Owner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
