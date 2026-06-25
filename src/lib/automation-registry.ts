export interface SavedAutomation {
  id:            string;
  templateId:    string;
  name:          string;
  category:      string;
  config:        Record<string, string>;
  status:        "active" | "paused" | "error";
  createdAt:     string;
  ownerEmail:    string;
  runsTotal:     number;
  runsToday:     number;
  savedHours:    number;
  lastRunAt?:    string;
  savesHoursPerWeek: number;
}

const REGISTRY_KEY = "monetai_automations";
const PURCHASE_PREFIX = "monetai_auto_purchases_";

export function getAutomations(email: string): SavedAutomation[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(REGISTRY_KEY) ?? "[]") as SavedAutomation[];
    return all.filter((a) => a.ownerEmail === email);
  } catch { return []; }
}

export function saveAutomation(a: SavedAutomation): void {
  const all = getAllAutomations();
  const idx = all.findIndex((x) => x.id === a.id);
  if (idx >= 0) all[idx] = a; else all.push(a);
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(all));
}

export function deleteAutomation(id: string): void {
  const all = getAllAutomations().filter((a) => a.id !== id);
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(all));
}

export function toggleAutomation(id: string): void {
  const all = getAllAutomations();
  const a   = all.find((x) => x.id === id);
  if (a) { a.status = a.status === "active" ? "paused" : "active"; }
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(all));
}

function getAllAutomations(): SavedAutomation[] {
  try { return JSON.parse(localStorage.getItem(REGISTRY_KEY) ?? "[]"); }
  catch { return []; }
}

export function getPurchasedTemplates(email: string): string[] {
  try { return JSON.parse(localStorage.getItem(PURCHASE_PREFIX + email) ?? "[]"); }
  catch { return []; }
}

export function addTemplatePurchase(email: string, templateId: string): void {
  const list = getPurchasedTemplates(email);
  if (!list.includes(templateId))
    localStorage.setItem(PURCHASE_PREFIX + email, JSON.stringify([...list, templateId]));
}

export function autoVietQRUrl(templateId: string, amount: number): string {
  const note = encodeURIComponent(`MONETAI ${templateId.slice(-8).toUpperCase()}`);
  return `https://api.vietqr.io/image/MB-0971166299-compact2.png?amount=${amount}&addInfo=${note}&accountName=MONET%20AI`;
}
