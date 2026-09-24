import { ENTER_DESTINATION } from "@/lib/model-prompt-action";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: readonly FooterLink[];
};

// Enter destinations share the supplied campaign link; other brands, legal and social URLs stay unchanged.
export const footerColumns: readonly FooterColumn[] = [
  {
    title: "PRODUCTS",
    links: [
      { label: "Enter Code", href: ENTER_DESTINATION },
      { label: "Enter CLI", href: ENTER_DESTINATION },
      { label: "Framia", href: "https://framia.converge.ai/?utm_source=enter&utm_medium=web&utm_content=footer_products" },
      { label: "Converge", href: "https://converge.ai/" },
    ],
  },
  {
    title: "SOLUTIONS",
    links: [
      { label: "AI All", href: ENTER_DESTINATION },
      { label: "Templates", href: ENTER_DESTINATION },
      { label: "Components", href: ENTER_DESTINATION },
    ],
  },
  {
    title: "FEATURES",
    links: [
      { label: "Enter April Launch", href: ENTER_DESTINATION },
      { label: "Enter Cloud", href: ENTER_DESTINATION },
      { label: "Enter Skills", href: ENTER_DESTINATION },
      { label: "AI App Builder", href: ENTER_DESTINATION },
      { label: "AI Website Builder", href: ENTER_DESTINATION },
      { label: "Website Templates", href: ENTER_DESTINATION },
      { label: "Online Code Editor", href: ENTER_DESTINATION },
      { label: "AI Agent Builder", href: ENTER_DESTINATION },
      { label: "Visual Editor", href: ENTER_DESTINATION },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Blog", href: ENTER_DESTINATION },
      { label: "Changelog", href: ENTER_DESTINATION },
      { label: "Enter Code Docs", href: ENTER_DESTINATION },
      { label: "Forum", href: ENTER_DESTINATION },
      { label: "Features", href: ENTER_DESTINATION },
      { label: "Activity", href: ENTER_DESTINATION },
      { label: "Ambassador", href: ENTER_DESTINATION },
    ],
  },
  {
    title: "TERMS",
    links: [
      { label: "Terms of Service", href: "https://converge.ai/terms-of-service" },
      { label: "Privacy Policy", href: "https://converge.ai/privacy-policy" },
    ],
  },
  {
    title: "CONTACT",
    links: [
      { label: "Feedback", href: "mailto:feedback@enter.pro" },
      { label: "Support", href: "mailto:support@enter.pro" },
    ],
  },
];

// Brand SVG artwork is sourced from Enter's own landing-page footer.
export const footerSocialLinks = [
  { label: "X", icon: "x", href: "https://x.com/EnterProAI" },
  { label: "Discord", icon: "discord", href: "https://discord.gg/5FZjchgfb6" },
  { label: "TikTok", icon: "tiktok", href: "https://www.tiktok.com/@enter.pro.ai" },
  { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@EnterProAI" },
  { label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/enterproai/" },
] as const;
