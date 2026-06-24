"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, RefreshCw, ExternalLink, AlertCircle, CheckCircle2, Flame, Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  category: string;
  commission: string;
  price: string;
  affiliate_link: string;
  rating: number;
  is_hot: boolean;
  is_active: boolean;
  sort_order: number;
}

const CATEGORIES = ["AI Chat", "AI Writing", "AI Image", "AI Video", "AI Design", "Productivity", "AI Agent", "Khác"];

const EMPTY_FORM: Omit<Product, "id"> = {
  name: "", brand: "", description: "", category: "AI Chat",
  commission: "", price: "", affiliate_link: "", rating: 4.5,
  is_hot: false, is_active: true, sort_order: 0,
};

export default function AdminAffiliatePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getToken = () => localStorage.getItem("monetai_admin_token") ?? "";

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/affiliate", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Lỗi tải dữ liệu"); return; }
      setProducts(data.products ?? []);
    } catch {
      setError("Không thể kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name, brand: p.brand, description: p.description ?? "",
      category: p.category, commission: p.commission, price: p.price,
      affiliate_link: p.affiliate_link, rating: p.rating,
      is_hot: p.is_hot, is_active: p.is_active, sort_order: p.sort_order,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.commission || !form.affiliate_link) {
      showToast("error", "Vui lòng điền đủ: Tên, Thương hiệu, Hoa hồng, Link Affiliate.");
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/admin/affiliate/${editingId}` : "/api/admin/affiliate";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { showToast("error", data.error || "Lỗi lưu dữ liệu"); return; }
      showToast("success", editingId ? "Cập nhật thành công!" : "Thêm sản phẩm thành công!");
      setModalOpen(false);
      fetchProducts();
    } catch {
      showToast("error", "Lỗi kết nối server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xác nhận xóa sản phẩm này?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/affiliate/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) { showToast("error", "Lỗi xóa sản phẩm."); return; }
      showToast("success", "Đã xóa sản phẩm.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      showToast("error", "Lỗi kết nối server.");
    } finally {
      setDeletingId(null);
    }
  };

  const F = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-medium text-[#A0A0B0] mb-1.5">
        {label} {required && <span className="text-[#FF6B00]">*</span>}
      </label>
      {children}
    </div>
  );

  const inputCls = "w-full bg-[#0A0A0F] border border-[#2A2A3A] rounded-xl px-3 py-2.5 text-white text-sm placeholder-[#A0A0B0]/40 focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent outline-none transition-all";

  return (
    <div>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${
              toast.type === "success"
                ? "bg-green-500/15 border border-green-500/30 text-green-400"
                : "bg-red-500/15 border border-red-500/30 text-red-400"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý Affiliate Products</h1>
          <p className="text-[#A0A0B0] text-sm mt-0.5">
            {products.length} sản phẩm · {products.filter((p) => p.is_active).length} đang hoạt động
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            className="p-2 text-[#A0A0B0] hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-red-400 text-sm mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-6 h-6 text-[#FF6B00] animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl p-12 text-center">
          <Package className="w-10 h-10 text-[#A0A0B0] mx-auto mb-3" />
          <p className="text-[#A0A0B0] mb-4">Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!</p>
          <button onClick={openCreate} className="bg-[#FF6B00] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#E55A00] transition-colors">
            + Thêm sản phẩm
          </button>
        </div>
      ) : (
        /* Products table */
        <div className="bg-[#16161F] border border-[#2A2A3A] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A2A3A]">
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Sản phẩm</th>
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Danh mục</th>
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Hoa hồng</th>
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Link Affiliate</th>
                  <th className="text-left text-[#A0A0B0] font-medium px-5 py-3">Trạng thái</th>
                  <th className="text-right text-[#A0A0B0] font-medium px-5 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-[#2A2A3A]/50 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-medium">{p.name}</span>
                            {p.is_hot && <Flame className="w-3.5 h-3.5 text-red-400" />}
                          </div>
                          <span className="text-[#A0A0B0] text-xs">{p.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-[#2A2A3A] text-[#A0A0B0] px-2.5 py-1 rounded-full">{p.category}</span>
                    </td>
                    <td className="px-5 py-4 text-[#FF6B00] font-bold">{p.commission}</td>
                    <td className="px-5 py-4">
                      {p.affiliate_link && p.affiliate_link !== "#" ? (
                        <a
                          href={p.affiliate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors text-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="max-w-[160px] truncate">{p.affiliate_link}</span>
                        </a>
                      ) : (
                        <span className="text-[#A0A0B0] text-xs italic">Chưa có link</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        p.is_active
                          ? "bg-green-500/15 text-green-400"
                          : "bg-gray-500/15 text-gray-400"
                      }`}>
                        {p.is_active ? "Hoạt động" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-[#A0A0B0] hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 rounded-lg transition-all"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="p-1.5 text-[#A0A0B0] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-50"
                          title="Xóa"
                        >
                          {deletingId === p.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create / Edit */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="relative bg-[#16161F] border border-[#2A2A3A] rounded-2xl w-full max-w-xl shadow-2xl"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A2A3A]">
                <h2 className="text-white font-semibold">
                  {editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-[#A0A0B0] hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <F label="Tên sản phẩm" required>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ChatGPT Plus" className={inputCls} />
                  </F>
                  <F label="Thương hiệu" required>
                    <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} placeholder="OpenAI" className={inputCls} />
                  </F>
                </div>

                <F label="Mô tả ngắn">
                  <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="AI chat mạnh nhất thế giới" className={inputCls} />
                </F>

                <div className="grid grid-cols-2 gap-4">
                  <F label="Danh mục">
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </F>
                  <F label="Hoa hồng (%)" required>
                    <input value={form.commission} onChange={(e) => setForm({ ...form, commission: e.target.value })} placeholder="30%" className={inputCls} />
                  </F>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <F label="Giá">
                    <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="20 USD/tháng" className={inputCls} />
                  </F>
                  <F label="Đánh giá (1–5)">
                    <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className={inputCls} />
                  </F>
                </div>

                <F label="Link Affiliate (URL đầy đủ)" required>
                  <input
                    value={form.affiliate_link}
                    onChange={(e) => setForm({ ...form, affiliate_link: e.target.value })}
                    placeholder="https://example.com/ref/your-id"
                    className={inputCls}
                    type="url"
                  />
                  <p className="text-[#A0A0B0] text-xs mt-1.5">Đây là link người dùng sẽ nhận khi bấm "Lấy link".</p>
                </F>

                <div className="grid grid-cols-2 gap-4">
                  <F label="Thứ tự hiển thị">
                    <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} placeholder="0" className={inputCls} />
                  </F>
                  <F label="Trạng thái">
                    <select value={form.is_active ? "1" : "0"} onChange={(e) => setForm({ ...form, is_active: e.target.value === "1" })} className={inputCls}>
                      <option value="1">Hoạt động (hiển thị)</option>
                      <option value="0">Ẩn</option>
                    </select>
                  </F>
                </div>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_hot}
                    onChange={(e) => setForm({ ...form, is_hot: e.target.checked })}
                    className="w-4 h-4 accent-[#FF6B00]"
                  />
                  <span className="text-sm text-[#A0A0B0]">
                    Đánh dấu <span className="text-red-400 font-medium">HOT</span> (hiển thị badge đỏ)
                  </span>
                </label>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2A2A3A]">
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-sm text-[#A0A0B0] hover:text-white px-4 py-2 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
                  {saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm sản phẩm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
