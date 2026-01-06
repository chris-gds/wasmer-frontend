import Image from "next/image";
import Link from "next/link";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/Button";

export const metadata = {
  title: "Deploy - Wasmer",
  description: "Deploy your application with Wasmer",
};

export default function DeployPage() {
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
            Almost there!
          </h1>
          <p className="text-[22px] text-wasmer-darker-grey">
            Please follow the steps to configure your Wordpress project and deploy it.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left sidebar */}
          <aside className="lg:w-[280px] flex-shrink-0">
            <div className="flex items-center gap-3 mb-4 lg:mb-8">
              <TemplateCard
                icon="/flask.svg"
                iconAlt="Flask"
                title="Flask Starter"
              />
            </div>

            <ol className="space-y-6 pt-5 list-none hidden lg:block">
              {/* Step 1: Completed/Current Step (Dark Filled Dot) */}
              <li className="relative pl-8 mb-0">
                {/* Connecting line (Adjusted to start under the dot and end at the next dot) */}
                {/* The line should be positioned relative to the container of the two steps, 
       but keeping it here for simplicity and adjusting the size/position. */}
                <div className="absolute left-[3px] top-[14px] w-[1px] h-[30px] bg-wasmer-darker-grey " />

                <div className="flex items-center gap-3">
                  {/* Indicator: Filled Dark Circle (Matches image 2 - the 'Create Git Repository' dot) */}
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-wasmer-text flex-shrink-0" />

                  {/* Text: Dark and bold */}
                  <span className="text-wasmer-text text-[16px]">Create Git Repository</span>
                </div>
              </li>

              {/* Step 2: Next/Pending Step (Faded/Outlined Dot) */}
              <li className="relative pl-8 pt-1 mb-0">
                <div className="flex items-center gap-3">
                  {/* Indicator: Faded/Outlined Circle (Matches image 2 - the 'Deploy' dot) */}
                  {/* We'll use a semi-transparent dark circle to create the "faded" look. */}
                  <div className="absolute left-0 top-3 w-2 h-2 rounded-full bg-wasmer-darker-grey flex-shrink-0" />

                  {/* Text: Faded/Grey */}
                  <span className="text-wasmer-darker-grey text-[16px]">Deploy</span>
                </div>
              </li>
            </ol>

            <div className="mt-6">

                   
            <hr className="my-8 border-wasmer-border-grey hidden lg:block " />


              <h3 className=" text-wasmer-text mb-2 hidden lg:block">Template</h3>
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
                        className="invert group-hover:invert-0"
                      />
                      Connect with GitHub
                    </>
                  }
                  variant="primary"
                  className="group"
                />
              </div>
            </div>

            {/* Create Git Repository card */}
            <div className="bg-white rounded-lg border border-wasmer-border-grey p-6 shadow-wasmer mt-1">
              <h2 className="text-[22px] font-bold text-wasmer-text mb-6">Create Git Repository</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-wasmer-darker-grey mb-2">
                    Git Scope
                  </label>
                  <div className="h-10 bg-gray-100 rounded border border-wasmer-border-grey"></div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-wasmer-darker-grey mb-2">
                    Repository name
                  </label>
                  <input
                    type="text"
                    placeholder="my-next-app.wasmer.app"
                    className="w-full h-10 px-3 border border-wasmer-border-grey rounded text-wasmer-text placeholder:text-wasmer-darker-grey focus:outline-none focus:ring-2 focus:ring-wasmer-text"
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    label="Deploy" 
                    variant="disabled"
                  />
                </div>
              </div>
            </div>

            {/* Deploy card */}
            <div className="bg-white rounded-lg border border-wasmer-border-grey p-6 shadow-wasmer">
              <h2 className="text-xl font-bold text-wasmer-darker-grey">Deploy</h2>
            </div>
          </section>
        </div>
      </main>

 
    </div>

  );
}
