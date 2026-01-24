import { NextRequest, NextResponse } from "next/server";
import { createWasmerClient, AppStatus } from "@/lib/wasmer-api";

export interface AppStatusResponseBody {
  success: boolean;
  app?: AppStatus;
  error?: string;
}

/**
 * GET /api/wasmer/build-status?owner=<owner>&appName=<appName>
 *
 * Polling endpoint to check the status of an app deployment.
 * Use this to monitor deployment progress until completion.
 *
 * Query parameters:
 * - owner: The owner/namespace of the app
 * - appName: The name of the app being deployed
 *
 * Suggested polling strategy:
 * - Poll every 3 seconds
 * - Stop when status is SUCCESS or FAILED
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
          error: "Wasmer Auth Token not configured",
        },
        { status: 500 }
      );
    }

    // Get params from query
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get("owner");
    const appName = searchParams.get("appName");

    // Validate params
    if (!owner || !appName) {
      return NextResponse.json(
        {
          success: false,
          error: "owner and appName query parameters are required",
        },
        { status: 400 }
      );
    }

    // Create Wasmer client and fetch app status
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

    // Check for specific error types
    if (errorMessage.includes("WASMER_AUTH_TOKEN")) {
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Missing authentication token",
        },
        { status: 500 }
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
