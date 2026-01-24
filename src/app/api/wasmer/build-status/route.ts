import { NextRequest, NextResponse } from "next/server";
import { createWasmerClient, AppStatus } from "@/lib/wasmer-api";

export interface AppStatusResponseBody {
  success: boolean;
  app?: AppStatus;
  error?: string;
}

/**
 * GET /api/wasmer/build-status?owner=<owner>&appName=<appName>
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<AppStatusResponseBody>> {
  try {
    // Check if Wasmer auth token is configured
    const token = process.env.WASMER_AUTH_TOKEN;
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Environment variable WASMER_AUTH_TOKEN is missing.",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const appName = searchParams.get("appName");

    if (!owner || !appName) {
      return NextResponse.json(
        {
          success: false,
          error: "owner and appName query parameters are required",
        },
        { status: 400 }
      );
    }

    const client = createWasmerClient();
    const appStatus = await client.getAppStatus(owner, appName);

    return NextResponse.json({
      success: true,
      app: appStatus,
    });
  } catch (error) {
    console.error("App status error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (errorMessage.includes("WASMER_AUTH_TOKEN") || errorMessage.includes("Invalid Wasmer Token")) {
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
