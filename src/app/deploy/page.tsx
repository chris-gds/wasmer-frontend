"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/Button";

// Deployment status states
type DeploymentStatus = "IDLE" | "CONNECTING" | "CONNECTED" | "CREATING_REPO" | "DEPLOYING" | "SUCCESS" | "ERROR";

// Hidden template ID mapping
const TEMPLATE_IDS: Record<string, string> = {
  "wordpress": "at_r2yGI9t3ConA",
  "flask": "at_r2yGI9t3ConA", // Update with actual Flask template ID
};

export default function DeployPage() {
  // ============================================
  // State Management
  // ============================================
  const [status, setStatus] = useState<DeploymentStatus>("IDLE");
  const [repositoryName, setRepositoryName] = useState("");
  const [gitScope, setGitScope] = useState<string | null>(null);
  const [buildId, setBuildId] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [appUrl, setAppUrl] = useState<string | null>(null);

  // Force-success debug flag (set NEXT_PUBLIC_FORCE_DEPLOY_SUCCESS=true)
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FORCE_DEPLOY_SUCCESS === "true") {
      setStatus("SUCCESS");
      setAppUrl("https://example.wasmer.app");
      setLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] ✅ Deployment successful! Your app is live at https://example.wasmer.app`,
      ]);
    }
  }, []);

  // Hidden template ID (changes based on selected template)
  const [selectedTemplate] = useState("wordpress");
  const templateId = TEMPLATE_IDS[selectedTemplate];

  // Refs
  const logsEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // Auto-scroll logs to bottom
  // ============================================
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // ============================================
  // Cleanup polling on unmount
  // ============================================
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  // ============================================
  // Add log entry
  // ============================================
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  // ============================================
  // Poll for app deployment status
  // ============================================
  const pollAppStatus = async (owner: string, appName: string) => {
    try {
      const response = await fetch(
        `/api/wasmer/build-status?owner=${encodeURIComponent(owner)}&appName=${encodeURIComponent(appName)}`
      );
      const data = await response.json();

      if (!data.success) {
        // Log errors but keep polling
        console.error("Poll failed:", data.error);
        return;
      }

      const app = data.app;

      // Log current status for debugging
      console.log("App status:", app);

      // Check terminal states
      if (app.status === "SUCCESS") {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        setStatus("SUCCESS");
        const finalUrl = app.url || app.activeVersion?.url || `https://${appName}.wasmer.app`;
        setAppUrl(finalUrl);
        addLog(`✅ Deployment successful! Your app is live at ${finalUrl}`);
        if (app.activeVersion) {
          addLog(`📦 Version: ${app.activeVersion.version}`);
        }
      } else if (app.status === "FAILED") {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        setStatus("ERROR");
        setError("Deployment failed");
        addLog(`❌ Deployment failed`);
      } else {
        // Still deploying - log a dot to show progress
        addLog(`⏳ Checking deployment status...`);
      }
    } catch (err) {
      console.error("Polling error:", err);
      addLog(`⚠️ ${err instanceof Error ? err.message : "Polling error"}`);
    }
  };

  // ============================================
  // Handle GitHub Connection
  // ============================================
  const handleGitHubConnect = async () => {
    setStatus("CONNECTING");
    setError(null);
    addLog("🔗 Validating GitHub connection...");

    try {
      // Simulate connection validation
      // In production, you'd call an API to verify the token
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStatus("CONNECTED");
      setGitScope("wasmer-user"); // This would come from the API response
      addLog("✅ GitHub connection validated");
    } catch (err) {
      setStatus("ERROR");
      setError(err instanceof Error ? err.message : "Connection failed");
      addLog(`❌ Connection failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  // ============================================
  // Handle Create Repository
  // ============================================
  const handleCreateRepo = async () => {
    if (!repositoryName.trim()) {
      setError("Repository name is required");
      return;
    }

    // Validate repository name format
    const repoNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_]{0,62}$/;
    if (!repoNameRegex.test(repositoryName)) {
      setError("Repository name must start with alphanumeric and contain only alphanumeric, hyphens, or underscores");
      return;
    }

    setStatus("CREATING_REPO");
    setError(null);
    addLog(`📦 Creating repository: ${repositoryName}...`);
    addLog(`📝 Using template ID: ${templateId}`);

    try {
      const response = await fetch("/api/wasmer/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appName: repositoryName,
          templateId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create repository");
      }

      setRepoUrl(data.repoId);
      setBuildId(data.buildId);
      setGitScope(data.owner);
      addLog(`✅ Repository created with ID: ${data.repoId}`);
      addLog(`👤 Owner: ${data.owner}`);
      addLog(`🚀 Build started with ID: ${data.buildId}`);

      // Transition to deploying state and start polling
      setStatus("DEPLOYING");
      addLog("📡 Starting deployment monitoring...");

      // Start polling for app status (using owner and appName)
      const owner = data.owner;
      const appName = repositoryName;

      pollingRef.current = setInterval(() => {
        pollAppStatus(owner, appName);
      }, 3000);

      // Initial poll
      pollAppStatus(owner, appName);

    } catch (err) {
      setStatus("CONNECTED"); // Go back to connected state
      setError(err instanceof Error ? err.message : "Failed to create repository");
      addLog(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  // ============================================
  // Computed states for UI
  // ============================================
  const isConnected = status !== "IDLE" && status !== "CONNECTING";
  const isRepoCreated = status === "DEPLOYING" || status === "SUCCESS" || (status === "ERROR" && buildId !== null);
  const isDeploying = status === "DEPLOYING";
  const isSuccess = status === "SUCCESS";
  const canCreateRepo = isConnected && repositoryName.trim() && status === "CONNECTED";

  // ============================================
  // Get current step for sidebar
  // ============================================
  const getCurrentStep = () => {
    if (status === "SUCCESS") return 3;
    if (isRepoCreated) return 2;
    if (isConnected) return 1;
    return 0;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="relative min-h-screen overflow-hidden deploy-page">
      {/* Content overlay */}
      <main className="relative z-10 flex min-h-screen w-full max-w-[1072px] flex-col py-16 px-4 mx-auto">
        <Link
          href="/"
          className="w-full py-3 font-bold hover:text-wasmer-text hover:underline underline-offset-4 text-wasmer-darker-grey"
        >
          ← Back
        </Link>

        <div className="mb-4 lg:mb-10">
          <h1 className="text-[48px] font-bold text-wasmer-text lg:mb-3">
            {isSuccess ? "🎉 Cheers!" : "Almost there!"}
          </h1>
          <p className="text-[22px] text-wasmer-darker-grey">
            {isSuccess 
              ? "You just deployed a new app to Wasmer Edge"
              : "Please follow the steps to configure your project and deploy it."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar */}
          <aside className="lg:w-[280px] flex-shrink-0">

              {isSuccess ? (
                  <div className="flex items-center gap-3 mb-4 lg:mb-10">
                    <Button
                      href={`https://wasmer.io/apps`}
                      label="Dashboard"
                      variant="primary"
                      className="h-12 px-5"
                    />   
                </div>
              ) : (
                  <div className="flex items-center gap-3 mb-4 lg:mb-8">
                    <TemplateCard
                      icon="/flask.svg"
                      iconAlt="Flask"
                      title="Flask Starter"
                    /> 
                  </div>
              )}
        

            <ol className="space-y-6 pt-5 list-none hidden lg:block">
              {/* Step 1: Create Git Repository */}
              <li className="relative pl-8 mb-0">
                <div className="absolute left-[3px] top-[14px] w-[1px] h-[30px] bg-wasmer-darker-grey" />
                <div className="flex items-center gap-3">
                  <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                    currentStep >= 1 ? "bg-wasmer-text" : "bg-wasmer-darker-grey"
                  }`} />
                  <span className={`text-[16px] flex items-center gap-2 ${
                    currentStep >= 1 ? "text-wasmer-text" : "text-wasmer-darker-grey"
                  }`}>
                    Create Git Repository
                    {currentStep === 1 && status === "CREATING_REPO" && <div className="loader loader--black" />}
                    {currentStep >= 2 && " ✓"}
                  </span>
                </div>
              </li>

              {/* Step 2: Deploy */}
              <li className="relative pl-8 pt-1 mb-0">
                <div className="flex items-center gap-3">
                  <div className={`absolute left-0 top-3 w-2 h-2 rounded-full flex-shrink-0 ${
                    currentStep >= 2 ? "bg-wasmer-text" : "bg-wasmer-darker-grey"
                  }`} />
                  <span className={`text-[16px] ${
                    currentStep >= 2 ? "text-wasmer-text" : "text-wasmer-darker-grey"
                  }`}>
                    Deploy
                    {status === "DEPLOYING" && " ⏳"}
                    {isSuccess && " ✓"}
                  </span>
                </div>
              </li>
            </ol>

            <div className="mt-6">
              <hr className="my-8 border-wasmer-border-grey hidden lg:block" />

              <h3 className="text-wasmer-text mb-2 hidden lg:block">Template</h3>
              <p className="text-wasmer-darker-grey hidden lg:block">Wordpress template</p>

              <hr className="my-8 border-wasmer-border-grey hidden lg:block" />

              <Link
                href="#"
                className="block font-bold text-[16px] hover:text-wasmer-text transition-colors"
              >
                Browse all templates →
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <section className="flex-1 space-y-8">
            {/* Get started card */}
            {!isSuccess && (
              <div className="bg-white rounded-lg border border-wasmer-border-grey mt-6 p-6 lg:mt-0 shadow-wasmer">
              <h2 className="text-[22px] font-bold text-wasmer-text mb-4">Get started</h2>
              <p className="text-wasmer-darker-grey text-m">
                Wasmer Edge is the easiest way to deploy websites.
              </p>
              <p className="text-wasmer-darker-grey mb-6 text-m">
                Login with Github to clone and deploy the Flask Starter template
              </p>

              <div className="w-[214px]">
                <Button
                  label={
                    <>
                      <Image
                        src="/github.svg"
                        alt="GitHub"
                        width={20}
                        height={20}
                        className={isConnected ? "" : "invert group-hover:invert-0"}
                      />
                      {status === "CONNECTING" ? "Connecting..." : isConnected ? "Connected ✓" : "Connect with GitHub"}
                    </>
                  }
                  variant={isConnected ? "secondary" : "primary"}
                  className="group"
                  onClick={handleGitHubConnect}
                  disabled={status === "CONNECTING" || isConnected}
                />
              </div>
              </div>
            )}

            {/* Create Git Repository card */}
            {!isSuccess && (
              <div className={`bg-white rounded-lg border border-wasmer-border-grey p-6 shadow-wasmer mt-1 transition-opacity ${
                !isConnected ? "opacity-50 pointer-events-none" : ""
              }`}>
              <h2 className="text-[22px] font-bold text-wasmer-text mb-6">Create Git Repository</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-wasmer-darker-grey mb-2">
                    Git Scope
                  </label>
                  <div className="h-10 bg-gray-100 rounded border border-wasmer-border-grey px-3 flex items-center text-wasmer-text">
                    {gitScope || "Connect GitHub to see your scope"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-wasmer-darker-grey mb-2">
                    Repository name
                  </label>
                  <input
                    type="text"
                    placeholder="my-wordpress-app"
                    value={repositoryName}
                    onChange={(e) => setRepositoryName(e.target.value)}
                    disabled={!isConnected || isRepoCreated}
                    className="w-full h-10 px-3 border border-wasmer-border-grey rounded text-wasmer-text placeholder:text-wasmer-darker-grey focus:outline-none focus:ring-2 focus:ring-wasmer-text disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {repositoryName && (
                    <p className="text-sm text-wasmer-darker-grey mt-1">
                      Your app will be available at: <span className="font-mono">{repositoryName}.wasmer.app</span>
                    </p>
                  )}
                </div>

                {error && status === "CONNECTED" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    label={
                      status === "CREATING_REPO" ? (
                        <>
                          <div className="loader" />
                          Creating...
                        </>
                      ) : isRepoCreated ? (
                        "Repository Created ✓"
                      ) : (
                        "Create Repository"
                      )
                    }
                    variant={canCreateRepo ? "primary" : "disabled"}
                    onClick={handleCreateRepo}
                    disabled={!canCreateRepo || isRepoCreated}
                    className={isRepoCreated ? "lg:!w-[190px]" : "lg:!w-[190px]"}
                  />
                </div>
              </div>
              </div>
            )}

            {/* Deploy card */}
            <div className={`bg-white rounded-lg border border-wasmer-border-grey p-6 shadow-wasmer transition-opacity ${
              !isRepoCreated ? "opacity-50" : ""
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${isRepoCreated ? "text-wasmer-text" : "text-wasmer-darker-grey"}`}>
                  {isSuccess ? "Deployed" : "Deploy"}
                    
                </h2>
                {isSuccess && appUrl && (
                  <a
                    href={appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-colors"
                  >
                    🚀 Open Live Site
                  </a>
                )}
              </div>

              {/* Terminal-style log window */}
              {(isDeploying || isSuccess || (status === "ERROR" && logs.length > 0)) && (
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-80 overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-gray-400">Waiting for logs...</p>
                  ) : (
                    logs.map((log, index) => (
                      <div
                        key={index}
                        className={`${
                          log.includes("✅") ? "text-green-400" :
                          log.includes("❌") ? "text-red-400" :
                          log.includes("⚠️") ? "text-yellow-400" :
                          log.includes("⏳") ? "text-blue-400" :
                          "text-gray-300"
                        }`}
                      >
                        {log}
                      </div>
                    ))
                  )}
                  <div ref={logsEndRef} />
                  {isDeploying && (
                    <div className="text-gray-400 animate-pulse">▋</div>
                  )}
                </div>
              )}

              {status === "ERROR" && error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                  {error}
                </div>
              )}

              {!isRepoCreated && (
                <p className="text-wasmer-darker-grey text-sm">
                  Create a repository first to enable deployment.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
