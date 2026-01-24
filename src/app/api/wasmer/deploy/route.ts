import { NextRequest, NextResponse } from "next/server";
import { createWasmerClient } from "@/lib/wasmer-api";

export interface DeployRequestBody {
  appName: string;
  templateId?: string;
}

export interface DeployResponseBody {
  success: boolean;
  buildId?: string;
  repoId?: string;
  owner?: string;
  error?: string;
}

/**
 * POST /api/wasmer/deploy
 *
 * Triggers the full deployment flow:
 * 1. Creates a repo from the app template
 * 2. Deploys via autobuild
 * 3. Returns the buildId for monitoring
 *
 * Request body:
 * {
 *   "appName": "my-awesome-app",
 *   "templateId": "at_r2yGI9t3ConA" // optional, defaults to this value
 * }
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<DeployResponseBody>> {
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

    // Parse request body
    const body: DeployRequestBody = await request.json();

    // Validate required fields
    if (!body.appName || typeof body.appName !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "appName is required and must be a string",
        },
        { status: 400 }
      );
    }

    // Validate appName format (alphanumeric, hyphens, underscores)
    const appNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}$/;
    if (!appNameRegex.test(body.appName)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "appName must start with alphanumeric and contain only alphanumeric characters, hyphens, or underscores (max 63 chars)",
        },
        { status: 400 }
      );
    }

    // Create Wasmer client and execute deployment
    const client = createWasmerClient();
    const result = await client.deploy(
      body.appName,
      body.templateId || "at_r2yGI9t3ConA"
    );

    return NextResponse.json({
      success: true,
      buildId: result.buildId,
      repoId: result.repoId,
      owner: result.owner,
    });
  } catch (error) {
    console.error("Deployment error:", error);

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

    if (errorMessage.includes("GraphQL Error")) {
      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
        },
        { status: 400 }
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
