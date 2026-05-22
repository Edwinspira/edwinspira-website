import { CyberEstablishButtonBorder } from "@/components/CyberEstablishButtonBorder";

const BUTTON_CLASS =
  "home-connect__establish-button relative block w-full min-w-[13.5rem] max-w-[22rem] sm:min-w-[15rem] sm:max-w-[24rem] lg:min-w-[16.5rem] lg:max-w-[22rem] xl:min-w-[18rem] xl:max-w-[26rem]";

const LABEL_CLASS =
  "home-connect__establish-button__label absolute inset-0 flex items-center justify-center px-4 font-mono text-[0.62rem] tracking-[0.14em] whitespace-nowrap text-foreground uppercase sm:text-[0.7rem] sm:tracking-[0.18em] lg:text-[0.68rem] xl:text-[0.75rem]";

type HomeConnectEstablishButtonProps = {
  href?: string;
  ariaLabel: string;
};

export function HomeConnectEstablishButton({
  href,
  ariaLabel,
}: HomeConnectEstablishButtonProps) {
  const frame = (
    <>
      <span
        className="home-connect__establish-button__border text-[var(--home-stat-red)]"
        aria-hidden
      >
        <CyberEstablishButtonBorder />
      </span>
      <span className={LABEL_CLASS}>ESTABLISH CONNECTION</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={BUTTON_CLASS}
        aria-label={ariaLabel}
      >
        {frame}
      </a>
    );
  }

  return (
    <span
      className={`${BUTTON_CLASS} home-connect__establish-button--inactive cursor-not-allowed opacity-60`}
      aria-disabled
    >
      {frame}
    </span>
  );
}
