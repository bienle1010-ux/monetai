export interface SaaSPurchase {
  toolId:      string;
  toolName:    string;
  purchasedAt: string;
  expiresAt:   string;       // 1 month from purchase
  accessNote:  string;       // delivery info (key, credentials hint, etc.)
  txCode:      string;
}

export interface AffiliateEntry {
  toolId:    string;
  toolName:  string;
  joinedAt:  string;
  clicks:    number;
  sales:     number;
  earned:    number;          // VND
}

export interface ListedTool {
  id:          string;
  name:        string;
  brand:       string;
  description: string;
  category:    string;
  priceVND:    number;
  commission:  number;
  officialUrl: string;
  sellerEmail: string;
  status:      "pending" | "active";
  submittedAt: string;
}

const PURCHASE_KEY   = (email: string) => `monetai_saas_purchases_${email}`;
const AFFILIATE_KEY  = (email: string) => `monetai_saas_affiliate_${email}`;
const LISTED_KEY     = (email: string) => `monetai_saas_listed_${email}`;

function ls<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}
function lsSet(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val));
}

// ─── Purchases ────────────────────────────────────────────────────────────────
export function getPurchases(email: string): SaaSPurchase[] {
  return ls<SaaSPurchase[]>(PURCHASE_KEY(email), []);
}
export function hasPurchased(email: string, toolId: string): boolean {
  return getPurchases(email).some((p) => p.toolId === toolId);
}
export function addPurchase(email: string, p: SaaSPurchase): void {
  const list = getPurchases(email).filter((x) => x.toolId !== p.toolId);
  lsSet(PURCHASE_KEY(email), [...list, p]);
}

// ─── Affiliate ────────────────────────────────────────────────────────────────
export function getAffiliates(email: string): AffiliateEntry[] {
  return ls<AffiliateEntry[]>(AFFILIATE_KEY(email), []);
}
export function isAffiliate(email: string, toolId: string): boolean {
  return getAffiliates(email).some((a) => a.toolId === toolId);
}
export function joinAffiliate(email: string, toolId: string, toolName: string): void {
  const list = getAffiliates(email).filter((a) => a.toolId !== toolId);
  lsSet(AFFILIATE_KEY(email), [
    ...list,
    { toolId, toolName, joinedAt: new Date().toISOString(), clicks: 0, sales: 0, earned: 0 },
  ]);
}

// ─── Listed tools ─────────────────────────────────────────────────────────────
export function getListedTools(email: string): ListedTool[] {
  return ls<ListedTool[]>(LISTED_KEY(email), []);
}
export function listTool(email: string, t: Omit<ListedTool, "id" | "sellerEmail" | "status" | "submittedAt">): void {
  const list = getListedTools(email);
  list.push({
    ...t,
    id:          "saas-" + Date.now(),
    sellerEmail: email,
    status:      "pending",
    submittedAt: new Date().toISOString(),
  });
  lsSet(LISTED_KEY(email), list);
}

// ─── VietQR ───────────────────────────────────────────────────────────────────
export function saasVietQRUrl(toolId: string, amount: number): string {
  const note = encodeURIComponent(`MONETAI ${toolId.slice(-8).toUpperCase()}`);
  return `https://api.vietqr.io/image/MB-0971166299-compact2.png?amount=${amount}&addInfo=${note}&accountName=MONET%20AI`;
}

// ─── Affiliate link ───────────────────────────────────────────────────────────
export function affiliateLinkFor(email: string, toolId: string): string {
  const uid = btoa(email).replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
  return `https://monetai.vn/ref/${toolId}?uid=${uid}`;
}
