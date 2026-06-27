"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RefreshCw, Plus, Trash2, CheckCircle, AlertCircle,
  Home, Layers, Star, HelpCircle, DollarSign, Settings, MessageSquare, Footprints,
  ChevronDown, ChevronUp, Download, Upload } from "lucide-react";
import type { SiteContent, HeroData, Service, Feature, HowStep, Plan, Testimonial, FAQItem, SiteConfig } from "@/lib/contentStore";

// ── Styles ──────────────────────────────────────────────────────────────────
const INP  = "w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#A0A0B0]/50 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all";
const LBL  = "block text-[10px] font-bold text-[#A0A0B0] mb-1 uppercase tracking-widest";
const CARD = "bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-5";
const SECT = "font-semibold text-white text-sm mb-3 flex items-center gap-2";

type TabId = "hero"|"services"|"features"|"howitworks"|"pricing"|"testimonials"|"faq"|"config";

const TABS: { id: TabId; label: string; icon: React.ComponentType<{className?:string}> }[] = [
  { id: "hero",         label: "Trang chủ",  icon: Home },
  { id: "services",     label: "Dịch vụ",    icon: Layers },
  { id: "features",     label: "Tính năng",  icon: Star },
  { id: "howitworks",   label: "Cách dùng",  icon: Footprints },
  { id: "pricing",      label: "Bảng giá",   icon: DollarSign },
  { id: "testimonials", label: "Đánh giá",   icon: MessageSquare },
  { id: "faq",          label: "FAQ",         icon: HelpCircle },
  { id: "config",       label: "Cấu hình",   icon: Settings },
];

function uid() { return Math.random().toString(36).slice(2,10); }

export default function AdminContentPage() {
  const [tab, setTab]       = useState<TabId>("hero");
  const [data, setData]     = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState<{type:"ok"|"err";msg:string}|null>(null);
  const [expanded, setExpanded] = useState<string|null>(null);

  const tok = () => ({ "Content-Type":"application/json", Authorization:`Bearer ${typeof window!=="undefined"?localStorage.getItem("monetai_admin_token"):""}` });

  const showToast = (type:"ok"|"err", msg:string) => { setToast({type,msg}); setTimeout(()=>setToast(null),3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/content", { headers: tok() });
      if (r.ok) setData(await r.json() as SiteContent);
      else showToast("err","Không thể tải dữ liệu.");
    } finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save(type: keyof SiteContent, payload: unknown) {
    if (!data) return;
    setSaving(true);
    try {
      const r = await fetch("/api/admin/content", { method:"POST", headers:tok(), body:JSON.stringify({type,data:payload}) });
      if (r.ok) { showToast("ok","✅ Đã lưu thành công!"); setData({...data,[type]:payload as SiteContent[typeof type]}); }
      else showToast("err","Lưu thất bại.");
    } catch { showToast("err","Lỗi kết nối."); }
    finally { setSaving(false); }
  }

  async function resetAll() {
    if (!confirm("Reset toàn bộ về nội dung gốc?")) return;
    await fetch("/api/admin/content",{method:"POST",headers:tok(),body:JSON.stringify({type:"reset"})});
    showToast("ok","Đã reset!"); await load();
  }

  function exportJSON() {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob);
    a.download=`monetai-content-${new Date().toISOString().slice(0,10)}.json`; a.click();
  }

  function importJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as SiteContent;
        setData(parsed);
        showToast("ok","Đã import — nhấn Lưu từng tab để áp dụng.");
      } catch { showToast("err","File JSON không hợp lệ."); }
    };
    reader.readAsText(f);
  }

  if (loading || !data) return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-6 h-6 text-[#FF6B00] animate-spin" />
    </div>
  );

  // Helper setters
  const setH = (h: HeroData) => setData(d => d ? {...d, hero:h} : d);
  const setSvcs = (s: Service[]) => setData(d => d ? {...d, services:s} : d);
  const setFeats = (f: Feature[]) => setData(d => d ? {...d, features:f} : d);
  const setSteps = (s: HowStep[]) => setData(d => d ? {...d, howItWorks:s} : d);
  const setPlans = (p: Plan[]) => setData(d => d ? {...d, plans:p} : d);
  const setTesti = (t: Testimonial[]) => setData(d => d ? {...d, testimonials:t} : d);
  const setFAQs = (f: FAQItem[]) => setData(d => d ? {...d, faqs:f} : d);
  const setCfg = (c: SiteConfig) => setData(d => d ? {...d, config:c} : d);

  const hero = data.hero;
  const cfg  = data.config;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý nội dung toàn trang</h1>
          <p className="text-[#A0A0B0] text-xs mt-0.5">Chỉnh sửa và lưu từng tab — thay đổi hiện ngay trên web</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={exportJSON} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-[#16161F] border border-[#2A2A3A] text-[#A0A0B0] hover:text-white transition-colors">
            <Download className="w-3.5 h-3.5"/>Xuất JSON
          </button>
          <label className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-[#16161F] border border-[#2A2A3A] text-[#A0A0B0] hover:text-white transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5"/>Import JSON
            <input type="file" accept=".json" className="hidden" onChange={importJSON}/>
          </label>
          <button onClick={resetAll} className="text-xs px-3 py-2 rounded-xl text-red-400 hover:bg-red-400/10 border border-red-400/20 transition-colors">Reset</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-[#111118] border border-[#2A2A3A] rounded-2xl p-1 overflow-x-auto">
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${tab===t.id?"bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/20":"text-[#A0A0B0] hover:text-white"}`}>
            <t.icon className="w-3.5 h-3.5"/>{t.label}
          </button>
        ))}
      </div>

      {/* ── HERO ── */}
      {tab==="hero" && (
        <div className="space-y-4">
          <div className={CARD}>
            <p className={SECT}><Home className="w-4 h-4 text-[#FF6B00]"/>Badge & Tiêu đề</p>
            <div className="space-y-3">
              <div><label className={LBL}>Badge (dòng nhỏ trên tiêu đề)</label>
                <input className={INP} value={hero.badge} onChange={e=>setH({...hero,badge:e.target.value})}/></div>
              <div><label className={LBL}>Tiêu đề chính (cách bằng space, từ được highlight bên dưới)</label>
                <input className={INP} value={hero.title} onChange={e=>setH({...hero,title:e.target.value})}/></div>
              <div><label className={LBL}>Từ in màu cam (cách nhau bằng dấu phẩy, VD: More,AI)</label>
                <input className={INP} value={hero.highlight.join(",")}
                  onChange={e=>setH({...hero,highlight:e.target.value.split(",").map(s=>s.trim())})}/></div>
              <div><label className={LBL}>Mô tả dưới tiêu đề</label>
                <textarea className={`${INP} resize-none`} rows={3} value={hero.subtitle} onChange={e=>setH({...hero,subtitle:e.target.value})}/></div>
            </div>
          </div>

          <div className={CARD}>
            <p className={SECT}>Nút CTA</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#FF6B00]">Nút 1 (màu cam)</p>
                <div><label className={LBL}>Text</label><input className={INP} value={hero.cta1.text} onChange={e=>setH({...hero,cta1:{...hero.cta1,text:e.target.value}})}/></div>
                <div><label className={LBL}>Link</label><input className={INP} value={hero.cta1.href} onChange={e=>setH({...hero,cta1:{...hero.cta1,href:e.target.value}})}/></div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#A0A0B0]">Nút 2 (viền)</p>
                <div><label className={LBL}>Text</label><input className={INP} value={hero.cta2.text} onChange={e=>setH({...hero,cta2:{...hero.cta2,text:e.target.value}})}/></div>
                <div><label className={LBL}>Link</label><input className={INP} value={hero.cta2.href} onChange={e=>setH({...hero,cta2:{...hero.cta2,href:e.target.value}})}/></div>
              </div>
            </div>
          </div>

          <div className={CARD}>
            <p className={SECT}>Số liệu thống kê (3 stats)</p>
            <div className="space-y-3">
              {hero.stats.map((s,i)=>(
                <div key={i} className="grid grid-cols-2 gap-3">
                  <div><label className={LBL}>Label {i+1}</label><input className={INP} value={s.label} onChange={e=>{const a=[...hero.stats];a[i]={...a[i],label:e.target.value};setH({...hero,stats:a});}}/></div>
                  <div><label className={LBL}>Giá trị {i+1}</label><input className={INP} value={s.value} onChange={e=>{const a=[...hero.stats];a[i]={...a[i],value:e.target.value};setH({...hero,stats:a});}}/></div>
                </div>
              ))}
            </div>
          </div>

          <div className={CARD}>
            <p className={SECT}>Card minh hoạ (góc phải màn hình)</p>
            <div className="grid grid-cols-2 gap-3">
              {([["revenue","Doanh thu tháng (VD: 12.500.000 ₫)"],["revenueGrowth","Tăng trưởng (VD: +47.3%)"],["commission","Hoa hồng hôm nay"],["orders","Số đơn (VD: 12 đơn hàng)"],["contents","Nội dung đã tạo (VD: 2.847)"]] as const).map(([k,l])=>(
                <div key={k}><label className={LBL}>{l}</label>
                  <input className={INP} value={hero.card[k]} onChange={e=>setH({...hero,card:{...hero.card,[k]:e.target.value}})}/></div>
              ))}
            </div>
          </div>

          <button onClick={()=>save("hero",data.hero)} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-xl disabled:opacity-60 transition-colors">
            {saving?<RefreshCw className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>} Lưu Hero Section
          </button>
        </div>
      )}

      {/* ── SERVICES ── */}
      {tab==="services" && (
        <div className="space-y-3">
          <div className={CARD}>
            <label className={LBL}>Tiêu đề section dịch vụ</label>
            <input className={INP} value={cfg.servicesTitle} onChange={e=>setCfg({...cfg,servicesTitle:e.target.value})}/>
            <button onClick={()=>save("config",{...data.config,servicesTitle:cfg.servicesTitle})} className="mt-2 text-xs text-[#FF6B00] hover:underline">Lưu tiêu đề</button>
          </div>
          {data.services.map((s,i)=>(
            <div key={s.id||i} className={`${CARD} border-l-2 ${expanded===`svc-${i}`?"border-[#FF6B00]":"border-[#2A2A3A]"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold flex items-center justify-center">{i+1}</span>
                  <span className="text-white text-xs font-semibold">{s.title}</span>
                </div>
                <button onClick={()=>setExpanded(expanded===`svc-${i}`?null:`svc-${i}`)} className="text-[#A0A0B0] hover:text-white">
                  {expanded===`svc-${i}`?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}
                </button>
              </div>
              {expanded===`svc-${i}` && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div><label className={LBL}>Tên dịch vụ</label><input className={INP} value={s.title} onChange={e=>{const a=[...data.services];a[i]={...a[i],title:e.target.value};setSvcs(a);}}/></div>
                  <div><label className={LBL}>Icon (tên Lucide)</label><input className={INP} value={s.icon} onChange={e=>{const a=[...data.services];a[i]={...a[i],icon:e.target.value};setSvcs(a);}}/></div>
                  <div className="col-span-2"><label className={LBL}>Mô tả</label><textarea className={`${INP} resize-none`} rows={2} value={s.description} onChange={e=>{const a=[...data.services];a[i]={...a[i],description:e.target.value};setSvcs(a);}}/></div>
                  <div><label className={LBL}>Link đến</label><input className={INP} value={s.href} onChange={e=>{const a=[...data.services];a[i]={...a[i],href:e.target.value};setSvcs(a);}}/></div>
                  <div><label className={LBL}>Màu (hex)</label><div className="flex gap-2"><input className={INP} value={s.color} onChange={e=>{const a=[...data.services];a[i]={...a[i],color:e.target.value};setSvcs(a);}}/><div className="w-10 h-10 rounded-lg border border-[#2A2A3A] shrink-0" style={{background:s.color}}/></div></div>
                </div>
              )}
            </div>
          ))}
          <button onClick={()=>save("services",data.services)} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-xl disabled:opacity-60 transition-colors">
            {saving?<RefreshCw className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>} Lưu tất cả dịch vụ
          </button>
        </div>
      )}

      {/* ── FEATURES ── */}
      {tab==="features" && (
        <div className="space-y-3">
          <div className={CARD}>
            <label className={LBL}>Tiêu đề section</label>
            <input className={INP} value={cfg.featuresTitle} onChange={e=>setCfg({...cfg,featuresTitle:e.target.value})}/>
            <button onClick={()=>save("config",{...data.config,featuresTitle:cfg.featuresTitle})} className="mt-2 text-xs text-[#FF6B00] hover:underline">Lưu tiêu đề</button>
          </div>
          <div className={`${CARD}`}>
            <p className="text-xs text-[#A0A0B0] mb-3">12 tính năng nổi bật (icon = tên Lucide)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.features.map((f,i)=>(
                <div key={f.id||i} className="flex gap-2">
                  <input className={`${INP} w-28 shrink-0`} placeholder="Icon" value={f.icon}
                    onChange={e=>{const a=[...data.features];a[i]={...a[i],icon:e.target.value};setFeats(a);}}/>
                  <input className={INP} placeholder="Tên tính năng" value={f.title}
                    onChange={e=>{const a=[...data.features];a[i]={...a[i],title:e.target.value};setFeats(a);}}/>
                </div>
              ))}
            </div>
          </div>
          <button onClick={()=>save("features",data.features)} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-xl disabled:opacity-60 transition-colors">
            {saving?<RefreshCw className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>} Lưu tính năng
          </button>
        </div>
      )}

      {/* ── HOW IT WORKS ── */}
      {tab==="howitworks" && (
        <div className="space-y-3">
          <div className={CARD}>
            <label className={LBL}>Tiêu đề section</label>
            <input className={INP} value={cfg.howItWorksTitle} onChange={e=>setCfg({...cfg,howItWorksTitle:e.target.value})}/>
            <button onClick={()=>save("config",{...data.config,howItWorksTitle:cfg.howItWorksTitle})} className="mt-2 text-xs text-[#FF6B00] hover:underline">Lưu tiêu đề</button>
          </div>
          {data.howItWorks.map((s,i)=>(
            <div key={s.id||i} className={CARD}>
              <p className="text-[#FF6B00] text-xs font-bold mb-3">Bước {i+1}</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={LBL}>Số bước (VD: 01)</label><input className={INP} value={s.step} onChange={e=>{const a=[...data.howItWorks];a[i]={...a[i],step:e.target.value};setSteps(a);}}/></div>
                <div><label className={LBL}>Icon (emoji)</label><input className={INP} value={s.icon} onChange={e=>{const a=[...data.howItWorks];a[i]={...a[i],icon:e.target.value};setSteps(a);}}/></div>
                <div><label className={LBL}>Tiêu đề bước</label><input className={INP} value={s.title} onChange={e=>{const a=[...data.howItWorks];a[i]={...a[i],title:e.target.value};setSteps(a);}}/></div>
                <div><label className={LBL}>Mô tả ngắn</label><input className={INP} value={s.description} onChange={e=>{const a=[...data.howItWorks];a[i]={...a[i],description:e.target.value};setSteps(a);}}/></div>
              </div>
            </div>
          ))}
          <button onClick={()=>{save("howItWorks",data.howItWorks);save("config",data.config);}} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-xl disabled:opacity-60 transition-colors">
            {saving?<RefreshCw className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>} Lưu các bước
          </button>
        </div>
      )}

      {/* ── PRICING ── */}
      {tab==="pricing" && (
        <div className="space-y-4">
          <div className={CARD}>
            <label className={LBL}>Tiêu đề section bảng giá</label>
            <input className={INP} value={cfg.pricingTitle} onChange={e=>setCfg({...cfg,pricingTitle:e.target.value})}/>
            <button onClick={()=>save("config",{...data.config,pricingTitle:cfg.pricingTitle})} className="mt-2 text-xs text-[#FF6B00] hover:underline">Lưu tiêu đề</button>
          </div>
          {data.plans.map((plan,pi)=>(
            <div key={plan.id} className={`${CARD} ${plan.popular?"border-[#FF6B00]/40":""}`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-white font-bold text-sm">{plan.name} {plan.popular&&<span className="text-xs bg-[#FF6B00]/15 text-[#FF6B00] px-2 py-0.5 rounded-full ml-1">Phổ biến</span>}</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-[#A0A0B0]">Nổi bật</span>
                  <div className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${plan.popular?"bg-[#FF6B00]":"bg-[#2A2A3A]"}`}
                    onClick={()=>{const a=[...data.plans];a[pi]={...a[pi],popular:!plan.popular};setPlans(a);}}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${plan.popular?"left-4":"left-0.5"}`}/>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className={LBL}>Tên gói</label><input className={INP} value={plan.name} onChange={e=>{const a=[...data.plans];a[pi]={...a[pi],name:e.target.value};setPlans(a);}}/></div>
                <div><label className={LBL}>Giá (số, để trống=Liên hệ)</label><input className={INP} type="number" value={plan.price??""} onChange={e=>{const a=[...data.plans];a[pi]={...a[pi],price:e.target.value?Number(e.target.value):null};setPlans(a);}}/></div>
                <div><label className={LBL}>Kỳ hạn (VD: tháng)</label><input className={INP} value={plan.period} onChange={e=>{const a=[...data.plans];a[pi]={...a[pi],period:e.target.value};setPlans(a);}}/></div>
                <div><label className={LBL}>Badge (để trống nếu không có)</label><input className={INP} value={plan.badge??""} onChange={e=>{const a=[...data.plans];a[pi]={...a[pi],badge:e.target.value||null};setPlans(a);}}/></div>
                <div className="col-span-2"><label className={LBL}>Mô tả</label><input className={INP} value={plan.description} onChange={e=>{const a=[...data.plans];a[pi]={...a[pi],description:e.target.value};setPlans(a);}}/></div>
                <div><label className={LBL}>Text nút CTA</label><input className={INP} value={plan.cta} onChange={e=>{const a=[...data.plans];a[pi]={...a[pi],cta:e.target.value};setPlans(a);}}/></div>
              </div>
              <div>
                <label className={LBL}>Danh sách tính năng (mỗi dòng 1 tính năng)</label>
                <textarea className={`${INP} resize-none`} rows={plan.features.length+1}
                  value={plan.features.join("\n")}
                  onChange={e=>{const a=[...data.plans];a[pi]={...a[pi],features:e.target.value.split("\n")};setPlans(a);}}/>
              </div>
            </div>
          ))}
          <button onClick={()=>save("plans",data.plans)} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-xl disabled:opacity-60 transition-colors">
            {saving?<RefreshCw className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>} Lưu bảng giá
          </button>
        </div>
      )}

      {/* ── TESTIMONIALS ── */}
      {tab==="testimonials" && (
        <div className="space-y-3">
          <div className={CARD}>
            <label className={LBL}>Tiêu đề section</label>
            <input className={INP} value={cfg.testimonialsTitle} onChange={e=>setCfg({...cfg,testimonialsTitle:e.target.value})}/>
            <button onClick={()=>save("config",{...data.config,testimonialsTitle:cfg.testimonialsTitle})} className="mt-2 text-xs text-[#FF6B00] hover:underline">Lưu tiêu đề</button>
          </div>
          <AnimatePresence>
            {data.testimonials.map((t,i)=>(
              <motion.div key={t.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className={CARD}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold flex items-center justify-center">{t.avatar}</div>
                    <span className="text-white text-xs font-semibold">{t.name}</span>
                  </div>
                  <button onClick={()=>{const a=data.testimonials.filter((_,j)=>j!==i);setTesti(a);}}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#A0A0B0] hover:text-red-400"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div><label className={LBL}>Họ tên</label><input className={INP} value={t.name} onChange={e=>{const a=[...data.testimonials];a[i]={...a[i],name:e.target.value};setTesti(a);}}/></div>
                  <div><label className={LBL}>Chức danh</label><input className={INP} value={t.role} onChange={e=>{const a=[...data.testimonials];a[i]={...a[i],role:e.target.value};setTesti(a);}}/></div>
                  <div><label className={LBL}>Avatar (chữ tắt)</label><input className={INP} maxLength={3} value={t.avatar} onChange={e=>{const a=[...data.testimonials];a[i]={...a[i],avatar:e.target.value.toUpperCase()};setTesti(a);}}/></div>
                  <div><label className={LBL}>Số sao</label>
                    <div className="flex gap-1 mt-1">{[1,2,3,4,5].map(s=>(
                      <button key={s} onClick={()=>{const a=[...data.testimonials];a[i]={...a[i],rating:s};setTesti(a);}}
                        className={`text-xl ${s<=t.rating?"text-yellow-400":"text-[#3A3A4A]"}`}>★</button>
                    ))}</div>
                  </div>
                </div>
                <div><label className={LBL}>Nội dung đánh giá</label>
                  <textarea className={`${INP} resize-none`} rows={2} value={t.content} onChange={e=>{const a=[...data.testimonials];a[i]={...a[i],content:e.target.value};setTesti(a);}}/></div>
              </motion.div>
            ))}
          </AnimatePresence>
          <button onClick={()=>setTesti([...data.testimonials,{id:uid(),name:"Tên khách hàng",role:"Chức danh",avatar:"TK",rating:5,content:"Nội dung đánh giá..."}])}
            className="w-full border border-dashed border-[#FF6B00]/30 text-[#FF6B00] text-sm py-3 rounded-xl hover:bg-[#FF6B00]/5 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4"/>Thêm đánh giá
          </button>
          <button onClick={()=>save("testimonials",data.testimonials)} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-xl disabled:opacity-60 transition-colors">
            {saving?<RefreshCw className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>} Lưu {data.testimonials.length} đánh giá
          </button>
        </div>
      )}

      {/* ── FAQ ── */}
      {tab==="faq" && (
        <div className="space-y-3">
          <AnimatePresence>
            {data.faqs.map((f,i)=>(
              <motion.div key={f.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                className={`${CARD} border-l-2 ${expanded===`faq-${i}`?"border-[#FF6B00]":"border-[#2A2A3A]"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-bold flex items-center justify-center shrink-0">{i+1}</span>
                  <input value={f.q} onChange={e=>{const a=[...data.faqs];a[i]={...a[i],q:e.target.value};setFAQs(a);}}
                    className="flex-1 bg-transparent border-0 text-white text-sm font-medium outline-none" placeholder="Câu hỏi..."/>
                  <button onClick={()=>setExpanded(expanded===`faq-${i}`?null:`faq-${i}`)} className="text-[#A0A0B0] hover:text-white shrink-0">
                    {expanded===`faq-${i}`?<ChevronUp className="w-3.5 h-3.5"/>:<ChevronDown className="w-3.5 h-3.5"/>}
                  </button>
                  <button onClick={()=>setFAQs(data.faqs.filter((_,j)=>j!==i))} className="p-1 hover:bg-red-500/10 text-[#A0A0B0] hover:text-red-400 rounded shrink-0">
                    <Trash2 className="w-3.5 h-3.5"/>
                  </button>
                </div>
                {expanded===`faq-${i}` && (
                  <div className="mt-2"><label className={LBL}>Câu trả lời</label>
                    <textarea className={`${INP} resize-none`} rows={4} value={f.a}
                      onChange={e=>{const a=[...data.faqs];a[i]={...a[i],a:e.target.value};setFAQs(a);}}/></div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <button onClick={()=>setFAQs([...data.faqs,{id:uid(),q:"Câu hỏi mới?",a:"Câu trả lời..."}])}
            className="w-full border border-dashed border-[#FF6B00]/30 text-[#FF6B00] text-sm py-3 rounded-xl hover:bg-[#FF6B00]/5 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4"/>Thêm câu hỏi
          </button>
          <button onClick={()=>save("faqs",data.faqs)} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-xl disabled:opacity-60 transition-colors">
            {saving?<RefreshCw className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>} Lưu {data.faqs.length} câu hỏi
          </button>
        </div>
      )}

      {/* ── CONFIG ── */}
      {tab==="config" && (
        <div className="space-y-4">
          {/* Banner */}
          <div className={CARD}>
            <p className={SECT}><AlertCircle className="w-4 h-4 text-[#FF6B00]"/>Banner thông báo</p>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <div className={`w-10 h-5 rounded-full transition-colors relative ${cfg.announcement.enabled?"bg-[#FF6B00]":"bg-[#2A2A3A]"}`}
                onClick={()=>setCfg({...cfg,announcement:{...cfg.announcement,enabled:!cfg.announcement.enabled}})}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${cfg.announcement.enabled?"left-5":"left-0.5"}`}/>
              </div>
              <span className="text-sm text-[#A0A0B0]">{cfg.announcement.enabled?"Đang hiện banner":"Ẩn banner"}</span>
            </label>
            <div className="space-y-2">
              <div><label className={LBL}>Nội dung thông báo</label><input className={INP} value={cfg.announcement.text} onChange={e=>setCfg({...cfg,announcement:{...cfg.announcement,text:e.target.value}}) } placeholder="🎉 Ra mắt tính năng mới..."/></div>
              <div><label className={LBL}>Link khi click</label><input className={INP} value={cfg.announcement.link} onChange={e=>setCfg({...cfg,announcement:{...cfg.announcement,link:e.target.value}})} placeholder="/pricing"/></div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className={CARD}>
            <p className={SECT}>Section CTA (Banner cuối trang)</p>
            <div className="space-y-2">
              <div><label className={LBL}>Tiêu đề</label><input className={INP} value={cfg.cta.title} onChange={e=>setCfg({...cfg,cta:{...cfg.cta,title:e.target.value}})}/></div>
              <div><label className={LBL}>Mô tả</label><input className={INP} value={cfg.cta.subtitle} onChange={e=>setCfg({...cfg,cta:{...cfg.cta,subtitle:e.target.value}})}/></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className={LBL}>Nút 1</label><input className={INP} value={cfg.cta.btn1} onChange={e=>setCfg({...cfg,cta:{...cfg.cta,btn1:e.target.value}})}/></div>
                <div><label className={LBL}>Nút 2</label><input className={INP} value={cfg.cta.btn2} onChange={e=>setCfg({...cfg,cta:{...cfg.cta,btn2:e.target.value}})}/></div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className={CARD}>
            <p className={SECT}>Thông tin liên hệ</p>
            <div className="space-y-2">
              <div><label className={LBL}>Email</label><input className={INP} value={cfg.contact.email} onChange={e=>setCfg({...cfg,contact:{...cfg.contact,email:e.target.value}})}/></div>
              <div><label className={LBL}>Điện thoại</label><input className={INP} value={cfg.contact.phone} onChange={e=>setCfg({...cfg,contact:{...cfg.contact,phone:e.target.value}})}/></div>
              <div><label className={LBL}>Địa chỉ</label><input className={INP} value={cfg.contact.address} onChange={e=>setCfg({...cfg,contact:{...cfg.contact,address:e.target.value}})}/></div>
            </div>
          </div>

          {/* Social */}
          <div className={CARD}>
            <p className={SECT}>Mạng xã hội</p>
            <div className="grid grid-cols-2 gap-3">
              {(["facebook","tiktok","youtube","linkedin","telegram","zalo"] as const).map(k=>(
                <div key={k}><label className={LBL}>{k.charAt(0).toUpperCase()+k.slice(1)}</label>
                  <input className={INP} value={cfg.social[k]} onChange={e=>setCfg({...cfg,social:{...cfg.social,[k]:e.target.value}})}/></div>
              ))}
            </div>
          </div>

          {/* Trusted By */}
          <div className={CARD}>
            <p className={SECT}>Đối tác tin tưởng (mỗi dòng 1 tên)</p>
            <textarea className={`${INP} resize-none`} rows={4}
              value={cfg.trustedBy.join("\n")}
              onChange={e=>setCfg({...cfg,trustedBy:e.target.value.split("\n").filter(Boolean)})}/>
          </div>

          {/* Footer */}
          <div className={CARD}>
            <p className={SECT}>Footer</p>
            <div><label className={LBL}>Tagline footer</label><input className={INP} value={cfg.footer.tagline} onChange={e=>setCfg({...cfg,footer:{tagline:e.target.value}})}/></div>
          </div>

          <button onClick={()=>save("config",data.config)} disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-bold py-3 rounded-xl disabled:opacity-60 transition-colors">
            {saving?<RefreshCw className="w-4 h-4 animate-spin"/>:<Save className="w-4 h-4"/>} Lưu cấu hình
          </button>
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:20,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20}}
            className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold z-50"
            style={{background:toast.type==="ok"?"#10B981":"#EF4444",color:"#fff"}}>
            {toast.type==="ok"?<CheckCircle className="w-4 h-4"/>:<AlertCircle className="w-4 h-4"/>}{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
