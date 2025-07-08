import type {
  GenerateMockListingsInputType,
  GenerateMockListingsOutputType,
  GetListingsQueryType,
  GetListingsOutputType,
  GetListingOutputType,
  GetListingQueryType,
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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return (await response.json()) as GenerateMockListingsOutputType;
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

  const response = await fetch(`/api/listings?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as GetListingsOutputType;
};

export const getListing = async (
  query: GetListingQueryType,
): Promise<GetListingOutputType> => {
  const params = new URLSearchParams();
  params.append("id", query.id);

  const response = await fetch(`/api/listings/${query.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as GetListingOutputType;
};
