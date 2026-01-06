import Image from "next/image";

interface TemplateCardProps {
  icon: string;
  iconAlt: string;
  title: string;
  className?: string;
}

export function TemplateCard({ icon, iconAlt, title, className = "" }: TemplateCardProps) {
  return (
    <div className={`flex items-center gap-4 p-4 border border-wasmer-border h-[70px] w-[280px] rounded-[9px] md:w-full ${className}`}>
      <Image
        className="h-5 w-5 flex-shrink-0"
        src={icon}
        alt={iconAlt}
        width={20}
        height={20}
      />
      <h2 className="font-bold text-wasmer-text">{title}</h2>
    </div>
  );
}
