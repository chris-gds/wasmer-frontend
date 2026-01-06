import Image from "next/image";
import Link from "next/link";
import { TemplateCard } from "@/components/TemplateCard";
import { CodeBlock } from "@/components/CodeBlock";
import { Button } from "@/components/Button";

function MainPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {/* Content overlay */}
      <main className="relative z-10 flex w-full max-w-268 min-h-screen flex-col items-start px-4 py-16">
        <div className="w-full py-3 font-bold">
          <Link
            href="/"
            className="underline-offset-4 hover:text-wasmer-text hover:underline"
          >
            ← Back to templates
          </Link>
        </div>

        <div className="flex w-full gap-4 pb-9 items-start md:mb-9 md:items-center">
          <div className="shrink-0">
            <Image
              className="h-16 w-16"
              src="/nextjs.svg"
              alt="Next.js"
              width={64}
              height={64}
            />
          </div>
          <div className="flex-grow">
            <h1 className="text-[34px] font-bold text-wasmer-text">
              Next.js Starter
            </h1>
            <p className="text-[22px] text-wasmer-darker-grey">
              Serve your static Next.js apps with Wasmer
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Aside on left */}
          <aside className="flex-shrink-0 lg:w-[280px]">
            <div
              className="w-full h-[197px] rounded-[9px] bg-black md:mb-8 lg:hidden"
              style={{
                boxShadow:
                  "0px 0.5px 9.29px 0px #23104400, 0px 1.4px 12.54px 0px #23104404, 0px 3.36px 19.74px 0px #23104406, 0px 11.14px 48.29px 0px #2310440A",
              }}
            />

            <TemplateCard
              icon="/nextjs.svg"
              iconAlt="Next.js"
              title="Next.js Starter"
              className="hidden lg:flex "
            />

            <div className="flex gap-5 pt-4 mt-2 lg:pt-6 lg:mt-8">
              <Button href="/deploy" label="Deploy" variant="primary" />
              <Button label="Visit Demo" variant="secondary" />
            </div>
             
            <hr className="my-8 border-wasmer-border-grey" />

            <div className="space-y-6">
              <div className="flex justify-between">
                <h3 className="font-bold text-wasmer-text">Framework</h3>
                <p className="text-wasmer-darker-grey">Next.js</p>
              </div>
              <div className="flex justify-between">
                <h3 className="font-bold text-wasmer-text">Language</h3>
                <p className="text-wasmer-darker-grey">JavaScript</p>
              </div>
              <div>
                <h3 className="font-bold text-wasmer-text mb-4">
                  Powered by package
                </h3>
                <div className="flex items-center gap-3 rounded-[9px] border border-wasmer-border bg-white p-4 shadow-lg">
                  <Image
                    className="h-10 w-10 shrink-0"
                    src="/quickjs.svg"
                    alt="QuickJS"
                    width={40}
                    height={40}
                  />
                  <p className="text-[15px] text-wasmer-darker-grey">
                    wasmer/static-web -server
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-8 border-wasmer-border-grey" />

            <Link
              href="#"
              className="hidden block font-bold text-[16px] transition-colors hover:text-wasmer-text lg:block"
            >
              Browse all templates →
            </Link>
          </aside>

          {/* Section on right */}
          <section className="flex-1">
            <div
              className="w-full rounded-[9px] bg-black md:h-[395px]"
              style={{
                boxShadow:
                  "0px 0.5px 9.29px 0px #23104400, 0px 1.4px 12.54px 0px #23104404, 0px 3.36px 19.74px 0px #23104406, 0px 11.14px 48.29px 0px #2310440A",
              }}
            />
            <p className="text-[18px] font-medium leading-[140%] lg:mt-8 lg:pt-8">
              The power of Wasmer relies on delivering one universal API to run
              WebAssembly programs anywhere.On that quest, we worked hard to
              extend Wasmer by adding support for more backends, starting with
              JavaScriptCore.Today we are incredibly excited to ship JSC support
              in Wasmer v3.3.
            </p>
            <CodeBlock
              filename="wasmer.toml"
              language="toml"
              code='[package]
              name = "youruser/package"
              version = "0.1.0"
              description = "Description for package"'
            />
          </section>
        </div>

        <h3 className="text-left text-[28px] font-semibold leading-[140%] text-black mt-9 sm:block md:hidden">Discovering the Power of Wasmer: Revolutionizing Software Development</h3>
                  
      </main>
    </div>
  );
}

export default MainPage;
