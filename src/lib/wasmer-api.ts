/**
 * Wasmer GraphQL API Client
 * Handles all communication with the Wasmer registry GraphQL API
 */

const WASMER_GRAPHQL_ENDPOINT = "https://registry.wasmer.io/graphql";

// ============================================
// GraphQL Mutations & Queries
// ============================================

export const CREATE_REPO_MUTATION = `
  mutation CreateRepo($templateId: ID!, $name: String!, $namespace: String!) {
    createRepoForAppTemplate(input: { 
      templateId: $templateId, 
      name: $name, 
      namespace: $namespace 
    }) {
      repoId
    }
  }
`;

export const DEPLOY_MUTATION = `
  mutation Deploy($repoUrl: String!, $owner: String!, $appName: String!) {
    deployViaAutobuild(input: { repoUrl: $repoUrl, owner: $owner, appName: $appName }) {
      buildId
    }
  }
`;

// Query to get app deployment status by name
export const APP_STATUS_QUERY = `
  query GetAppStatus($owner: String!, $name: String!) {
    getDeployApp(owner: $owner, name: $name) {
      id
      name
      activeVersion {
        id
        version
        createdAt
        url
      }
    }
  }
`;

// Alternative: Query using node interface (Relay-style)
export const NODE_QUERY = `
  query GetNode($id: ID!) {
    node(id: $id) {
      id
      ... on DeployApp {
        name
        url
        activeVersion {
          id
          version
        }
      }
    }
  }
`;

// Query to get user info (namespace)
export const VIEWER_QUERY = `
  query GetViewer {
    viewer {
      username
    }
  }
`;

// ============================================
// Types
// ============================================

export interface CreateRepoResponse {
  createRepoForAppTemplate: {
    repoId: string;
  };
}

export interface ViewerResponse {
  viewer: {
    username: string;
  };
}

export interface DeployResponse {
  deployViaAutobuild: {
    buildId: string;
  };
}

export interface AppStatusResponse {
  getDeployApp: {
    id: string;
    name: string;
    activeVersion: {
      id: string;
      version: string;
      createdAt: string;
      url: string;
    } | null;
  } | null;
}

export interface AppStatus {
  id: string;
  name: string;
  url: string | null;
  status: "PENDING" | "DEPLOYING" | "SUCCESS" | "FAILED";
  activeVersion: {
    id: string;
    version: string;
    createdAt: string;
    url: string;
  } | null;
}

export interface DeploymentResult {
  buildId: string;
  repoId: string;
  owner: string;
  appName: string;
}

export interface GraphQLError {
  message: string;
  locations?: Array<{ line: number; column: number }>;
  path?: string[];
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

// ============================================
// API Client
// ============================================

class WasmerApiClient {
  private token: string;

  constructor(token: string) {
    if (!token) {
      throw new Error("WASMER_AUTH_TOKEN is required");
    }
    this.token = token;
  }

  /**
   * Execute a GraphQL query or mutation
   */
  private async execute<T>(
    query: string,
    variables: Record<string, unknown> = {}
  ): Promise<T> {
    const response = await fetch(WASMER_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: GraphQLResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0) {
      const errorMessages = result.errors.map((e) => e.message).join(", ");
      throw new Error(`GraphQL Error: ${errorMessages}`);
    }

    if (!result.data) {
      throw new Error("No data returned from GraphQL API");
    }

    return result.data;
  }

  /**
   * Get the current user's namespace (username)
   */
  async getViewer(): Promise<string> {
    const data = await this.execute<ViewerResponse>(VIEWER_QUERY);
    return data.viewer.username;
  }

  /**
   * Step A: Create a repository from an app template
   */
  async createRepoFromTemplate(
    name: string,
    namespace: string,
    templateId: string = "at_r2yGI9t3ConA"
  ): Promise<{ repoId: string }> {
    const data = await this.execute<CreateRepoResponse>(CREATE_REPO_MUTATION, {
      templateId,
      name,
      namespace,
    });

    return {
      repoId: data.createRepoForAppTemplate.repoId,
    };
  }

  /**
   * Step B: Deploy via autobuild
   */
  async deployViaAutobuild(
    repoUrl: string,
    owner: string,
    appName: string
  ): Promise<string> {
    const data = await this.execute<DeployResponse>(DEPLOY_MUTATION, {
      repoUrl,
      owner,
      appName,
    });

    return data.deployViaAutobuild.buildId;
  }

  /**
   * Get app deployment status (for polling)
   * Polls by app name since buildId query doesn't exist
   */
  async getAppStatus(owner: string, appName: string): Promise<AppStatus> {
    const data = await this.execute<AppStatusResponse>(APP_STATUS_QUERY, {
      owner,
      name: appName,
    });

    const app = data.getDeployApp;
    
    if (!app) {
      // App not found yet - still deploying
      return {
        id: "",
        name: appName,
        url: null,
        status: "DEPLOYING",
        activeVersion: null,
      };
    }

    // If app exists and has an active version, it's deployed
    // Get URL from activeVersion since DeployApp.url can be null during deployment
    const url = app.activeVersion?.url || `https://${appName}.wasmer.app`;
    
    return {
      id: app.id,
      name: app.name,
      url: app.activeVersion ? url : null,
      status: app.activeVersion ? "SUCCESS" : "DEPLOYING",
      activeVersion: app.activeVersion,
    };
  }

  /**
   * Full deployment flow: Create repo → Deploy → Return buildId
   */
  async deploy(
    appName: string,
    templateId: string = "at_r2yGI9t3ConA"
  ): Promise<DeploymentResult> {
    // Get the user's namespace first
    const namespace = await this.getViewer();

    // Step A: Create repository from template
    const { repoId } = await this.createRepoFromTemplate(appName, namespace, templateId);

    // Construct the repo URL from the repoId (format: github.com/namespace/name)
    const repoUrl = `https://github.com/${namespace}/${appName}`;

    // Step B: Deploy via autobuild
    const buildId = await this.deployViaAutobuild(repoUrl, namespace, appName);

    // Step C: Return the buildId to the frontend
    return {
      buildId,
      repoId,
      owner: namespace,
      appName,
    };
  }
}

/**
 * Factory function to create a Wasmer API client
 * Uses the WASMER_AUTH_TOKEN environment variable
 */
export function createWasmerClient(): WasmerApiClient {
  const token = process.env.WASMER_AUTH_TOKEN;

  if (!token) {
    throw new Error(
      "WASMER_AUTH_TOKEN environment variable is not set. " +
        "Please add it to your .env.local file."
    );
  }

  return new WasmerApiClient(token);
}

export { WasmerApiClient };
