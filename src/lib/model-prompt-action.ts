type PromptActionDependencies = {
  copy: (text: string) => Promise<void>;
  navigate: (url: string) => void;
};

/** Copy first; do not navigate on empty input or clipboard rejection. No prompt URL parameters. */
export async function copyPromptAndOpenEnter(prompt: string, { copy, navigate }: PromptActionDependencies): Promise<void> {
  if (!prompt.trim()) return;
  await copy(prompt);
  navigate("https://enter.converge.ai/");
}
