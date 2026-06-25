// Shared agent registry utilities — used by sell page + public agent page

export interface RegistryAgent {
  id:              string;
  name:            string;
  tagline:         string;
  description:     string;
  category:        string;
  icon:            string;
  badge:           string;
  price:           number;
  priceType:       "tháng" | "lần";
  features:        string[];
  systemPrompt:    string;
  demoGreeting:    string;
  demoSuggestions: string[];
  attachments:     RegistryAttachment[];
  sellerEmail:     string;
  sellerName:      string;
  bankName:        string;
  bankAccount:     string;
  bankHolder:      string;
  status:          "active" | "inactive";
  deployedAt:      string;
  demoLimit:       number;
  totalSales:      number;
  totalRevenue:    number;
}

export interface RegistryAttachment {
  name:        string;
  ext:         string;
  content:     string;
  description: string;
  isText:      boolean;
  size:        number;
}

export const REGISTRY_KEY = "monetai_agent_registry";

export function getRegistry(): Record<string, RegistryAgent> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(REGISTRY_KEY) ?? "{}"); }
  catch { return {}; }
}

export function saveToRegistry(agent: RegistryAgent): void {
  const reg = getRegistry();
  reg[agent.id] = agent;
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(reg));
}

export function removeFromRegistry(id: string): void {
  const reg = getRegistry();
  delete reg[id];
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(reg));
}

export function getRegistryAgent(id: string): RegistryAgent | null {
  return getRegistry()[id] ?? null;
}

// ── Purchase tracking ──────────────────────────────────────────────────────────

function purchaseKey(email: string): string {
  return `monetai_purchases_${email.toLowerCase()}`;
}

export function getPurchasedAgents(email: string): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(purchaseKey(email)) ?? "[]"); }
  catch { return []; }
}

export function addPurchase(email: string, agentId: string): void {
  const list = getPurchasedAgents(email);
  if (!list.includes(agentId)) {
    list.push(agentId);
    localStorage.setItem(purchaseKey(email), JSON.stringify(list));
  }
}

export function hasPurchased(email: string, agentId: string): boolean {
  return getPurchasedAgents(email).includes(agentId);
}

// ── VietQR helper ──────────────────────────────────────────────────────────────
const MB_ACCOUNT = "0971166299";
const MB_NAME    = "MONET AI";

export function vietQRUrl(agentId: string, amount: number): string {
  const note = `MONETAI ${agentId.slice(-8).toUpperCase()}`;
  return `https://img.vietqr.io/image/MB-${MB_ACCOUNT}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(note)}&accountName=${encodeURIComponent(MB_NAME)}`;
}
