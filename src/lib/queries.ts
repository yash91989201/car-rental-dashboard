// TYPES
import { env } from "@/env";
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
  DeleteListingOutputType,
  DeleteListingQueryType,
  GetListingLogQueryType,
  GetListingLogOutputType,
} from "@/lib/types";

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

  const output = (await response.json()) as GenerateMockListingsOutputType;

  if (!output.success) {
    throw new Error(output.message);
  }

  return output;
};

export const getListings = async (
  query: GetListingsQueryType,
  headers?: HeadersInit,
): Promise<GetListingsOutputType> => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (
      value !== undefined &&
      !(typeof value === "string" && value.length === 0)
    ) {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  const isServer = typeof window === "undefined";

  const baseUrl = isServer
    ? `${env.NEXT_PUBLIC_BASE_URL}/api/listings`
    : `/api/listings`;

  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const response = await fetch(url, {
    headers: isServer ? headers : undefined,
  });

  const output = (await response.json()) as GetListingsOutputType;

  if (!output.success) {
    throw new Error(output.message);
  }

  return output;
};

export const getListing = async (
  query: GetListingQueryType,
  headers?: HeadersInit,
): Promise<GetListingOutputType> => {
  const isServer = typeof window === "undefined";

  const baseUrl = isServer
    ? `${env.NEXT_PUBLIC_BASE_URL}/api/listings`
    : `/api/listings`;

  const url = `${baseUrl}/${query.id}`;

  const response = await fetch(url, {
    headers: isServer ? headers : undefined,
  });

  const output = (await response.json()) as GetListingOutputType;

  if (!output.success) {
    throw new Error(output.message);
  }

  return output;
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

  const output = (await response.json()) as UpdateListingStatusOutputType;

  if (!output.success) {
    throw new Error(output.message);
  }

  return output;
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

  const output = (await response.json()) as EditListingOutputType;

  if (!output.success) {
    throw new Error(output.message);
  }

  return output;
};

export const deleteListing = async (
  query: DeleteListingQueryType,
): Promise<DeleteListingOutputType> => {
  const url = `/api/listings/${query.id}/delete`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const output = (await response.json()) as DeleteListingOutputType;

  if (!output.success) {
    throw new Error(output.message);
  }

  return output;
};

export const getListingLog = async (
  query: GetListingLogQueryType,
  headers?: HeadersInit,
): Promise<GetListingLogOutputType> => {
  const isServer = typeof window === "undefined";

  const baseUrl = isServer
    ? `${env.NEXT_PUBLIC_BASE_URL}/api/listings`
    : `/api/listings`;

  const url = `${baseUrl}/${query.id}/log`;

  const response = await fetch(url, {
    headers: isServer ? headers : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const output = (await response.json()) as GetListingLogOutputType;

  if (!output.success) {
    throw new Error(output.message);
  }

  return output;
};
