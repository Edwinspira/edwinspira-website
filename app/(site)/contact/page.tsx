import Image from "next/image";

import { CyberSectionMarker } from "@/components/CyberDeco";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_EMAIL, serviceFromQuery } from "@/lib/contact";
import { HOME_CONNECT_PLATFORMS } from "@/lib/home-connect";
import { siteConfig } from "@/lib/site";

const contactSocials = HOME_CONNECT_PLATFORMS.filter(
  (platform) => platform.id !== "mail" && Boolean(platform.href),
);

export const metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} about software, art, photography, video, or 3D sculpture.`,
};

type ContactPageProps = {
  searchParams: Promise<{ service?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { service: serviceParam } = await searchParams;
  const initialService = serviceFromQuery(serviceParam);

  return (
    <div className="contact-page bg-black">
      <div className="contact-page__inner mx-auto max-w-[90rem] px-[var(--home-pad)] py-16 sm:py-20">
        <div className="mb-4 flex items-center gap-4">
          <CyberSectionMarker />
          <div className="home-section-rule flex-1" aria-hidden>
            <div className="home-section-rule__line" />
          </div>
        </div>

        <div className="contact-page__layout">
          <section className="contact-intro" aria-labelledby="contact-heading">
            <p className="contact-intro__kicker font-mono">{"// CONTACT"}</p>
            <h1 id="contact-heading" className="contact-intro__title">
              <span>LET&apos;S</span>
              <span>WORK</span>
              <span>TOGETHER</span>
            </h1>
            <p className="contact-intro__jp">
              <span className="contact-intro__jp-mark">仕事</span>
              <span className="font-mono"> / CONTACT</span>
            </p>
            <p className="contact-intro__copy">
              Have a project in mind, need a commission, or just want to ask a question? Send
              me a few details and I&apos;ll get back to you.
            </p>

            <div className="contact-intro__note">
              <h2 className="contact-intro__note-label font-mono">NOT SURE WHAT YOU NEED?</h2>
              <p className="contact-intro__note-copy">
                That&apos;s completely fine. Tell me what you&apos;re trying to accomplish and
                we can figure out the details together.
              </p>
            </div>

            <div className="contact-intro__direct">
              <h2 className="contact-intro__direct-label font-mono">DIRECT CONTACT</h2>
              <a href={`mailto:${CONTACT_EMAIL}`} className="contact-intro__email font-mono">
                {CONTACT_EMAIL}
              </a>
            </div>

            {contactSocials.length > 0 ? (
              <div className="contact-intro__social">
                <h2 className="contact-intro__social-label font-mono">FIND ME ONLINE</h2>
                <ul className="contact-intro__social-list">
                  {contactSocials.map((platform) => (
                    <li key={platform.id}>
                      <a
                        href={platform.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-intro__social-link"
                        aria-label={`Open ${platform.name} profile (opens in new tab)`}
                      >
                        <Image
                          src={platform.iconSrc}
                          alt=""
                          width={64}
                          height={64}
                          className="contact-intro__social-icon"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>

          <section className="contact-panel" aria-labelledby="inquiry-heading">
            <h2 id="inquiry-heading" className="contact-panel__title font-mono">
              PROJECT INQUIRY
            </h2>
            <ContactForm key={initialService || "none"} initialService={initialService} />
          </section>
        </div>
      </div>
    </div>
  );
}
