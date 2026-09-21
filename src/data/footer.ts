export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: readonly FooterLink[];
};

// Destinations verified against Enter's live footer. Keep existing campaign parameters.
export const footerColumns: readonly FooterColumn[] = [
  {
    title: "PRODUCTS",
    links: [
      { label: "Enter Code", href: "https://enter.converge.ai/code" },
      { label: "Enter CLI", href: "https://enter.converge.ai/cli" },
      { label: "Framia", href: "https://framia.converge.ai/?utm_source=enter&utm_medium=web&utm_content=footer_products" },
      { label: "Converge", href: "https://converge.ai/" },
    ],
  },
  {
    title: "SOLUTIONS",
    links: [
      { label: "AI All", href: "https://enter.converge.ai/ai-all" },
      { label: "Templates", href: "https://enter.converge.ai/marketplace/templates" },
      { label: "Components", href: "https://enter.converge.ai/marketplace/components" },
    ],
  },
  {
    title: "FEATURES",
    links: [
      { label: "Enter April Launch", href: "https://enter.converge.ai/blog/enter-april-launch" },
      { label: "Enter Cloud", href: "https://enter.converge.ai/blog/enter-cloud" },
      { label: "Enter Skills", href: "https://enter.converge.ai/blog/introducing-enter-skills" },
      { label: "AI App Builder", href: "https://enter.converge.ai/features/ai-app-builder" },
      { label: "AI Website Builder", href: "https://enter.converge.ai/features/ai-website-builder" },
      { label: "Website Templates", href: "https://enter.converge.ai/features/website-template" },
      { label: "Online Code Editor", href: "https://enter.converge.ai/features/code-editor" },
      { label: "AI Agent Builder", href: "https://enter.converge.ai/features/ai-agent-builder" },
      { label: "Visual Editor", href: "https://enter.converge.ai/features/visual-editor" },
    ],
  },
  {
    title: "RESOURCES",
    links: [
      { label: "Blog", href: "https://enter.converge.ai/blog" },
      { label: "Changelog", href: "https://enter.converge.ai/blog/enters-changelog" },
      { label: "Enter Code Docs", href: "https://enter.converge.ai/docs/code" },
      { label: "Forum", href: "https://enter.converge.ai/forum?utm_source=enter&utm_medium=web&utm_content=home" },
      { label: "Features", href: "https://enter.converge.ai/features" },
      { label: "Activity", href: "https://enter.converge.ai/forum/activities" },
      { label: "Ambassador", href: "https://enter.converge.ai/ambassador" },
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
