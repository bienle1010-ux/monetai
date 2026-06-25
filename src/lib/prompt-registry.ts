export interface RegistryPrompt {
  id:            string;
  name:          string;
  description:   string;
  model:         string;
  category:      string;
  price:         number;
  fullPrompt:    string;
  variables:     Array<{ key: string; label: string; placeholder: string; required: boolean }>;
  sellerEmail:   string;
  sellerName:    string;
  status:        "active" | "inactive";
  publishedAt:   string;
  sales:         number;
  rating:        number;
  tags:          string[];
  preview:       string;
  outputExample: string;
  instructions:  string;
  badge?:        "HOT" | "MỚI" | "BÁN CHẠY";
}

const PROMPT_REGISTRY_KEY = "monetai_prompt_registry";
const PROMPT_PURCHASE_PREFIX = "monetai_prompt_purchases_";

export function getPromptRegistry(): Record<string, RegistryPrompt> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROMPT_REGISTRY_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function savePromptToRegistry(p: RegistryPrompt): void {
  const reg = getPromptRegistry();
  reg[p.id] = p;
  localStorage.setItem(PROMPT_REGISTRY_KEY, JSON.stringify(reg));
}

export function removePromptFromRegistry(id: string): void {
  const reg = getPromptRegistry();
  delete reg[id];
  localStorage.setItem(PROMPT_REGISTRY_KEY, JSON.stringify(reg));
}

export function getRegistryPrompt(id: string): RegistryPrompt | null {
  return getPromptRegistry()[id] ?? null;
}

export function getPurchasedPrompts(email: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PROMPT_PURCHASE_PREFIX + email) ?? "[]");
  } catch {
    return [];
  }
}

export function hasPurchasedPrompt(email: string, promptId: string): boolean {
  return getPurchasedPrompts(email).includes(promptId);
}

export function addPromptPurchase(email: string, promptId: string): void {
  const list = getPurchasedPrompts(email);
  if (!list.includes(promptId)) {
    localStorage.setItem(PROMPT_PURCHASE_PREFIX + email, JSON.stringify([...list, promptId]));
  }
  // increment sales counter
  const reg = getPromptRegistry();
  if (reg[promptId]) {
    reg[promptId].sales = (reg[promptId].sales ?? 0) + 1;
    localStorage.setItem(PROMPT_REGISTRY_KEY, JSON.stringify(reg));
  }
}

export function promptVietQRUrl(promptId: string, amount: number): string {
  const bankId  = "MB";
  const account = "0971166299";
  const note    = encodeURIComponent(`MONETAI ${promptId.slice(-8).toUpperCase()}`);
  return `https://api.vietqr.io/image/${bankId}-${account}-compact2.png?amount=${amount}&addInfo=${note}&accountName=MONET%20AI`;
}
