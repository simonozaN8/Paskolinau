import Link from "next/link";
import Image from "next/image";

type Props = {
  variant?: "header" | "footer";
  onClick?: () => void;
};

export function BrandLogo({ variant = "header", onClick }: Props) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex shrink-0 items-center"
      aria-label="Paskolinau.lt – pradžia"
    >
      {isFooter ? (
        <Image
          src="/Paskolinau_logo_baltas.png"
          alt="Paskolinau.lt"
          width={190}
          height={48}
          className="h-22 w-auto"
        />
      ) : (
        <Image
          src="/paskolinau_logo.png"
          alt="Paskolinau.lt"
          width={190}
          height={48}
          className="h-16 w-auto"
          priority
        />
      )}
    </Link>
  );
}
