/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { JSON_NO_STORE_HEADERS } from './httpNoCacheHeaders';
import { serializeFirestoreForJson } from './serializeFirestoreJson';

export function sendResponse(
  statusCode: number = 200,
  data: Record<string, any> | string | null,
  message: string
) {
  const newTokens: {
    newAccessToken?: string;
    newRefreshToken?: string;
  } = {};

  const payload =
    data !== null && typeof data === 'object' && !Array.isArray(data)
      ? (serializeFirestoreForJson(data) as Record<string, any>)
      : data;

  return NextResponse.json(
    {
      status: true,
      data: payload,
      ...(newTokens?.newAccessToken && newTokens),
      responseCode: statusCode,
      message: message ?? 'Success',
    },
    { status: statusCode, headers: { ...JSON_NO_STORE_HEADERS } }
  );
}
