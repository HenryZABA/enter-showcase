import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { footerColumns, footerSocialLinks } from "@/data/footer";
import { useAppHref } from "@/hooks/use-app-href";
import { useCurrentLanguage } from "@/hooks/use-current-language";
import "@/styles/footer.css";

export function Footer() {
  const language = useCurrentLanguage();
  const appHref = useAppHref();
  const homeHref = `${appHref("/showcases")}?${new URLSearchParams({ hl: language })}`;

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  };

  return (
    <footer className="enter-footer mt-auto w-full" lang="en">
      <div className="enter-footer-container">
        <div className="enter-footer-top">
          <Link to={homeHref} className="enter-footer-brand" aria-label="Enter Pro home">
            <img
              src="https://cdn.enter.pro/visual_resources/100006299/b33ba3b0576e41ecb37b2d0a7e7609e5/a8f2c049.png"
              alt="Enter Pro"
              width={100}
              height={18}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <nav aria-label="Footer navigation" className="enter-footer-nav">
            {footerColumns.map((column) => (
              <section key={column.title}>
                <h2 className="enter-footer-heading">{column.title}</h2>
                <ul className="enter-footer-links">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                        rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
        </div>
        <div className="enter-footer-bottom">
          <p className="enter-footer-copyright">© 2026 Converge. All rights reserved.</p>
          <div className="enter-footer-actions">
            <ul className="enter-footer-socials" aria-label="Social media">
              {footerSocialLinks.map((social) => (
                <li key={social.icon}>
                  <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                    <span className={`enter-footer-social-icon enter-footer-social-icon--${social.icon}`} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <button type="button" onClick={scrollToTop} className="enter-footer-back">
              Back to top
              <ArrowUp aria-hidden="true" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
