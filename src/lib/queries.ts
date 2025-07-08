import type {
  GenerateMockListingsInputType,
  GenerateMockListingsOutputType,
  GetListingsInputType,
  GetListingsOutputType,
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
  input: GetListingsInputType,
): Promise<GetListingsOutputType> => {
  const response = await fetch("/api/listings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return (await response.json()) as GetListingsOutputType;
};
