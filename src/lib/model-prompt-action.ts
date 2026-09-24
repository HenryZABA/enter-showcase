export const ENTER_DESTINATION = "https://enter.converge.ai/s/B1GyrW";

/** Call only after the user's copy/download succeeds. Never open a tab before clipboard access. */
export function openEnter() {
  let tab: Window | null = null;
  try { tab = window.open(ENTER_DESTINATION, "_blank"); } catch { /* Popup policy may block new tabs. */ }
  if (tab) tab.opener = null;
  else window.location.assign(ENTER_DESTINATION);
}

type PromptActionDependencies = {
  copy: (text: string) => Promise<void>;
  navigate: (url: string) => void;
};

/** Copy first; do not navigate on empty input or clipboard rejection. No prompt URL parameters. */
export async function copyPromptAndOpenEnter(prompt: string, { copy, navigate }: PromptActionDependencies): Promise<void> {
  if (!prompt.trim()) return;
  await copy(prompt);
  navigate(ENTER_DESTINATION);
}
