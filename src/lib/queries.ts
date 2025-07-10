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
): Promise<GetListingsOutputType> => {
  const params = new URLSearchParams();

  Object.keys(query).forEach((key) => {
    const value = query[key as keyof GetListingsQueryType];
    if (value !== undefined) {
      if (typeof value === "string" && value.length === 0) return;

      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  const url = queryString ? `/api/listings?${queryString}` : "/api/listings";

  const response = await fetch(url);
  const output = (await response.json()) as GetListingsOutputType;

  if (!output.success) {
    throw new Error(output.message);
  }

  return output;
};

export const getListing = async (
  query: GetListingQueryType,
): Promise<GetListingOutputType> => {
  const response = await fetch(`/api/listings/${query.id}`);
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
): Promise<GetListingLogOutputType> => {
  const url = `/api/listings/${query.id}/log`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const output = (await response.json()) as GetListingLogOutputType;

  if (!output.success) {
    throw new Error(output.message);
  }

  return output;
};
