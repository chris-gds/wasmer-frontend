"use client";

import { useState, useCallback, useRef } from "react";

type BuildStatus = "PENDING" | "BUILDING" | "SUCCESS" | "FAILED" | "CANCELLED";

interface BuildInfo {
  id: string;
  status: BuildStatus;
  logs: string | null;
  createdAt: string;
  finishedAt: string | null;
  app: {
    name: string;
    url: string;
  } | null;
}

interface DeploymentState {
  isDeploying: boolean;
  isPolling: boolean;
  buildId: string | null;
  repoUrl: string | null;
  owner: string | null;
  build: BuildInfo | null;
  error: string | null;
}

interface UseWasmerDeployOptions {
  pollingInterval?: number; // milliseconds, default 3000
  onSuccess?: (build: BuildInfo) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: BuildStatus) => void;
}

const TERMINAL_STATUSES: BuildStatus[] = ["SUCCESS", "FAILED", "CANCELLED"];

/**
 * React hook for managing Wasmer deployments with automatic polling
 *
 * Usage:
 * ```tsx
 * const { deploy, state, stopPolling } = useWasmerDeploy({
 *   onSuccess: (build) => console.log('Deployed!', build.app?.url),
 *   onError: (error) => console.error('Failed:', error),
 * });
 *
 * // Start deployment
 * await deploy('my-app-name');
 *
 * // Access state
 * console.log(state.build?.status, state.build?.logs);
 * ```
 */
export function useWasmerDeploy(options: UseWasmerDeployOptions = {}) {
  const {
    pollingInterval = 3000,
    onSuccess,
    onError,
    onStatusChange,
  } = options;

  const [state, setState] = useState<DeploymentState>({
    isDeploying: false,
    isPolling: false,
    buildId: null,
    repoUrl: null,
    owner: null,
    build: null,
    error: null,
  });

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const lastStatusRef = useRef<BuildStatus | null>(null);

  /**
   * Stop polling for build status
   */
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setState((prev) => ({ ...prev, isPolling: false }));
  }, []);

  /**
   * Poll for build status
   */
  const pollBuildStatus = useCallback(
    async (buildId: string) => {
      try {
        const response = await fetch(
          `/api/wasmer/build-status?buildId=${encodeURIComponent(buildId)}`
        );
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch build status");
        }

        const build = data.build as BuildInfo;

        // Notify on status change
        if (build.status !== lastStatusRef.current) {
          lastStatusRef.current = build.status;
          onStatusChange?.(build.status);
        }

        setState((prev) => ({ ...prev, build }));

        // Check if build has reached a terminal state
        if (TERMINAL_STATUSES.includes(build.status)) {
          stopPolling();

          if (build.status === "SUCCESS") {
            onSuccess?.(build);
          } else if (build.status === "FAILED") {
            onError?.(`Build failed`);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Polling error";
        setState((prev) => ({ ...prev, error: errorMessage }));
        onError?.(errorMessage);
        stopPolling();
      }
    },
    [stopPolling, onSuccess, onError, onStatusChange]
  );

  /**
   * Start polling for build status
   */
  const startPolling = useCallback(
    (buildId: string) => {
      // Clear any existing polling
      stopPolling();

      setState((prev) => ({ ...prev, isPolling: true }));
      lastStatusRef.current = null;

      // Initial poll
      pollBuildStatus(buildId);

      // Set up interval polling
      pollingRef.current = setInterval(() => {
        pollBuildStatus(buildId);
      }, pollingInterval);
    },
    [pollBuildStatus, pollingInterval, stopPolling]
  );

  /**
   * Deploy an app
   */
  const deploy = useCallback(
    async (appName: string, templateId?: string) => {
      // Reset state
      setState({
        isDeploying: true,
        isPolling: false,
        buildId: null,
        repoUrl: null,
        owner: null,
        build: null,
        error: null,
      });

      try {
        const response = await fetch("/api/wasmer/deploy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appName, templateId }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Deployment failed");
        }

        setState((prev) => ({
          ...prev,
          isDeploying: false,
          buildId: data.buildId,
          repoUrl: data.repoUrl,
          owner: data.owner,
        }));

        // Start polling for build status
        startPolling(data.buildId);

        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Deployment failed";

        setState((prev) => ({
          ...prev,
          isDeploying: false,
          error: errorMessage,
        }));

        onError?.(errorMessage);
        throw error;
      }
    },
    [startPolling, onError]
  );

  /**
   * Reset the deployment state
   */
  const reset = useCallback(() => {
    stopPolling();
    setState({
      isDeploying: false,
      isPolling: false,
      buildId: null,
      repoUrl: null,
      owner: null,
      build: null,
      error: null,
    });
    lastStatusRef.current = null;
  }, [stopPolling]);

  return {
    deploy,
    stopPolling,
    reset,
    state,
    // Convenience accessors
    isDeploying: state.isDeploying,
    isPolling: state.isPolling,
    buildId: state.buildId,
    build: state.build,
    error: state.error,
    isComplete: state.build
      ? TERMINAL_STATUSES.includes(state.build.status)
      : false,
    isSuccess: state.build?.status === "SUCCESS",
    isFailed: state.build?.status === "FAILED",
  };
}
