import Image from "next/image";

const SHADOW_STYLE = {
  boxShadow:
    "0px 0.5px 9.29px 0px #23104400, 0px 1.4px 12.54px 0px #23104404, 0px 3.36px 19.74px 0px #23104406, 0px 11.14px 48.29px 0px #2310440A",
};

const GRADIENT_STYLE = {
  background: "linear-gradient(180deg, #FCFCFE 0%, #EFF1F6 100%)",
};

function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 w-full">
      <div className="absolute left-1/2 -translate-x-1/2 w-screen h-4/13 bg-light-gray-wash border-b border-wasmer-border-grey" />
      <div className="w-full h-9/13" style={GRADIENT_STYLE} />
    </div>
  );
}

function BackLink() {
  return (
    <div className="w-full p-3 font-bold">
      <a href="#" className="hover:text-wasmer-text hover:underline underline-offset-4">
        &lt; Back to templates
      </a>
    </div>
  );
}

function Header() {
  return (
    <div className="flex w-full items-start md:items-center mb-5 gap-4">
      <div className="flex-shrink-0">
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
  );
}

function Sidebar() {
  return (
    <aside className="lg:w-[280px] flex-shrink-0">
      {/* Mobile Hero Box */}
      <div
        className="lg:hidden w-full h-[197px] bg-black rounded-[9px] mb-8"
        style={SHADOW_STYLE}
      />

      {/* Desktop Card */}
      <div className="hidden sm:flex items-center gap-4 p-4 border border-wasmer-border h-[70px] w-[280px] rounded-[9px]">
        <Image
          className="h-5 w-5"
          src="/nextjs.svg"
          alt="Next.js"
          width={20}
          height={20}
        />
        <h2 className="font-bold text-wasmer-text">Next.js Starter</h2>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-5 my-2 md:my-8 py-4 md:py-8 border-b border-wasmer-border">
        <button className="h-[36px] flex-1 bg-wasmer-text text-white rounded-full font-semibold hover:opacity-90 transition-opacity">
          Deploy
        </button>
        <button className="h-[36px] flex-1 bg-white text-wasmer-text rounded-full font-semibold border border-wasmer-border hover:bg-light-gray-wash transition-colors">
          Visit Demo
        </button>
      </div>

      {/* Info Grid */}
      <div className="space-y-4">
        <InfoRow label="Framework" value="Next.js" />
        <InfoRow label="Language" value="JavaScript" />
        <div>
          <h3 className="font-bold text-wasmer-text mb-2">Powered by package</h3>
          <PackageCard
            src="/quickjs.svg"
            alt="Wasmer"
            label="wasmer/static-web-server"
          />
        </div>
      </div>

      {/* Footer Link */}
      <hr className="my-8 border-wasmer-border" />
      <a
        href="#"
        className="block font-bold text-[16px] py-7 hover:text-wasmer-text transition-colors"
      >
        Browse all templates
      </a>
    </aside>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <h3 className="font-bold text-wasmer-text">{label}</h3>
      <p className="text-wasmer-darker-grey">{value}</p>
    </div>
  );
}

function PackageCard({
  src,
  alt,
  label,
}: {
  src: string;
  alt: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-wasmer-border h-[70px] rounded-[9px] shadow-lg">
      <Image
        className="h-10 w-10 flex-shrink-0"
        src={src}
        alt={alt}
        width={40}
        height={40}
      />
      <p className="text-[15px] text-wasmer-darker-grey">{label}</p>
    </div>
  );
}

function MainContent() {
  return (
    <section className="flex-1">
      {/* Hero Image */}
      <div
        className="w-full md:h-[395px] bg-black rounded-[9px]"
        style={SHADOW_STYLE}
      />

      {/* Description */}
      <p className="text-[18px] font-medium leading-[140%] mt-8 text-wasmer-text">
        The power of Wasmer relies on delivering one universal API to run
        WebAssembly programs anywhere. On that quest, we worked hard to extend
        Wasmer by adding support for more backends, starting with JavaScriptCore.
        Today are incredibly excited to ship JSC support in Wasmer v3.3.
      </p>

      {/* Secondary Image */}
      <div
        className="w-full h-[197px] bg-black rounded-[9px] mt-8"
        style={SHADOW_STYLE}
      />
    </section>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <BackgroundDecoration />

      {/* Content */}
      <main className="relative z-10 flex min-h-screen w-full max-w-[1072px] flex-col items-start py-16 px-4">
        <BackLink />
        <Header />

        <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-12">
          <Sidebar />
          <MainContent />
        </div>
      </main>
    </div>
  );
}
