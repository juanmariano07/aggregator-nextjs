import { NextResponse } from "next/server";
import { getAggregatedDataset } from "@/services/aggregator";

export const revalidate = 60;

export async function GET() {
  const dataset = await getAggregatedDataset();

  return NextResponse.json(dataset, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
    },
  });
}
