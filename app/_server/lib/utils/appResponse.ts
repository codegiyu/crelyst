/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

export function sendResponse(
  statusCode: number = 200,
  data: Record<string, any> | string | null,
  message: string
) {
  const newTokens: {
    newAccessToken?: string;
    newRefreshToken?: string;
  } = {};

  return NextResponse.json(
    {
      status: true,
      data: data,
      ...(newTokens?.newAccessToken && newTokens),
      responseCode: statusCode,
      message: message ?? 'Success',
    },
    { status: statusCode }
  );
}
