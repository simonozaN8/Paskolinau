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
      className="flex shrink-0 items-center gap-2.5"
      aria-label="Paskolinau.lt – pradžia"
    >
      <Image
        src="/Paskolinau_varpelis_logo.png"
        alt=""
        width={isFooter ? 48 : 44}
        height={isFooter ? 48 : 44}
        className={isFooter ? "h-11 w-11" : "h-10 w-10 sm:h-11 sm:w-11"}
        priority={!isFooter}
      />
      {isFooter ? (
        <Image
          src="/Paskolinau_logo_baltas.png"
          alt="Paskolinau.lt"
          width={160}
          height={40}
          className="hidden h-8 w-auto sm:block"
        />
      ) : (
        <span className="text-lg font-bold tracking-tight text-navy sm:text-xl">
          Paskolinau<span className="text-[#00C853]">.lt</span>
        </span>
      )}
    </Link>
  );
}
