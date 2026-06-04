"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ButtonLink } from "@/components/ui/Button";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="hero-cinema relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2">
      <div className="hero-cinema-media relative min-h-[min(88vh,820px)] sm:min-h-[min(92vh,900px)]">
        <Image
          src="/images/hero-wheat.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_42%]"
        />
        <div className="hero-cinema-overlay" aria-hidden />
        <div className="hero-cinema-vignette" aria-hidden />
      </div>

      <div className="hero-cinema-content absolute inset-0 flex flex-col justify-end px-5 pb-14 pt-24 sm:pb-16 md:px-8 lg:justify-center lg:pb-20 lg:pt-28">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-6xl lg:mx-0"
        >
          <div className="max-w-3xl text-center lg:max-w-2xl lg:text-left">
            <p className="hero-cinema-eyebrow">{t("tagline")}</p>

            <h1 className="hero-cinema-title font-display mt-4">
              <span className="block">{t("heroHeadline1")}</span>
              <span className="hero-cinema-title-accent mt-1 block sm:mt-2">
                {t("heroHeadline2")}
              </span>
            </h1>

            <p className="hero-cinema-lead mt-6 max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0 lg:max-w-md">
              {t("heroLead")}
            </p>

            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <ButtonLink href="/scan" variant="primary" className="hero-cinema-cta-primary min-w-[11rem]">
                {t("heroCtaScan")}
              </ButtonLink>
              <ButtonLink
                href="/asha"
                variant="secondary"
                className="hero-cinema-cta-secondary min-w-[11rem]"
              >
                {t("heroCtaAsha")}
              </ButtonLink>
            </div>

            <p className="hero-cinema-trust mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 lg:justify-start">
              <span className="hero-cinema-trust-icon" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm0 2a3 3 0 0 1 3 3v3H9V6a3 3 0 0 1 3-3z" />
                </svg>
              </span>
              {t("heroTrustLine")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
