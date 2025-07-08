import type {
  GenerateMockListingsInputType,
  GenerateMockListingsOutputType,
  GetListingsQueryType,
  GetListingsOutputType,
  GetListingOutputType,
  GetListingQueryType,
  UpdateListingStatusInputType,
  UpdateListingStatusOutputType,
  UpdateListingStatusQueryType,
  EditListingInputType,
  EditListingQueryType,
  EditListingOutputType,
} from "@/lib/types";
import {
  EditListingOutput,
  GenerateMockListingsOutput,
  GetListingOutput,
  GetListingsOutput,
  UpdateListingStatusOutput,
} from "@/lib/schema";

export const generateMockListings = async (
  input: GenerateMockListingsInputType,
): Promise<GenerateMockListingsOutputType> => {
  const response = await fetch("/api/listings/mock", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return GenerateMockListingsOutput.parse(await response.json());
};

export const getListings = async (
  query: GetListingsQueryType,
): Promise<GetListingsOutputType> => {
  const params = new URLSearchParams();

  if (query.page) {
    params.append("page", query.page.toString());
  }
  if (query.count) {
    params.append("count", query.count.toString());
  }

  const queryString = params.toString();
  const url = queryString ? `/api/listings?${queryString}` : "/api/listings";

  const response = await fetch(url);

  return GetListingsOutput.parse(await response.json());
};

export const getListing = async (
  query: GetListingQueryType,
): Promise<GetListingOutputType> => {
  const response = await fetch(`/api/listings/${query.id}`);

  return GetListingOutput.parse(await response.json());
};

export const updateListingStatus = async (
  query: UpdateListingStatusQueryType,
  input: UpdateListingStatusInputType,
): Promise<UpdateListingStatusOutputType> => {
  const url = `/api/listings/${query.id}/update-status`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return UpdateListingStatusOutput.parse(await response.json());
};

export const editListing = async (
  query: EditListingQueryType,
  input: EditListingInputType,
): Promise<EditListingOutputType> => {
  const url = `/api/listings/${query.id}/edit`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return EditListingOutput.parse(await response.json());
};
