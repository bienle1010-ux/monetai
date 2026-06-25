export interface PromptVar {
  key:         string;
  label:       string;
  placeholder: string;
  required:    boolean;
}

export interface PromptData {
  id:            string;
  name:          string;
  description:   string;
  model:         "ChatGPT-4" | "ChatGPT-3.5" | "Claude" | "Midjourney" | "Gemini";
  category:      string;
  price:         number;
  rating:        number;
  sales:         number;
  seller:        string;
  badge?:        "HOT" | "MỚI" | "BÁN CHẠY";
  tags:          string[];
  preview:       string;
  fullPrompt:    string;
  variables:     PromptVar[];
  outputExample: string;
  instructions:  string;
}

export const PROMPT_CATEGORIES = [
  "Tất cả","Marketing","Design","SEO","Content","Email","Business","Social","CSKH","HR",
];

export const PROMPT_MODELS = [
  "Tất cả","ChatGPT-4","Claude","Midjourney","Gemini",
];

export const prompts: PromptData[] = [
  // ═══════════════════════ MARKETING ═══════════════════════
  {
    id: "tiktok-hooks",
    name: "Viral TikTok Hook Generator",
    description: "Tạo 20 câu hook mở đầu viral cho TikTok, kéo người xem ở lại trong 3 giây đầu tiên.",
    model: "ChatGPT-4",
    category: "Marketing",
    price: 49_000,
    rating: 4.9,
    sales: 1_243,
    seller: "MonetAI Official",
    badge: "BÁN CHẠY",
    tags: ["TikTok","Hook","Viral","Video"],
    preview: "Bạn là chuyên gia viết hook viral cho TikTok với 10 năm kinh nghiệm...\nNhiệm vụ: Tạo 20 câu hook mạnh mẽ...",
    fullPrompt: `Bạn là chuyên gia viết hook viral cho TikTok với 10 năm kinh nghiệm giúp creator đạt hàng triệu views.

Nhiệm vụ: Tạo 20 câu hook mở đầu (opening hook) cho video TikTok về chủ đề: {{chu_de}}
Đối tượng mục tiêu: {{doi_tuong}}
Tone giọng điệu: {{tone}} (ví dụ: vui vẻ, chuyên nghiệp, bí ẩn, gây shock)

Yêu cầu cho mỗi hook:
- Độ dài: 5-15 chữ (đọc trong 2-3 giây)
- Phải tạo ra sự tò mò, cảm xúc hoặc cảm giác cấp bách ngay lập tức
- Kết thúc bằng dấu "..." hoặc câu hỏi kéo người xem tiếp tục

Tạo đủ 20 hook theo các nhóm:
🔥 SHOCK & AWE (5 hook): Tạo sự ngạc nhiên, không thể tin được
❓ TÒ MÒ (5 hook): Đặt câu hỏi khiến người xem phải biết câu trả lời
😱 PAIN POINT (5 hook): Chạm vào nỗi đau/vấn đề của đối tượng
💡 GIẢI PHÁP (5 hook): Hứa hẹn thông tin giá trị ngay lập tức

Format: Đánh số thứ tự, in đậm hook, giải thích ngắn tại sao hook này hoạt động.`,
    variables: [
      { key: "chu_de",    label: "Chủ đề video",     placeholder: "VD: Cách kiếm tiền online, Làm đẹp tại nhà...", required: true },
      { key: "doi_tuong", label: "Đối tượng",         placeholder: "VD: Gen Z 18-25, Mẹ bỉm sữa, Dân văn phòng", required: true },
      { key: "tone",      label: "Giọng điệu",        placeholder: "VD: Vui vẻ, Nghiêm túc, Gây sốc",            required: false },
    ],
    outputExample: "1. **'Tôi mất 3 triệu chỉ vì không biết điều này...'** — Hook pain point, tạo cảm giác hối tiếc ngay lập tức\n2. **'Bí mật mà người giàu không muốn bạn biết'** — Hook tò mò + conspiracy, kích hoạt FOMO",
    instructions: "Copy toàn bộ prompt → Paste vào ChatGPT-4 → Nhận 20 hook ngay lập tức. Chọn 3-5 hook tốt nhất để test A/B trên TikTok.",
  },
  {
    id: "fb-ads-copy",
    name: "Facebook Ads Copy Pro",
    description: "Viết 5 biến thể quảng cáo Facebook chuyển đổi cao theo công thức AIDA + PAS đã kiểm chứng.",
    model: "ChatGPT-4",
    category: "Marketing",
    price: 79_000,
    rating: 4.8,
    sales: 987,
    seller: "MonetAI Official",
    badge: "HOT",
    tags: ["Facebook Ads","Copywriting","AIDA","PAS"],
    preview: "Bạn là copywriter Facebook Ads hàng đầu Việt Nam với track record...\nViết 5 biến thể quảng cáo cho sản phẩm...",
    fullPrompt: `Bạn là copywriter Facebook Ads hàng đầu Việt Nam với track record tạo ra hàng chục chiến dịch ROAS 5x+.

Sản phẩm/Dịch vụ: {{san_pham}}
Giá bán: {{gia_ban}}
Đối tượng mục tiêu: {{doi_tuong}}
Điểm khác biệt chính (USP): {{usp}}
CTA mong muốn: {{cta}} (VD: Mua ngay, Đăng ký, Nhắn tin)

Viết 5 biến thể quảng cáo theo các công thức:

BIẾN THỂ 1 — AIDA (Attention-Interest-Desire-Action):
[Tiêu đề 1 dòng gây chú ý]
[2-3 dòng tạo interest]
[1-2 dòng tạo desire]
[1 dòng CTA mạnh]

BIẾN THỂ 2 — PAS (Problem-Agitate-Solution):
[Nêu vấn đề cụ thể]
[Khuếch đại nỗi đau]
[Giới thiệu giải pháp]
[CTA]

BIẾN THỂ 3 — SOCIAL PROOF HEAVY:
[Dẫn chứng/số liệu thực]
[Testimonial format]
[Offer + CTA]

BIẾN THỂ 4 — CURIOSITY HOOK:
[Hook gây tò mò mạnh]
[Reveal từng bước]
[Bridge to product]
[Urgency CTA]

BIẾN THỂ 5 — STORY-BASED:
[Kể câu chuyện ngắn 3-4 dòng liên quan đến đối tượng]
[Plot twist liên kết sản phẩm]
[CTA tự nhiên]

Mỗi biến thể: Thêm emoji phù hợp, viết tiếng Việt tự nhiên, độ dài 50-150 từ.`,
    variables: [
      { key: "san_pham",  label: "Sản phẩm/Dịch vụ",    placeholder: "VD: Khóa học marketing online",       required: true },
      { key: "gia_ban",   label: "Giá bán",               placeholder: "VD: 990.000₫ (giảm từ 2.000.000₫)", required: true },
      { key: "doi_tuong", label: "Đối tượng",             placeholder: "VD: Phụ nữ 25-40 muốn kiếm thêm",   required: true },
      { key: "usp",       label: "Điểm khác biệt (USP)",  placeholder: "VD: Kết quả trong 30 ngày hoặc hoàn tiền", required: true },
      { key: "cta",       label: "Call to Action",         placeholder: "VD: Đăng ký ngay, Nhắn tin ngay",  required: false },
    ],
    outputExample: "BIẾN THỂ 1 — AIDA:\n🔥 Dừng lại! Bạn đang bỏ lỡ cách kiếm thêm 5 triệu/tháng ngay tại nhà\n👉 Hơn 1.200 học viên MonetAI đã áp dụng phương pháp này...",
    instructions: "Điền thông tin sản phẩm → Copy prompt → Paste vào ChatGPT-4 → Test A/B 5 biến thể trên Facebook Ads Manager.",
  },
  {
    id: "product-launch-kit",
    name: "Product Launch Campaign Kit",
    description: "Bộ copy hoàn chỉnh cho chiến dịch ra mắt sản phẩm: email, social, landing page headline.",
    model: "ChatGPT-4",
    category: "Marketing",
    price: 139_000,
    rating: 4.7,
    sales: 432,
    seller: "MonetAI Official",
    tags: ["Launch","Campaign","Copywriting","Multi-channel"],
    preview: "Bạn là Creative Director của một agency marketing top 10 Việt Nam...\nNhiệm vụ: Tạo toàn bộ copy cho chiến dịch ra mắt...",
    fullPrompt: `Bạn là Creative Director của một agency marketing top 10 Việt Nam, chuyên ra mắt sản phẩm đạt doanh số triệu đô.

Sản phẩm: {{ten_san_pham}}
Mô tả: {{mo_ta}}
Ngày ra mắt: {{ngay_ra_mat}}
Giá bán: {{gia_ban}}
Đối tượng: {{doi_tuong}}
Thông điệp chính: {{thong_diep}}

Tạo BỘ COPY HOÀN CHỈNH:

📧 EMAIL SEQUENCE (3 emails):
Email 1 (7 ngày trước): Teaser + waitlist
Email 2 (ngày ra mắt): Launch announcement + urgency
Email 3 (3 ngày sau): Last chance + social proof

📱 SOCIAL MEDIA:
- 3 caption Instagram (khác nhau về angle)
- 5 tweet/post X ngắn gọn
- 1 LinkedIn announcement professional

🌐 LANDING PAGE:
- Headline chính (dưới 10 chữ)
- 3 subheadline A/B test
- 5 bullet point benefits (formula: [Verb] + [Outcome] + [Timeframe])
- 3 CTA button text options
- 2 guarantee statement

📣 QUẢNG CÁO:
- 3 Facebook/Instagram ad copy ngắn (dưới 125 ký tự)
- 2 Google Ads headline (dưới 30 ký tự)`,
    variables: [
      { key: "ten_san_pham", label: "Tên sản phẩm",   placeholder: "VD: MonetAI Pro",                           required: true },
      { key: "mo_ta",        label: "Mô tả ngắn",      placeholder: "VD: Nền tảng AI giúp kiếm tiền tự động",   required: true },
      { key: "ngay_ra_mat",  label: "Ngày ra mắt",     placeholder: "VD: 15/07/2025",                            required: true },
      { key: "gia_ban",      label: "Giá bán",          placeholder: "VD: 299.000₫/tháng",                       required: true },
      { key: "doi_tuong",    label: "Đối tượng",        placeholder: "VD: Freelancer, content creator VN",       required: true },
      { key: "thong_diep",   label: "Thông điệp chính", placeholder: "VD: AI giúp bạn kiếm tiền khi ngủ",       required: false },
    ],
    outputExample: "HEADLINE: 'AI Kiếm Tiền Cho Bạn'\nSUBHEADLINE: 'Lần đầu tiên tại Việt Nam — nền tảng AI tự động tạo doanh thu 24/7 ngay cả khi bạn ngủ'",
    instructions: "Lý tưởng cho ra mắt sản phẩm mới. Copy prompt → ChatGPT-4 → Nhận bộ copy đầy đủ → Tùy chỉnh chi tiết theo brand voice.",
  },

  // ═══════════════════════ SEO ═══════════════════════
  {
    id: "seo-article-pro",
    name: "SEO Article Writer Pro",
    description: "Tạo bài viết SEO chuẩn 2000+ từ với cấu trúc heading, keyword density và internal link tối ưu.",
    model: "ChatGPT-4",
    category: "SEO",
    price: 99_000,
    rating: 4.8,
    sales: 756,
    seller: "MonetAI Official",
    badge: "BÁN CHẠY",
    tags: ["SEO","Blog","Article","Google"],
    preview: "Bạn là SEO Content Strategist với chuyên môn viết bài chuẩn E-E-A-T của Google...\nViết bài SEO đầy đủ về từ khóa chính...",
    fullPrompt: `Bạn là SEO Content Strategist với chuyên môn viết bài chuẩn E-E-A-T của Google, đã giúp hàng trăm website lên top 1-3.

Từ khóa chính: {{tu_khoa_chinh}}
Từ khóa phụ (LSI): {{tu_khoa_phu}}
Đối tượng đọc: {{doi_tuong}}
Mục đích bài viết: {{muc_dich}} (VD: Informational, Transactional, Navigational)
Thương hiệu/Website: {{thuong_hieu}}

Viết bài SEO HOÀN CHỈNH theo cấu trúc:

[TITLE TAG]: Dưới 60 ký tự, có từ khóa chính ở đầu
[META DESCRIPTION]: 150-160 ký tự, có từ khóa + CTA
[SLUG]: Slug URL tối ưu

# H1: [Tiêu đề chính hấp dẫn, có từ khóa]

## Giới thiệu (100-150 từ):
- Hook ngay câu đầu
- Nêu vấn đề người đọc đang gặp
- Preview nội dung bài

## [H2 - Phần 1] (300-400 từ)
### H3 subsection nếu cần

## [H2 - Phần 2] (300-400 từ)

## [H2 - Phần 3] (300-400 từ)

## [H2 - FAQ Section] (200-300 từ)
Trả lời 5 câu hỏi liên quan theo format schema FAQ

## Kết luận (100-150 từ):
- Tóm tắt điểm chính
- CTA rõ ràng

[SEO CHECKLIST cuối bài]: Keyword density, internal link gợi ý, image alt text gợi ý, schema markup type]`,
    variables: [
      { key: "tu_khoa_chinh", label: "Từ khóa chính",   placeholder: "VD: cách kiếm tiền online 2025",     required: true },
      { key: "tu_khoa_phu",   label: "Từ khóa phụ (LSI)", placeholder: "VD: kiếm tiền tại nhà, làm online", required: false },
      { key: "doi_tuong",     label: "Đối tượng đọc",    placeholder: "VD: Người mới bắt đầu kiếm tiền online", required: true },
      { key: "muc_dich",      label: "Mục đích bài",     placeholder: "VD: Informational (hướng dẫn)",      required: false },
      { key: "thuong_hieu",   label: "Thương hiệu/Website", placeholder: "VD: MonetAI, website.vn",         required: false },
    ],
    outputExample: "TITLE: Cách Kiếm Tiền Online 2025: 15 Cách Đã Kiểm Chứng [Cập Nhật Mới Nhất]\nMETA: Khám phá 15 cách kiếm tiền online thực tế năm 2025 — từ affiliate marketing đến bán AI Agent. Bắt đầu ngay hôm nay!",
    instructions: "Nhập từ khóa → Copy prompt → ChatGPT-4 → Nhận bài hoàn chỉnh → Review và bổ sung thông tin thực tế trước khi đăng.",
  },
  {
    id: "meta-description-pack",
    name: "Meta Description Pack",
    description: "Tạo 10 meta description A/B test cho cùng một trang, tối ưu CTR trên Google.",
    model: "ChatGPT-4",
    category: "SEO",
    price: 49_000,
    rating: 4.6,
    sales: 543,
    seller: "MonetAI Official",
    tags: ["SEO","Meta","CTR","Google"],
    preview: "Bạn là SEO specialist chuyên tối ưu CTR trên Google Search...\nTạo 10 meta description A/B test...",
    fullPrompt: `Bạn là SEO specialist chuyên tối ưu CTR trên Google Search, giúp clients tăng CTR trung bình 40-60%.

Trang/Bài viết: {{ten_trang}}
Từ khóa target: {{tu_khoa}}
URL: {{url}}
Sản phẩm/Dịch vụ chính: {{san_pham}}
Điểm mạnh cần highlight: {{diem_manh}}

Tạo 10 meta description THEO CÁC CHIẾN LƯỢC:

1. BENEFIT-FIRST: Bắt đầu bằng lợi ích lớn nhất
2. NUMBER-DRIVEN: Dùng con số cụ thể
3. QUESTION HOOK: Bắt đầu bằng câu hỏi
4. URGENCY: Tạo cảm giác cấp bách
5. SOCIAL PROOF: Dùng bằng chứng xã hội
6. CURIOSITY GAP: Tạo khoảng hổng tò mò
7. HOW-TO: Hứa hẹn hướng dẫn cụ thể
8. COMPARISON: So sánh với giải pháp cũ
9. PAIN POINT: Bắt đầu từ nỗi đau
10. FEATURE-BENEFIT: Feature → Benefit trực tiếp

Mỗi meta:
- 150-160 ký tự chính xác (đếm kỹ)
- Có từ khóa target tự nhiên
- CTA ở cuối
- Không dùng "Click vào đây"`,
    variables: [
      { key: "ten_trang",  label: "Tên trang/bài viết", placeholder: "VD: Trang dịch vụ SEO, Bài về kiếm tiền", required: true },
      { key: "tu_khoa",    label: "Từ khóa target",     placeholder: "VD: dịch vụ SEO Hà Nội",               required: true },
      { key: "url",        label: "URL trang",           placeholder: "VD: website.vn/dich-vu-seo",           required: false },
      { key: "san_pham",   label: "Sản phẩm/Dịch vụ",  placeholder: "VD: Dịch vụ SEO tổng thể",             required: true },
      { key: "diem_manh",  label: "Điểm mạnh",          placeholder: "VD: 10 năm kinh nghiệm, bảo hành 12 tháng", required: false },
    ],
    outputExample: "1. [BENEFIT-FIRST] Tăng traffic Google ngay tháng đầu với dịch vụ SEO Hà Nội — cam kết top 1-3 hoặc hoàn tiền. Tư vấn miễn phí! (158 ký tự)",
    instructions: "Tạo 10 phiên bản → Test A/B trong Google Search Console → Chọn version CTR cao nhất sau 30 ngày.",
  },
  {
    id: "keyword-brief",
    name: "Keyword Research Brief",
    description: "Phân tích và nhóm từ khóa thành clusters, xác định search intent và content plan.",
    model: "ChatGPT-4",
    category: "SEO",
    price: 79_000,
    rating: 4.7,
    sales: 398,
    seller: "MonetAI Official",
    tags: ["Keywords","Cluster","Intent","Content Plan"],
    preview: "Bạn là SEO Research Specialist, chuyên phân tích từ khóa và xây dựng keyword strategy...",
    fullPrompt: `Bạn là SEO Research Specialist, chuyên phân tích từ khóa và xây dựng keyword strategy cho các dự án SEO triệu đô.

Chủ đề website/niche: {{niche}}
Danh sách từ khóa cần phân tích (mỗi từ một dòng):
{{danh_sach_tu_khoa}}
Thị trường mục tiêu: {{thi_truong}}
Mức cạnh tranh có thể xử lý: {{muc_canh_tranh}} (thấp/trung bình/cao)

Phân tích và cung cấp:

1. KEYWORD CLUSTERING (nhóm theo topic/pillar):
Format bảng: | Cluster | Từ khóa | Search Intent | Volume ước tính | Độ khó |

2. PILLAR & CLUSTER STRATEGY:
- 3-5 Pillar topic chính
- Mỗi pillar: 5-10 cluster keywords
- Internal link structure đề xuất

3. SEARCH INTENT MAPPING:
Phân loại từng từ khóa: Informational / Navigational / Transactional / Commercial

4. CONTENT CALENDAR (12 tuần):
Tuần 1-4: Pillar content
Tuần 5-8: Cluster content
Tuần 9-12: Supporting content + linkbuilding

5. QUICK WIN OPPORTUNITIES:
Từ khóa có thể lên top nhanh (dưới 3 tháng)`,
    variables: [
      { key: "niche",               label: "Chủ đề/Niche",         placeholder: "VD: AI tools, Sức khỏe phụ nữ",       required: true },
      { key: "danh_sach_tu_khoa",   label: "Danh sách từ khóa",    placeholder: "Mỗi từ khóa một dòng, tối đa 20 từ",  required: true },
      { key: "thi_truong",          label: "Thị trường",            placeholder: "VD: Việt Nam, Đông Nam Á",            required: true },
      { key: "muc_canh_tranh",      label: "Mức cạnh tranh",        placeholder: "thấp / trung bình / cao",             required: false },
    ],
    outputExample: "CLUSTER 1: AI Tools\n→ Pillar: 'AI tools tốt nhất 2025' (Informational, Volume: ~3.2k)\n→ Clusters: 'chatgpt vs claude' | 'midjourney review' | 'ai viết content'",
    instructions: "Nhập danh sách từ khóa → Chạy ChatGPT-4 → Export kết quả → Dùng làm base cho content strategy.",
  },

  // ═══════════════════════ BUSINESS ═══════════════════════
  {
    id: "business-plan",
    name: "Business Plan Generator",
    description: "Kế hoạch kinh doanh chi tiết 20 trang chuẩn format investor, bao gồm financial projection.",
    model: "Claude",
    category: "Business",
    price: 149_000,
    rating: 4.6,
    sales: 423,
    seller: "MonetAI Official",
    badge: "MỚI",
    tags: ["Business Plan","Startup","Investor","Finance"],
    preview: "Bạn là Business Consultant hàng đầu với MBA từ INSEAD, đã tư vấn cho 200+ startup...",
    fullPrompt: `Bạn là Business Consultant hàng đầu với MBA từ INSEAD, đã tư vấn cho 200+ startup Đông Nam Á thành công gọi vốn.

Ý tưởng kinh doanh: {{y_tuong}}
Ngành nghề: {{nganh_nghe}}
Thị trường mục tiêu: {{thi_truong}}
Số vốn ban đầu: {{von_ban_dau}}
Tên công ty/dự án: {{ten_cong_ty}}
Giai đoạn: {{giai_doan}} (Idea / MVP / Growth)

Tạo BUSINESS PLAN CHUYÊN NGHIỆP gồm:

## 1. EXECUTIVE SUMMARY (1 trang)
- Tóm tắt business trong 200 từ
- Key metrics và milestones

## 2. PROBLEM & SOLUTION
- Vấn đề thị trường (data-backed)
- Giải pháp của bạn
- Why now? Tại sao thời điểm này?

## 3. MARKET ANALYSIS
- TAM / SAM / SOM calculation
- Competitive landscape (bảng so sánh)
- Positioning strategy

## 4. PRODUCT/SERVICE
- Core features và roadmap 12 tháng
- Tech stack hoặc delivery model
- IP và competitive moat

## 5. BUSINESS MODEL & REVENUE STREAMS
- Cách kiếm tiền (revenue model)
- Unit economics (CAC, LTV, margins)
- Pricing strategy

## 6. GO-TO-MARKET STRATEGY
- Launch phases
- Marketing & sales channels
- Partnership strategy

## 7. FINANCIAL PROJECTIONS (3 năm)
Bảng: Revenue / Cost / Profit cho Năm 1, 2, 3
Break-even analysis

## 8. TEAM & EXECUTION
- Key roles cần tuyển
- Advisory board đề xuất

## 9. FUNDING REQUIREMENTS
- Số tiền cần gọi vốn
- Use of funds (breakdown %)
- Investor return potential`,
    variables: [
      { key: "y_tuong",     label: "Ý tưởng kinh doanh",  placeholder: "VD: Nền tảng AI giúp SME quản lý kho tự động", required: true },
      { key: "nganh_nghe",  label: "Ngành nghề",           placeholder: "VD: SaaS, E-commerce, Fintech, Edutech",       required: true },
      { key: "thi_truong",  label: "Thị trường mục tiêu",  placeholder: "VD: SME Việt Nam 5-50 nhân viên",              required: true },
      { key: "von_ban_dau", label: "Vốn ban đầu",          placeholder: "VD: 500 triệu VNĐ",                            required: true },
      { key: "ten_cong_ty", label: "Tên công ty/Dự án",    placeholder: "VD: StockAI Vietnam",                          required: true },
      { key: "giai_doan",   label: "Giai đoạn",            placeholder: "Idea / MVP / Growth",                          required: false },
    ],
    outputExample: "TAM: Thị trường quản lý kho VN ~$2.3B/năm\nSAM: SME phân khúc 5-50 nhân viên ~$380M\nSOM (Year 3): 2% market share = $7.6M ARR",
    instructions: "Điền thông tin → Claude sẽ tạo business plan đầy đủ → Review kỹ phần financial projection → Tùy chỉnh số liệu thực tế.",
  },
  {
    id: "investor-pitch",
    name: "Investor Pitch Script",
    description: "Kịch bản pitch 10 phút thuyết phục nhà đầu tư theo framework được các VC top tier ưa thích.",
    model: "Claude",
    category: "Business",
    price: 199_000,
    rating: 4.8,
    sales: 287,
    seller: "MonetAI Official",
    badge: "HOT",
    tags: ["Pitch","Investor","VC","Startup","Funding"],
    preview: "Bạn là cựu Partner của một quỹ VC top 10 Đông Nam Á, đã đánh giá 3000+ pitch deck...",
    fullPrompt: `Bạn là cựu Partner của một quỹ VC top 10 Đông Nam Á, đã đánh giá 3000+ pitch deck và đầu tư vào 50+ startup tỷ đô.

Startup: {{ten_startup}}
Lĩnh vực: {{linh_vuc}}
Tình trạng hiện tại: {{tinh_trang}} (Traction, revenue, users)
Số tiền gọi vốn: {{so_tien}}
Loại nhà đầu tư: {{loai_ndt}} (Angel / Seed / Series A)
Founder background: {{founder_bg}}

Viết PITCH SCRIPT 10 PHÚT (khoảng 1,200-1,500 từ nói):

[PHÚT 0-1] THE HOOK:
Mở đầu bằng 1 câu chuyện/fact gây ấn tượng mạnh. Không bắt đầu bằng "Xin chào, tôi là..."

[PHÚT 1-2] THE PROBLEM:
- Vấn đề lớn, data thực tế, tạo cảm xúc
- "Ai trong phòng đã từng gặp vấn đề này?"

[PHÚT 2-3] THE SOLUTION:
- Demo hoặc mô tả trực quan
- "Aha moment" trong 1 câu

[PHÚT 3-5] TRACTION & VALIDATION:
- Metrics quan trọng nhất
- Customer quotes/logos
- Growth rate

[PHÚT 5-6] MARKET OPPORTUNITY:
- Market size với số liệu thuyết phục
- "Timing is right because..."

[PHÚT 6-7] BUSINESS MODEL:
- Revenue streams rõ ràng
- Unit economics compelling

[PHÚT 7-8] COMPETITION & MOAT:
- Differentiation không phải "Chúng tôi không có đối thủ"
- Defensible advantages

[PHÚT 8-9] THE TEAM:
- Why this team? Unfair advantages
- Advisors và credibility signals

[PHÚT 9-10] THE ASK:
- Số tiền + Use of funds (% breakdown)
- Milestones đạt được với số tiền này
- ROI tiềm năng cho investor
- Kết thúc bằng vision mạnh mẽ

[SLIDE NOTES]: Ghi chú cho từng slide tương ứng`,
    variables: [
      { key: "ten_startup", label: "Tên Startup",         placeholder: "VD: MonetAI",                               required: true },
      { key: "linh_vuc",    label: "Lĩnh vực",            placeholder: "VD: AI Commerce SaaS",                      required: true },
      { key: "tinh_trang",  label: "Traction hiện tại",   placeholder: "VD: 500 users, $5k MRR, 20% MoM growth",    required: true },
      { key: "so_tien",     label: "Gọi vốn",             placeholder: "VD: $500,000 Seed Round",                   required: true },
      { key: "loai_ndt",    label: "Loại nhà đầu tư",     placeholder: "Angel / Seed / Series A",                   required: true },
      { key: "founder_bg",  label: "Founder background",  placeholder: "VD: 5 năm Amazon, ex-Shopee Product Lead",  required: false },
    ],
    outputExample: "[PHÚT 0-1] HOOK: 'Năm ngoái, 73% SME Việt Nam nói rằng họ mất trung bình 3 giờ mỗi ngày chỉ để... quản lý kho hàng bằng Excel. Tôi là một trong số đó — cho đến khi tôi xây dựng StockAI.'",
    instructions: "Dùng Claude → Nhận kịch bản hoàn chỉnh → Luyện tập với timer → Tùy chỉnh cho từng meeting cụ thể.",
  },
  {
    id: "swot-analysis",
    name: "SWOT Analysis Pro",
    description: "Phân tích SWOT chuyên sâu với chiến lược SO/ST/WO/WT và action plan cụ thể.",
    model: "Claude",
    category: "Business",
    price: 99_000,
    rating: 4.7,
    sales: 312,
    seller: "MonetAI Official",
    tags: ["SWOT","Strategy","Analysis","Planning"],
    preview: "Bạn là Strategy Consultant McKinsey với 15 năm kinh nghiệm phân tích doanh nghiệp...",
    fullPrompt: `Bạn là Strategy Consultant McKinsey với 15 năm kinh nghiệm phân tích doanh nghiệp và xây dựng chiến lược tăng trưởng.

Doanh nghiệp/Dự án: {{ten_doanh_nghiep}}
Ngành: {{nganh}}
Quy mô: {{quy_mo}}
Giai đoạn: {{giai_doan}}
Bối cảnh cần phân tích: {{boi_canh}}

Thực hiện PHÂN TÍCH SWOT CHUYÊN SÂU:

## STRENGTHS (Điểm mạnh)
Liệt kê 8-10 điểm mạnh cụ thể với:
- Bằng chứng/số liệu minh chứng
- Mức độ bền vững (cao/trung bình/thấp)

## WEAKNESSES (Điểm yếu)
Liệt kê 6-8 điểm yếu trung thực với:
- Root cause analysis
- Mức độ ảnh hưởng đến business

## OPPORTUNITIES (Cơ hội)
Liệt kê 6-8 cơ hội với:
- Market data support
- Timeline để tận dụng
- Required resources

## THREATS (Thách thức)
Liệt kê 6-8 thách thức với:
- Probability (cao/trung bình/thấp)
- Impact level
- Early warning signals

## TOWS MATRIX (CHIẾN LƯỢC):
SO Strategies (Dùng S để tận dụng O): 3 chiến lược cụ thể
ST Strategies (Dùng S để đối phó T): 3 chiến lược cụ thể
WO Strategies (Khắc phục W để nắm O): 3 chiến lược cụ thể
WT Strategies (Giảm thiểu W + T): 3 chiến lược cụ thể

## ACTION PLAN (90 ngày):
Priority matrix: Impact vs Effort
Top 5 actions ngay lập tức với owner + deadline`,
    variables: [
      { key: "ten_doanh_nghiep", label: "Doanh nghiệp/Dự án", placeholder: "VD: Chuỗi cà phê ABC",              required: true },
      { key: "nganh",            label: "Ngành",               placeholder: "VD: F&B, Retail, SaaS",            required: true },
      { key: "quy_mo",           label: "Quy mô",              placeholder: "VD: 5 cửa hàng, 30 nhân viên",     required: true },
      { key: "giai_doan",        label: "Giai đoạn",           placeholder: "VD: Chuẩn bị mở rộng ra TP khác", required: false },
      { key: "boi_canh",         label: "Bối cảnh cụ thể",     placeholder: "VD: Quyết định có nên nhượng quyền không", required: false },
    ],
    outputExample: "SO STRATEGY 1: Tận dụng brand recognition (S1) + xu hướng work café (O3) → Ra mắt gói 'Workspace membership' 1.5tr/tháng, unlimited coffee — target remote workers",
    instructions: "Phù hợp cho strategic planning, quarterly review, trước khi ra quyết định lớn. Claude cho kết quả phân tích sâu hơn GPT-4.",
  },

  // ═══════════════════════ CONTENT ═══════════════════════
  {
    id: "youtube-script",
    name: "YouTube Video Script Generator",
    description: "Kịch bản video YouTube đầy đủ theo framework Hook-Edu-CTA, tối ưu watch time và engagement.",
    model: "Claude",
    category: "Content",
    price: 89_000,
    rating: 4.8,
    sales: 634,
    seller: "MonetAI Official",
    badge: "BÁN CHẠY",
    tags: ["YouTube","Script","Video","Content"],
    preview: "Bạn là YouTube Content Strategist đã giúp 50+ channel đạt 100k+ subscribers...",
    fullPrompt: `Bạn là YouTube Content Strategist đã giúp 50+ channel đạt 100k+ subscribers với average watch time trên 65%.

Chủ đề video: {{chu_de}}
Channel name/Niche: {{channel}}
Đối tượng xem: {{doi_tuong}}
Độ dài video mục tiêu: {{do_dai}} phút
Tone: {{tone}} (VD: giáo dục, giải trí, động lực, tutorial)
CTA mục tiêu: {{cta}} (VD: Subscribe, Link trong mô tả, Mua sản phẩm)

Viết KỊCH BẢN VIDEO HOÀN CHỈNH:

[TIÊU ĐỀ OPTIONS] (3 options A/B/C)
[THUMBNAIL CONCEPT] (Mô tả thumbnail ý tưởng)

---

[0:00-0:30] COLD OPEN / HOOK:
(Không giới thiệu bản thân — đi thẳng vào điểm gây sốc/tò mò nhất)
[Ghi chú đạo diễn: camera angle, B-roll gợi ý]

[0:30-1:30] PROBLEM SETUP:
(Establish pain point hoặc desire của viewer)

[1:30-2:00] PATTERN INTERRUPT + INTRO:
"Trong video này, bạn sẽ học được..."
(Tạo open loops)

[2:00 - {{do_dai}}:00 trừ 2 phút cuối] MAIN CONTENT:
Chia thành các SEGMENTS rõ ràng với:
- Segment title (dùng làm chapter)
- Nội dung chi tiết từng đoạn
- Transition phrase
- B-roll/visual gợi ý trong ngoặc []

[Phút cuối-0:30] OUTRO + CTA:
(Summary → Value reminder → CTA cụ thể)

---

[DESCRIPTION TEMPLATE] (SEO-optimized, 200 từ)
[TAGS GỢI Ý] (30 tags)
[CHAPTER TIMESTAMPS]`,
    variables: [
      { key: "chu_de",   label: "Chủ đề video",    placeholder: "VD: Cách dùng ChatGPT kiếm tiền",        required: true },
      { key: "channel",  label: "Channel/Niche",    placeholder: "VD: MonetAI - Kiếm tiền với AI",          required: true },
      { key: "doi_tuong", label: "Đối tượng",       placeholder: "VD: Người mới 22-35, chưa biết AI",       required: true },
      { key: "do_dai",   label: "Độ dài (phút)",    placeholder: "VD: 10",                                  required: true },
      { key: "tone",     label: "Tone",             placeholder: "VD: Giáo dục, thân thiện, hài hước nhẹ", required: false },
      { key: "cta",      label: "CTA mục tiêu",     placeholder: "VD: Subscribe + link khóa học",           required: false },
    ],
    outputExample: "[0:00-0:30] COLD OPEN: 'Tôi vừa kiếm được 15 triệu trong 3 ngày không cần rời khỏi nhà — và tôi sắp chỉ cho bạn CHÍNH XÁC cách tôi làm điều đó.' [B-roll: màn hình laptop, Stripe dashboard]",
    instructions: "Claude đặc biệt giỏi viết kịch bản dài mạch lạc. Sau khi nhận kịch bản, tùy chỉnh giọng nói của bạn và thêm ví dụ cá nhân.",
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Authority Post",
    description: "Bài đăng LinkedIn thought leadership 800-1200 từ, xây dựng uy tín và thu hút khách hàng B2B.",
    model: "Claude",
    category: "Social",
    price: 59_000,
    rating: 4.7,
    sales: 521,
    seller: "MonetAI Official",
    tags: ["LinkedIn","B2B","Thought Leadership","Personal Brand"],
    preview: "Bạn là LinkedIn Content Strategist chuyên giúp C-level executives xây dựng personal brand...",
    fullPrompt: `Bạn là LinkedIn Content Strategist chuyên giúp C-level executives và startup founders xây dựng personal brand với 100k+ followers.

Chủ đề/Bài học muốn chia sẻ: {{chu_de}}
Câu chuyện cá nhân liên quan: {{cau_chuyen}}
Ngành nghề của bạn: {{nganh_nghe}}
Đối tượng LinkedIn: {{doi_tuong}} (VD: CEO, Marketing Manager, HR)
Số liệu/kết quả muốn highlight: {{so_lieu}}
CTA: {{cta}}

Viết BÀI LINKEDIN THEO FORMAT VIRAL:

[HOOK LINE - 1 câu]:
(Câu đầu tiên phải cực mạnh — người đọc chỉ thấy 2 dòng trước "...more")

[BLANK LINE]

[PARAGRAPH 1 - The Story/Hook Expand]:
(Kể câu chuyện ngắn, relatable, tạo emotional connection)

[BLANK LINE]

[PARAGRAPH 2 - The Contrast/Problem]:
(Điều gì đã thay đổi? Moment nhận ra insight)

[BLANK LINE]

[THE LESSON - Numbered list 5-7 điểm]:
Đây là những gì tôi học được:

1. [Point với ví dụ cụ thể]
2. [Point với ví dụ cụ thể]
...

[BLANK LINE]

[PARAGRAPH 3 - Results/Proof]:
(Kết quả cụ thể sau khi áp dụng — số liệu nếu có)

[BLANK LINE]

[CLOSING - Vulnerability/Human moment]:
(Kết bằng điều gì đó authentic, không quá perfect)

[BLANK LINE]

[CTA - Question]:
(Đặt câu hỏi mời comment)

---
📌 Lưu bài này nếu bạn thấy hữu ích.`,
    variables: [
      { key: "chu_de",      label: "Chủ đề/Insight",    placeholder: "VD: 3 sai lầm khi scale startup",        required: true },
      { key: "cau_chuyen",  label: "Câu chuyện cá nhân", placeholder: "VD: Tôi từng thất bại lần 1 vì...",      required: true },
      { key: "nganh_nghe",  label: "Ngành nghề",          placeholder: "VD: SaaS, Marketing, E-commerce",        required: true },
      { key: "doi_tuong",   label: "Đối tượng",           placeholder: "VD: Startup founder, Marketing director", required: false },
      { key: "so_lieu",     label: "Số liệu/Kết quả",    placeholder: "VD: Tăng revenue 3x trong 6 tháng",      required: false },
      { key: "cta",         label: "CTA",                 placeholder: "VD: DM mình nếu bạn muốn tư vấn free",   required: false },
    ],
    outputExample: "Tôi mất 200 triệu đồng vì không biết điều này khi ra mắt sản phẩm đầu tiên.\n\n[BLANK]\n\nNăm 2021, tôi build sản phẩm trong 8 tháng mà không nói chuyện với 1 khách hàng nào...",
    instructions: "Đăng vào 7-9h sáng thứ 3-5. Engage với 10-15 comment trong 1 giờ đầu để boost algorithm. Claude viết tự nhiên, ít giống AI hơn GPT-4.",
  },
  {
    id: "blog-post-blueprint",
    name: "Blog Post Blueprint",
    description: "Framework bài blog hoàn chỉnh 1500+ từ với storytelling, examples và CTA tự nhiên.",
    model: "ChatGPT-4",
    category: "Content",
    price: 69_000,
    rating: 4.6,
    sales: 389,
    seller: "MonetAI Official",
    tags: ["Blog","Content","Storytelling","Writing"],
    preview: "Bạn là Content Strategist của một media publication với 2 triệu readers/tháng...",
    fullPrompt: `Bạn là Content Strategist của một media publication với 2 triệu readers/tháng, chuyên viết bài blog vừa SEO vừa extremely readable.

Chủ đề: {{chu_de}}
Góc độ tiếp cận: {{goc_do}} (VD: How-to, List, Opinion, Case study, Story-driven)
Đối tượng: {{doi_tuong}}
Từ khóa SEO (nếu có): {{tu_khoa}}
Thương hiệu/Tác giả: {{tac_gia}}
Kết quả muốn người đọc đạt được: {{ket_qua}}

Viết BÀI BLOG HOÀN CHỈNH:

[HEADLINE OPTIONS] (5 options với formula khác nhau):
- How-to: "Cách [Outcome] Trong [Timeframe]"
- Number: "[X] Cách/Bước/Bí quyết Để [Outcome]"
- Question: "Tại Sao [Problem]? (Và Cách Fix Ngay)"
- Curiosity: "[Surprising Fact] Về [Topic]"
- Story: "Tôi Đã [Achievement] Và Đây Là Cách Tôi Làm"

[INTRO - 150-200 từ]:
Bắt đầu bằng story/fact/question gây sốc → Bridge to topic

[BODY - 1000-1200 từ]:
Chia thành 4-6 sections với H2 heading
Mỗi section: Point → Explanation → Example/Story → Takeaway

[TRANSITION PHRASES] (dùng để connect paragraphs):
Liệt kê 10 câu chuyển tiếp tự nhiên

[CONCLUSION - 100-150 từ]:
Summary → Motivation → CTA tự nhiên

[AUTHOR BIO]:
2-3 câu professional bio với social proof

[INTERNAL LINK SUGGESTIONS]:
5 topics liên quan để link internally`,
    variables: [
      { key: "chu_de",    label: "Chủ đề",             placeholder: "VD: Cách dùng AI để tăng doanh thu",     required: true },
      { key: "goc_do",    label: "Góc độ tiếp cận",    placeholder: "VD: How-to, List, Case study",            required: true },
      { key: "doi_tuong", label: "Đối tượng đọc",      placeholder: "VD: SME owner muốn ứng dụng AI",          required: true },
      { key: "tu_khoa",   label: "Từ khóa SEO",        placeholder: "VD: AI tăng doanh thu",                   required: false },
      { key: "tac_gia",   label: "Tác giả/Brand",      placeholder: "VD: MonetAI Blog",                        required: false },
      { key: "ket_qua",   label: "Kết quả người đọc",  placeholder: "VD: Biết cách dùng AI tool tiết kiệm 2h/ngày", required: false },
    ],
    outputExample: "HEADLINE: 'Tôi Thay Thế 3 Nhân Viên Bằng AI Và Đây Là Những Gì Xảy Ra Sau 6 Tháng'\nINTRO: 'Tháng 3 năm ngoái, tôi sa thải 3 người. Không phải vì họ làm sai — mà vì một cái tool giá 500k/tháng làm tốt hơn họ...'",
    instructions: "Sau khi có bản draft → Thêm số liệu thực tế của bạn → Add ảnh minh họa → Optimize thêm 1 lần với SEO tool.",
  },

  // ═══════════════════════ EMAIL ═══════════════════════
  {
    id: "email-sequence",
    name: "Email Nurture Sequence (7 Emails)",
    description: "Chuỗi 7 email nurturing tự động convert lead thành khách hàng theo hành trình customer.",
    model: "ChatGPT-4",
    category: "Email",
    price: 119_000,
    rating: 4.8,
    sales: 534,
    seller: "MonetAI Official",
    badge: "BÁN CHẠY",
    tags: ["Email Marketing","Automation","Nurture","Sales Funnel"],
    preview: "Bạn là Email Marketing Specialist với track record 45%+ open rate...\nTạo chuỗi 7 email nurturing...",
    fullPrompt: `Bạn là Email Marketing Specialist với track record 45%+ open rate và 12%+ click rate cho các chiến dịch B2C/B2B.

Sản phẩm/Dịch vụ: {{san_pham}}
Giá bán: {{gia_ban}}
Lead magnet đã dùng để thu email: {{lead_magnet}}
Đối tượng nhận email: {{doi_tuong}}
Thời gian sequence: 14 ngày (email cách nhau 2-3 ngày)
Brand voice: {{brand_voice}}

Viết CHUỖI 7 EMAIL HOÀN CHỈNH:

EMAIL 1 (Ngày 0 — Ngay sau đăng ký):
Subject: [5 options A/B test]
Preview text:
Body: Welcome + Deliver lead magnet + Expectation setting
CTA: [Primary] / [Secondary]
P.S.: [Hook cho email 2]

EMAIL 2 (Ngày 2 — Education):
Subject:
Body: Dạy 1 quick win cụ thể liên quan đến sản phẩm
CTA: [Soft — blog/resource]

EMAIL 3 (Ngày 4 — Story/Social Proof):
Subject:
Body: Câu chuyện khách hàng thực tế + results
CTA: [Medium — learn more về sản phẩm]

EMAIL 4 (Ngày 6 — Pain Agitate):
Subject:
Body: Đào sâu vào vấn đề họ đang gặp + tại sao không tự giải quyết được
CTA: [Medium — case study]

EMAIL 5 (Ngày 9 — The Offer Intro):
Subject:
Body: Giới thiệu solution nhẹ nhàng + gửi social proof mạnh
CTA: [Strong — sales page]

EMAIL 6 (Ngày 11 — Objection Handling):
Subject:
Body: Xử lý 3-5 objection phổ biến nhất
CTA: [Strong — FAQ + sales page]

EMAIL 7 (Ngày 14 — Last Chance):
Subject: Urgency thật sự (closing window/bonus expire)
Body: Final push với fear of missing out
CTA: [Very Strong — direct buy link]

---
[DELIVERABILITY TIPS]: SPF/DKIM setup, best send times, unsubscribe hygiene`,
    variables: [
      { key: "san_pham",    label: "Sản phẩm/Dịch vụ", placeholder: "VD: Khóa học AI Marketing",           required: true },
      { key: "gia_ban",     label: "Giá bán",           placeholder: "VD: 2.990.000₫",                     required: true },
      { key: "lead_magnet", label: "Lead magnet",       placeholder: "VD: Ebook 20 Prompt ChatGPT miễn phí", required: true },
      { key: "doi_tuong",   label: "Đối tượng",         placeholder: "VD: SME owner muốn dùng AI marketing",required: true },
      { key: "brand_voice", label: "Brand voice",       placeholder: "VD: Thân thiện, chuyên nghiệp, không spam", required: false },
    ],
    outputExample: "EMAIL 1 SUBJECT OPTIONS:\nA) Ebook của bạn đây — và 1 điều tôi muốn nói thêm\nB) [Tên], đây là những gì xảy ra tiếp theo\nC) Chào mừng! (+ một bất ngờ nhỏ bên trong)",
    instructions: "Cài vào Mailchimp/GetResponse/SendGrid → Setup automation triggers → Monitor open rate email 1 để tối ưu subject line.",
  },
  {
    id: "cold-email",
    name: "Cold Email Outreach Pro",
    description: "Email tiếp cận lạnh cá nhân hóa cao, reply rate 15-25% theo framework Lemlist & Woodpecker.",
    model: "ChatGPT-4",
    category: "Email",
    price: 79_000,
    rating: 4.7,
    sales: 289,
    seller: "MonetAI Official",
    tags: ["Cold Email","B2B","Outreach","Sales"],
    preview: "Bạn là Sales Development Representative top performer với reply rate 22% cold email...",
    fullPrompt: `Bạn là Sales Development Representative top performer với reply rate 22% cold email, đã book 500+ demo meetings cho SaaS B2B.

Sản phẩm/Dịch vụ bán: {{san_pham}}
Đối tượng nhận email: {{doi_tuong}} (Job title + Company type)
Value proposition chính: {{value_prop}}
Social proof: {{social_proof}}
Mục tiêu của email: {{muc_tieu}} (VD: Book meeting 15', Demo, Tải tài liệu)
Cá nhân hóa (nếu có): {{ca_nhan_hoa}}

Viết 5 COLD EMAIL TEMPLATES:

TEMPLATE 1 — THE QUICK WIN:
Subject: [Dưới 6 chữ, không hỏi]
Body: 3-4 dòng. Offer specific value ngay đầu. No fluff.
CTA: Một câu hỏi có/không đơn giản.

TEMPLATE 2 — THE PROBLEM-SOLVER:
Subject:
Body: Nêu problem specific của industry → tease solution → CTA nhẹ.

TEMPLATE 3 — THE SOCIAL PROOF:
Subject:
Body: "[Competitor/Similar company] dùng chúng tôi để [result]" → Bridge

TEMPLATE 4 — THE REFERRAL:
Subject: "{{ten_nguoi_gioi_thieu}} gợi ý tôi liên hệ"
Body: Reference + Quick pitch + Easy CTA

TEMPLATE 5 — THE VIDEO/LOOM:
Subject:
Body: "Tôi vừa record 2-phút video dành riêng cho [Company]..."

---
[FOLLOW-UP SEQUENCE] (3 follow-up emails, spacing 3-5 ngày):
Follow-up 1: Bump email (1 câu)
Follow-up 2: New angle/value add
Follow-up 3: Break-up email (permission to close)

[PERSONALIZATION SNIPPETS]: 10 template {{cá nhân hóa}} có thể dùng`,
    variables: [
      { key: "san_pham",       label: "Sản phẩm/DV",       placeholder: "VD: Phần mềm quản lý nhân sự AI",        required: true },
      { key: "doi_tuong",      label: "Đối tượng",          placeholder: "VD: HR Director, công ty 50-200 nhân viên", required: true },
      { key: "value_prop",     label: "Giá trị cốt lõi",   placeholder: "VD: Giảm 80% thời gian xử lý payroll",    required: true },
      { key: "social_proof",   label: "Social proof",       placeholder: "VD: 200 công ty Việt Nam đang dùng",       required: false },
      { key: "muc_tieu",       label: "Mục tiêu email",     placeholder: "VD: Book 15' demo call",                  required: true },
      { key: "ca_nhan_hoa",    label: "Thông tin cá nhân",  placeholder: "VD: Tên, tên công ty, recent post của họ", required: false },
    ],
    outputExample: "TEMPLATE 1:\nSubject: HR tốn 4h/tuần cho payroll?\nBody: Hi {{Tên}}, phần lớn HR tôi nói chuyện ở {{ngành}} mất 3-4 tiếng mỗi tuần chỉ để xử lý bảng lương.\n\nChúng tôi giúp {{Tên công ty}} làm điều này trong 20 phút — tự động.\n\n{{Social proof ngắn}}\n\nĐáng thử 15' không ạ?",
    instructions: "A/B test subject line trước tiên (2 versions, mỗi version 50 email) → Chọn winner → Scale. Luôn personalize {{tên}} và {{tên công ty}}.",
  },
  {
    id: "newsletter-template",
    name: "Newsletter Template Builder",
    description: "Cấu trúc newsletter tuần/tháng hoàn chỉnh — tăng open rate, giảm unsubscribe.",
    model: "Claude",
    category: "Email",
    price: 89_000,
    rating: 4.6,
    sales: 198,
    seller: "MonetAI Official",
    tags: ["Newsletter","Email","Retention","Community"],
    preview: "Bạn là Newsletter Strategist đã giúp 30+ creator xây dựng newsletter 10k+ subscribers...",
    fullPrompt: `Bạn là Newsletter Strategist đã giúp 30+ creator xây dựng newsletter 10k+ subscribers với open rate 40-55%.

Tên newsletter: {{ten_newsletter}}
Tần suất: {{tan_suat}} (hàng tuần/2 tuần/hàng tháng)
Chủ đề/Niche: {{chu_de}}
Đối tượng: {{doi_tuong}}
Tone: {{tone}}
Nguồn monetization: {{monetization}} (VD: Sponsor, Sản phẩm, Affiliate)

Tạo NEWSLETTER TEMPLATE HOÀN CHỈNH:

📧 SUBJECT LINE FORMULA:
- Công thức bạn sẽ dùng mỗi lần
- 5 ví dụ mẫu
- Split test gợi ý

📐 STRUCTURE (lặp lại mỗi số):

[SECTION 1 — OPENER (100-150 từ)]:
Hook cá nhân → Bridge to this week's theme

[SECTION 2 — MAIN STORY/INSIGHT (300-400 từ)]:
Deep dive into 1 big idea
Format: Problem → Insight → Application → Example

[SECTION 3 — QUICK HITS (100-150 từ)]:
3-5 bullet points: Tools/Tips/Links ngắn gọn

[SECTION 4 — FEATURE/SPOTLIGHT]:
Tùy week: Interview snippet / Product review / Reader spotlight

[SECTION 5 — SPONSOR SLOT]:
Template native ad không làm mất trust

[SECTION 6 — CTA / COMMUNITY (50-80 từ)]:
Question for replies + Forward/Share ask

[FOOTER STANDARD]:
Unsubscribe, profile update, social links

---
EDITORIAL CALENDAR (8 tuần):
8 chủ đề newsletter + angle cụ thể

GROWTH HACKS:
5 cách tăng subscriber với effort thấp`,
    variables: [
      { key: "ten_newsletter", label: "Tên Newsletter",  placeholder: "VD: AI Weekly Vietnam",             required: true },
      { key: "tan_suat",       label: "Tần suất",        placeholder: "VD: Hàng tuần, thứ 5",              required: true },
      { key: "chu_de",         label: "Chủ đề/Niche",    placeholder: "VD: AI tools, Marketing, Startup",   required: true },
      { key: "doi_tuong",      label: "Đối tượng",        placeholder: "VD: Marketer, Startup founder VN",  required: true },
      { key: "tone",           label: "Tone giọng điệu", placeholder: "VD: Chill, chuyên gia, hài hước nhẹ", required: false },
      { key: "monetization",   label: "Cách kiếm tiền",  placeholder: "VD: Sponsor slots 5tr/số",           required: false },
    ],
    outputExample: "SUBJECT LINE FORMULA: [Số] + [Noun] + [Unexpected twist]\nVD: '7 AI tools tôi dùng mỗi ngày (số 4 sẽ làm bạn ngạc nhiên)'",
    instructions: "Dùng template này làm editorial guideline cho toàn team. Mỗi số newsletter chỉ cần fill vào slots — tiết kiệm 2-3 giờ viết mỗi tuần.",
  },

  // ═══════════════════════ DESIGN — MIDJOURNEY ═══════════════════════
  {
    id: "product-photo-mj",
    name: "Product Photography Pro",
    description: "Biến ảnh sản phẩm điện thoại thành ảnh studio chuyên nghiệp với Midjourney v6.",
    model: "Midjourney",
    category: "Design",
    price: 129_000,
    rating: 4.9,
    sales: 2_341,
    seller: "MonetAI Official",
    badge: "BÁN CHẠY",
    tags: ["Midjourney","Product Photo","E-commerce","Studio"],
    preview: "/imagine prompt: Professional product photography of {{product_desc}}, studio lighting, white seamless background...",
    fullPrompt: `/imagine prompt: Professional product photography of {{product_desc}}, pristine studio environment, three-point lighting setup with key light at 45 degrees, soft fill light eliminating harsh shadows, subtle rim light creating depth, placed on {{surface}} surface, background: {{background}}, shot with Canon 5D Mark IV, 100mm macro lens, f/8 aperture, ISO 100, perfect color accuracy, high-end commercial quality, {{style}} aesthetic, ultra sharp focus on product details, subtle realistic shadow beneath product, professional retouching, advertising-ready, 8K resolution --ar {{aspect_ratio}} --v 6 --style raw --q 2

VARIATION 2 (Lifestyle):
/imagine prompt: Lifestyle product photo of {{product_desc}} in {{lifestyle_setting}}, natural morning light streaming from window, authentic real-life environment, editorial magazine style, Canon R5, 35mm lens, f/2.8, bokeh background, warm tones, {{mood}} mood --ar 4:5 --v 6 --style raw

VARIATION 3 (Flat Lay):
/imagine prompt: Overhead flat lay product photography, {{product_desc}} centered, surrounded by {{props}}, clean {{background_color}} background, perfect symmetry, natural shadows, minimalist composition, top-down view directly, professional product catalog style --ar 1:1 --v 6

VARIATION 4 (Dramatic Dark):
/imagine prompt: Dark moody product photography, {{product_desc}}, dramatic side lighting, deep shadows, dark {{dark_color}} background, luxury brand aesthetic, high contrast, cinematic quality --ar 16:9 --v 6

---
NEGATIVE PROMPTS (thêm vào cuối mỗi prompt):
--no fake, plastic look, oversaturated, blurry, distorted, amateur, watermark`,
    variables: [
      { key: "product_desc",    label: "Mô tả sản phẩm (EN)",  placeholder: "VD: glass perfume bottle, minimalist design, rose gold cap", required: true },
      { key: "surface",         label: "Bề mặt đặt sản phẩm", placeholder: "VD: marble, wood, white acrylic",                            required: false },
      { key: "background",      label: "Background",            placeholder: "VD: pure white, light gray gradient, soft beige",           required: false },
      { key: "style",           label: "Phong cách",            placeholder: "VD: luxury, minimalist, organic, tech",                     required: false },
      { key: "aspect_ratio",    label: "Tỷ lệ ảnh",            placeholder: "VD: 1:1 (vuông), 4:5 (portrait), 16:9 (landscape)",        required: false },
      { key: "lifestyle_setting", label: "Cảnh lifestyle",     placeholder: "VD: modern kitchen, cozy bedroom, outdoor cafe",            required: false },
      { key: "props",           label: "Props xung quanh",     placeholder: "VD: fresh flowers, coffee cup, linen fabric",              required: false },
    ],
    outputExample: "Prompt mẫu: /imagine prompt: Professional product photography of glass skincare serum bottle with gold dropper cap, pristine studio environment, three-point lighting... --ar 1:1 --v 6 --style raw --q 2",
    instructions: "Copy prompt → Paste vào Midjourney Discord hoặc midjourney.com → Dùng /imagine → Upscale ảnh đẹp nhất → Download full resolution.",
  },
  {
    id: "logo-concepts-mj",
    name: "Brand Logo Concepts",
    description: "5 hướng thiết kế logo khác nhau với style guide đầy đủ cho brand identity.",
    model: "Midjourney",
    category: "Design",
    price: 149_000,
    rating: 4.7,
    sales: 876,
    seller: "MonetAI Official",
    tags: ["Logo","Branding","Identity","Midjourney"],
    preview: "/imagine prompt: Professional logo design for {{brand_name}}, {{style_1}} style...",
    fullPrompt: `5 CONCEPT LOGO PROMPTS cho {{brand_name}} — {{brand_desc}}

CONCEPT 1 — WORDMARK MINIMALIST:
/imagine prompt: Professional wordmark logo for "{{brand_name}}", clean sans-serif typography, {{color_1}} and {{color_2}} color palette, minimal geometric accent mark, negative space design principle, scalable vector aesthetic, white background, brand identity, professional corporate, flat design 2D --ar 1:1 --v 6 --style raw

CONCEPT 2 — ICON + LETTERMARK:
/imagine prompt: Modern lettermark logo "{{brand_initials}}", geometric construction, {{icon_metaphor}} hidden within letters, bold {{primary_color}} on white, Swiss design influence, mathematical precision, corporate identity, icon mark suitable for app icon, dark and light version shown --ar 1:1 --v 6

CONCEPT 3 — MASCOT/CHARACTER:
/imagine prompt: Friendly mascot logo character for {{brand_name}}, {{mascot_desc}}, simple iconic style, limited 2-3 color palette, versatile at small sizes, cartoon illustration, brand character design, playful professional, white background --ar 1:1 --v 6

CONCEPT 4 — ABSTRACT MARK:
/imagine prompt: Abstract logo mark for {{brand_name}} representing {{brand_values}}, geometric abstract symbol, {{shape_inspiration}} inspired, gradient {{gradient_colors}}, modern tech company aesthetic, versatile on light and dark backgrounds, bold and memorable --ar 1:1 --v 6

CONCEPT 5 — BADGE/EMBLEM:
/imagine prompt: Premium badge emblem logo for "{{brand_name}}", circular or shield shape, {{industry}} industry, luxury heritage feel, detailed illustration within badge, gold and navy color palette, craftmanship quality, suitable for packaging and merchandise --ar 1:1 --v 6

---
BRAND STYLE GUIDE SUMMARY (điền sau khi chọn concept):
Primary colors: [Lấy từ concept đã chọn]
Typography pairing gợi ý: [Heading font + Body font]
Usage guidelines: Minimum size, clear space, do/don't`,
    variables: [
      { key: "brand_name",     label: "Tên thương hiệu",    placeholder: "VD: MonetAI",                              required: true },
      { key: "brand_desc",     label: "Mô tả brand",        placeholder: "VD: AI Commerce platform for Vietnam",     required: true },
      { key: "brand_initials", label: "Chữ viết tắt",       placeholder: "VD: M, MA, MAI",                           required: false },
      { key: "primary_color",  label: "Màu chủ đạo",        placeholder: "VD: deep orange, navy blue, forest green", required: true },
      { key: "icon_metaphor",  label: "Ý nghĩa icon",       placeholder: "VD: growth, connection, speed, nature",    required: false },
      { key: "brand_values",   label: "Giá trị brand",      placeholder: "VD: innovation, trust, simplicity",        required: false },
      { key: "industry",       label: "Ngành",              placeholder: "VD: technology, food, finance, fashion",   required: false },
    ],
    outputExample: "CONCEPT 1 cho MonetAI: /imagine prompt: Professional wordmark logo for 'MonetAI', clean geometric sans-serif, vibrant orange #FF6B00 and deep navy accent, coin symbol integrated into M letterform... --ar 1:1 --v 6",
    instructions: "Run tất cả 5 concepts → Chọn direction tốt nhất → Iterate với variations → Dùng kết quả như design brief cho graphic designer refine.",
  },
  {
    id: "ui-mockup-mj",
    name: "UI Design Mockup Generator",
    description: "Tạo mockup giao diện app/web professional với Midjourney để pitch khách hàng hoặc investor.",
    model: "Midjourney",
    category: "Design",
    price: 129_000,
    rating: 4.6,
    sales: 543,
    seller: "MonetAI Official",
    tags: ["UI","UX","App Design","Mockup","Midjourney"],
    preview: "/imagine prompt: Mobile app UI design for {{app_type}}, modern clean interface...",
    fullPrompt: `UI MOCKUP PROMPT PACK cho {{app_name}} — {{app_type}}

MOBILE APP SCREEN (Home/Dashboard):
/imagine prompt: Mobile app UI design for {{app_type}} application named "{{app_name}}", {{color_scheme}} color scheme, modern clean dashboard layout, data visualization cards, bottom navigation bar with 5 icons, iOS/Android hybrid design language, smooth rounded corners, subtle shadows and depth, realistic phone mockup frame, high-end fintech/{{industry}} aesthetic, dark mode option, Figma-quality design --ar 9:16 --v 6 --style raw

LANDING PAGE HERO:
/imagine prompt: Modern SaaS landing page hero section design for {{app_name}}, {{color_scheme}} brand colors, bold headline typography on the left, UI screenshot/mockup floating on right, gradient background subtle, clean whitespace, trust badges row, CTA button prominent, professional web design 2024 style, desktop viewport 1440px --ar 16:9 --v 6

DASHBOARD OVERVIEW:
/imagine prompt: Web app dashboard UI, {{app_type}} analytics interface, data cards grid layout, sidebar navigation, {{color_scheme}} theme, chart visualizations, user stats widgets, modern SaaS design, clean typography, professional enterprise software aesthetic, desktop mockup --ar 16:9 --v 6 --style raw

ONBOARDING SCREENS (3-step flow):
/imagine prompt: Mobile app onboarding flow 3 screens side by side, {{app_name}} {{app_type}}, progress indicator, illustration style, {{color_scheme}} theme, friendly copy, smooth swipe-through design, conversion-optimized UX --ar 3:1 --v 6

COMPONENT LIBRARY PREVIEW:
/imagine prompt: UI component library showcase for {{app_name}}, buttons states, input fields, cards, modals, tooltips, {{color_scheme}} design system, organized grid layout, design tokens visual, professional design documentation --ar 4:3 --v 6`,
    variables: [
      { key: "app_name",     label: "Tên app",          placeholder: "VD: MonetAI, TrackBud, FoodieAI",    required: true },
      { key: "app_type",     label: "Loại app",         placeholder: "VD: fintech, food delivery, social",  required: true },
      { key: "color_scheme", label: "Màu sắc",          placeholder: "VD: dark blue and gold, white and green", required: true },
      { key: "industry",     label: "Ngành",            placeholder: "VD: finance, health, education",      required: false },
    ],
    outputExample: "HOME SCREEN: /imagine prompt: Mobile app UI design for AI commerce application named 'MonetAI', dark background with vibrant orange accents, modern clean dashboard layout... --ar 9:16 --v 6 --style raw",
    instructions: "Output dùng để pitch khách hàng, làm Figma reference hoặc tạo prototype. Đây là inspiration — cần designer translate sang actual design.",
  },
  {
    id: "ecommerce-product-shots",
    name: "E-commerce Product Shot Pack",
    description: "Pack 6 loại ảnh sản phẩm cho sàn TMĐT: main image, lifestyle, infographic, comparison.",
    model: "Midjourney",
    category: "Design",
    price: 99_000,
    rating: 4.7,
    sales: 1_123,
    seller: "MonetAI Official",
    tags: ["E-commerce","Product","Shopee","Lazada","Amazon"],
    preview: "PACK ảnh sản phẩm chuẩn sàn thương mại điện tử cho {{ten_san_pham}}...",
    fullPrompt: `E-COMMERCE PRODUCT SHOT PACK — {{ten_san_pham}}
Mô tả sản phẩm: {{mo_ta_san_pham}}
Màu sắc sản phẩm: {{mau_sac}}
Platform target: {{platform}} (Shopee/Lazada/Amazon/TikTok Shop)

SHOT 1 — MAIN PRODUCT IMAGE (White BG):
/imagine prompt: {{mo_ta_san_pham}} product photography, pure white background #FFFFFF, centered composition, professional studio lighting, shadow beneath product, multiple angles collage 3-view (front/side/angle), high-detail sharp focus, e-commerce ready, Shopee/Amazon main image quality --ar 1:1 --v 6 --q 2 --style raw

SHOT 2 — LIFESTYLE IN USE:
/imagine prompt: Lifestyle photography showing {{mo_ta_san_pham}} being used by {{nguoi_dung}}, authentic real home setting, natural window light, candid moment, warm color grading, relatable everyday scenario, product prominently featured but contextual --ar 4:5 --v 6

SHOT 3 — INFOGRAPHIC STYLE:
/imagine prompt: Product infographic image for {{ten_san_pham}}, features callout with arrows/lines, clean minimal white background, {{color_1}} accent color, key features highlighted with icons, measurement/size reference, professional product catalog page layout --ar 1:1 --v 6

SHOT 4 — BEFORE/AFTER (nếu applicable):
/imagine prompt: Split-screen before and after comparison image, left side showing problem without {{ten_san_pham}}, right side showing solution with product, bold dividing line, text overlay "Before" "After", clean comparison ad format --ar 16:9 --v 6

SHOT 5 — DETAIL CLOSE-UP:
/imagine prompt: Extreme close-up macro photography of {{chi_tiet_noi_bat}} of {{mo_ta_san_pham}}, shallow depth of field, premium texture detail, luxury advertising quality, dramatic lighting revealing material quality --ar 4:5 --v 6

SHOT 6 — PACKAGING:
/imagine prompt: Premium product packaging photography, {{ten_san_pham}} in its box/packaging, unboxing moment, white/{{mau_sac}} packaging, luxury unboxing experience, gift-worthy presentation, brand consistency --ar 1:1 --v 6`,
    variables: [
      { key: "ten_san_pham",      label: "Tên sản phẩm",       placeholder: "VD: Serum vitamin C 30ml",             required: true },
      { key: "mo_ta_san_pham",    label: "Mô tả SP (tiếng Anh)", placeholder: "VD: vitamin C brightening face serum in amber glass bottle", required: true },
      { key: "mau_sac",           label: "Màu sắc SP",          placeholder: "VD: amber, white, rose gold",          required: false },
      { key: "platform",          label: "Platform",             placeholder: "VD: Shopee, TikTok Shop, Amazon",      required: false },
      { key: "nguoi_dung",        label: "Người dùng mô tả",    placeholder: "VD: young Vietnamese woman 25-30",     required: false },
      { key: "chi_tiet_noi_bat",  label: "Chi tiết nổi bật",    placeholder: "VD: gold cap, dropper mechanism",      required: false },
    ],
    outputExample: "SHOT 1: /imagine prompt: vitamin C brightening face serum in amber glass bottle product photography, pure white background, centered composition, studio lighting... --ar 1:1 --v 6 --q 2",
    instructions: "Run từng shot riêng trong Midjourney. Edit nhẹ trong Canva/Photoshop. Dùng Shot 1 làm main image, Shot 2-6 cho các ảnh phụ trên listing.",
  },

  // ═══════════════════════ SOCIAL ═══════════════════════
  {
    id: "instagram-captions",
    name: "Instagram Caption Pack (30 captions)",
    description: "30 caption Instagram ready-to-post theo 6 format khác nhau, tối ưu engagement.",
    model: "Gemini",
    category: "Social",
    price: 69_000,
    rating: 4.7,
    sales: 673,
    seller: "MonetAI Official",
    tags: ["Instagram","Caption","Social Media","Content Calendar"],
    preview: "Bạn là Instagram Content Creator với 500k+ followers, chuyên tạo caption viral...",
    fullPrompt: `Bạn là Instagram Content Creator với 500k+ followers, chuyên tạo caption có engagement rate 8%+ (10x trung bình ngành).

Brand/Account: {{ten_account}}
Niche: {{niche}}
Đối tượng: {{doi_tuong}}
Brand voice: {{brand_voice}}
Call to action chuẩn: {{cta}}
Products/Services muốn promote: {{san_pham}}

Tạo 30 INSTAGRAM CAPTION THEO 6 FORMAT:

FORMAT 1 — MOTIVATIONAL QUOTES (5 captions):
Viết quote gốc (không copy), liên quan đến {{niche}}, kết thúc bằng question to followers.

FORMAT 2 — EDUCATIONAL CAROUSEL (5 captions):
"Swipe → để học [something valuable]" format. Tease 5 points trong caption.

FORMAT 3 — PERSONAL STORY (5 captions):
Câu chuyện cá nhân/brand, emotional, relatable, có turning point.

FORMAT 4 — PRODUCT FEATURE (5 captions):
Highlight {{san_pham}} với storytelling approach, không hard sell.

FORMAT 5 — TRENDING SOUND/MEME CAPTION (5 captions):
Caption phù hợp dùng với trending audio hoặc meme format hiện tại.

FORMAT 6 — ENGAGEMENT BAIT (5 captions):
"Comment X nếu bạn..." / This or That / Poll in caption (legitimate engagement, không spam)

---
MỖI CAPTION PHẢI CÓ:
- Hook line đầu tiên cực mạnh (2 dòng đầu visible trước "more")
- Body 3-8 dòng
- 1-3 emoji phù hợp
- CTA rõ ràng
- Hashtag block (30 hashtags: mix popular + niche + branded)`,
    variables: [
      { key: "ten_account", label: "Tên tài khoản",  placeholder: "VD: @monetai.vn",                        required: true },
      { key: "niche",       label: "Niche",          placeholder: "VD: Kiếm tiền AI, Skincare, Fitness",     required: true },
      { key: "doi_tuong",   label: "Đối tượng",      placeholder: "VD: Gen Z 18-25 muốn kiếm thêm tiền",    required: true },
      { key: "brand_voice", label: "Brand voice",    placeholder: "VD: Friendly, inspiring, educational",    required: false },
      { key: "cta",         label: "CTA chuẩn",      placeholder: "VD: Link in bio, DM để tư vấn",           required: false },
      { key: "san_pham",    label: "Sản phẩm",       placeholder: "VD: Khóa học AI, App MonetAI",            required: false },
    ],
    outputExample: "FORMAT 1 #1:\nBạn không thất bại — bạn đang học cách thành công chậm hơn người khác.\n.\nNhưng 'chậm' không có nghĩa là 'sai'.\n.\nMỗi creator thành công mà bạn follow đều có 6-12 tháng không ai biết đến họ.\n.\nCâu hỏi là: bạn có đủ kiên nhẫn để đi qua giai đoạn đó không? 🔥\n.\n💬 Comment 'CÓ' nếu bạn đang trong giai đoạn đó\n.\n#monetai #kiemsotienaivietnam...",
    instructions: "30 captions = 1 tháng content (post mỗi ngày). Schedule bằng Buffer/Later/Hootsuite. Gemini đặc biệt giỏi viết theo trend tiếng Việt.",
  },
  {
    id: "twitter-thread",
    name: "Twitter/X Thread Generator",
    description: "Thread viral 15-20 tweets với hook mạnh, value content, và CTA tự nhiên ở cuối.",
    model: "Gemini",
    category: "Social",
    price: 59_000,
    rating: 4.6,
    sales: 312,
    seller: "MonetAI Official",
    tags: ["Twitter","X","Thread","Viral","Personal Brand"],
    preview: "Bạn là Twitter/X growth strategist với 100k+ followers...\nViết thread viral về chủ đề...",
    fullPrompt: `Bạn là Twitter/X growth strategist với 100k+ followers, chuyên tạo thread viral 50k+ impressions.

Chủ đề thread: {{chu_de}}
Insight chính muốn chia sẻ: {{insight}}
Đối tượng: {{doi_tuong}}
CTA cuối thread: {{cta}}
Account của bạn về: {{niche}}

Viết THREAD 18 TWEETS:

Tweet 1 — THE HOOK (Quan trọng nhất):
Câu mở đầu gây sốc/tò mò + "Thread 🧵" + số tweets
Format: "[Statement bất ngờ/counter-intuitive].\n\nThread về [topic] 🧵\n\n(18 tweets)"

Tweet 2 — CONTEXT SETUP:
Tại sao chủ đề này quan trọng, số liệu nhanh

Tweets 3-15 — CORE CONTENT:
Mỗi tweet: 1 insight/tip/step duy nhất
- Dưới 280 ký tự
- Standalone valuable (ai đọc 1 tweet cũng hiểu)
- Có thể dùng emoji để visual break
- Số thứ tự: "3/"

Tweet 16 — THE PLOT TWIST:
Điều bất ngờ/counter-intuitive liên quan đến topic

Tweet 17 — SUMMARY:
"TL;DR:" + 5-7 bullet points tóm tắt toàn thread

Tweet 18 — CTA:
Retweet ask + Follow + CTA cụ thể

---
THREAD BONUS:
3 "Quote tweet" hooks để repost lại thread sau 1 tuần`,
    variables: [
      { key: "chu_de",   label: "Chủ đề thread",    placeholder: "VD: Cách xây dựng passive income với AI",      required: true },
      { key: "insight",  label: "Insight chính",     placeholder: "VD: 80% người fail vì bỏ cuộc trước 6 tháng",  required: true },
      { key: "doi_tuong", label: "Đối tượng",        placeholder: "VD: Người muốn thoát 9-5",                     required: true },
      { key: "cta",      label: "CTA cuối",          placeholder: "VD: Follow để nhận thêm, Link khóa học",        required: false },
      { key: "niche",    label: "Niche account",     placeholder: "VD: AI, Side hustle, Marketing",                required: false },
    ],
    outputExample: "Tweet 1: Tôi đã kiếm được 50 triệu trong 30 ngày mà không cần sếp, không cần văn phòng, không cần nhân viên.\n\nBí mật? Tôi để AI làm 90% công việc.\n\nThread về cách tôi setup hệ thống này 🧵\n\n(18 tweets)",
    instructions: "Post thread vào 7-9h sáng hoặc 7-9h tối giờ VN. Engage reply cho 10 tweet đầu tiên nhận được comment. Pin tweet 1 lên profile.",
  },

  // ═══════════════════════ CSKH ═══════════════════════
  {
    id: "customer-service-templates",
    name: "Customer Service Response Templates",
    description: "Bộ 25 template trả lời khách hàng chuyên nghiệp cho mọi tình huống: khiếu nại, hoàn tiền, cảm ơn.",
    model: "Claude",
    category: "CSKH",
    price: 89_000,
    rating: 4.8,
    sales: 432,
    seller: "MonetAI Official",
    tags: ["CSKH","Customer Service","Template","Chat Support"],
    preview: "Bạn là Head of Customer Success tại một startup SaaS top tier...\nTạo bộ template trả lời khách hàng...",
    fullPrompt: `Bạn là Head of Customer Success tại một startup SaaS top tier, đã xây dựng team CSKH giảm churn rate 40%.

Tên công ty: {{ten_cong_ty}}
Sản phẩm/Dịch vụ: {{san_pham}}
Tone thương hiệu: {{tone}} (VD: Thân thiện-chuyên nghiệp / Formal / Gen Z friendly)
Chính sách hoàn tiền: {{chinh_sach_hoan_tien}}
Tên nhân viên ký tên: {{ky_ten}} (VD: Team {{ten_cong_ty}} hoặc [Tên nhân viên])

Tạo BỘ 25 TEMPLATE CSKH theo nhóm:

NHÓM 1 — ĐÓN TIẾP & XÁC NHẬN (5 templates):
1.1 Welcome message đầu tiên
1.2 Xác nhận đã nhận yêu cầu
1.3 Chào khách hàng VIP/quay lại
1.4 Ngoài giờ làm việc (auto-reply)
1.5 Xếp hàng chờ (queue notification)

NHÓM 2 — XỬ LÝ VẤN ĐỀ (8 templates):
2.1 Sản phẩm lỗi — xin lỗi + hướng xử lý
2.2 Giao hàng chậm — giải thích + compensation
2.3 Không tìm thấy đơn hàng
2.4 Lỗi thanh toán
2.5 Tài khoản bị khóa
2.6 Không hiểu cách dùng sản phẩm (gentle how-to)
2.7 Khiếu nại gay gắt (de-escalation script)
2.8 Lỗi thuộc về khách hàng (khéo léo từ chối)

NHÓM 3 — HOÀN TIỀN & ĐỔI TRẢ (4 templates):
3.1 Chấp thuận hoàn tiền
3.2 Từ chối hoàn tiền (lý do chính đáng)
3.3 Đề xuất đổi sản phẩm thay hoàn tiền
3.4 Xử lý yêu cầu hoàn tiền không hợp lệ

NHÓM 4 — CHĂM SÓC & GIỮ CHÂN (4 templates):
4.1 Theo dõi sau mua (post-purchase check-in)
4.2 Chúc mừng sinh nhật khách hàng
4.3 Win-back khách hàng cũ
4.4 Cảm ơn sau khi giải quyết vấn đề

NHÓM 5 — KẾT THÚC VÀ ĐÁNH GIÁ (4 templates):
5.1 Đóng ticket — xác nhận đã giải quyết
5.2 Mời đánh giá 5 sao
5.3 Mời review trên Google/Shopee
5.4 Referral ask sau khi satisfied

---
FORMAT MỖI TEMPLATE:
Tiêu đề: [Tên tình huống]
Channel phù hợp: [Chat/Email/Call]
Template: [Nội dung đầy đủ với {{placeholders}}]
Lưu ý sử dụng: [1-2 gợi ý]`,
    variables: [
      { key: "ten_cong_ty",          label: "Tên công ty",        placeholder: "VD: MonetAI",                             required: true },
      { key: "san_pham",             label: "Sản phẩm/DV",        placeholder: "VD: nền tảng AI Commerce",               required: true },
      { key: "tone",                 label: "Tone CSKH",          placeholder: "VD: Thân thiện + Chuyên nghiệp",          required: true },
      { key: "chinh_sach_hoan_tien", label: "Chính sách hoàn tiền", placeholder: "VD: Hoàn tiền trong 7 ngày nếu lỗi SP", required: true },
      { key: "ky_ten",               label: "Ký tên cuối",        placeholder: "VD: Team MonetAI",                        required: false },
    ],
    outputExample: "2.7 DE-ESCALATION:\nXin chào {{Tên khách hàng}},\n\nCảm ơn bạn đã chia sẻ — tôi hiểu điều này thật sự gây phiền cho bạn và tôi xin lỗi vì trải nghiệm này.\n\n[Acknowledge cảm xúc trước khi giải thích]",
    instructions: "Import vào hệ thống chat (Zendesk/Intercom/Freshdesk) → Canned responses → Assign nhóm phù hợp → Train team dùng đúng template theo tình huống.",
  },
  {
    id: "faq-generator",
    name: "FAQ Content Generator",
    description: "Tạo trang FAQ đầy đủ 20+ câu hỏi tối ưu SEO và schema markup cho trang web.",
    model: "ChatGPT-4",
    category: "CSKH",
    price: 69_000,
    rating: 4.5,
    sales: 234,
    seller: "MonetAI Official",
    tags: ["FAQ","SEO","Schema","Help Center"],
    preview: "Bạn là UX Writer và SEO specialist, chuyên tạo trang FAQ giúp giảm support ticket...",
    fullPrompt: `Bạn là UX Writer và SEO specialist, chuyên tạo trang FAQ giúp giảm support ticket 30% và tăng Google SERP snippet.

Sản phẩm/Dịch vụ: {{san_pham}}
Ngành: {{nganh}}
Đối tượng: {{doi_tuong}}
Top 5 câu hỏi khách hàng thường hỏi nhất: {{cau_hoi_thuong_gap}}
Giá và chính sách cần highlight: {{chinh_sach}}

Tạo FAQ PAGE HOÀN CHỈNH:

NHÓM 1 — THÔNG TIN CƠ BẢN (5 câu):
Q: [Câu hỏi tự nhiên, có keyword]
A: [Trả lời ngắn gọn 2-5 câu, có link nội bộ gợi ý]

NHÓM 2 — SẢN PHẨM/DỊCH VỤ (5 câu):
Câu hỏi về tính năng, cách dùng, yêu cầu hệ thống

NHÓM 3 — GIÁ & THANH TOÁN (5 câu):
Câu hỏi về pricing, upgrade, refund, invoice

NHÓM 4 — KỸ THUẬT & HỖ TRỢ (3 câu):
Xử lý sự cố phổ biến

NHÓM 5 — CHÍNH SÁCH (4 câu):
Privacy, data, cancellation, terms

---
JSON-LD SCHEMA MARKUP (copy-paste vào <head>):
\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    // Tất cả 20+ câu hỏi theo format schema
  ]
}
\`\`\`

SEO TIPS cho FAQ page này:
- Featured snippet optimization
- Internal linking strategy
- Content cluster position`,
    variables: [
      { key: "san_pham",           label: "Sản phẩm/DV",         placeholder: "VD: Phần mềm quản lý bán hàng",         required: true },
      { key: "nganh",              label: "Ngành",                placeholder: "VD: SaaS, E-commerce, Giáo dục",        required: true },
      { key: "doi_tuong",          label: "Khách hàng",           placeholder: "VD: Chủ shop online, SME owner",        required: true },
      { key: "cau_hoi_thuong_gap", label: "Câu hỏi hay gặp",     placeholder: "VD: Có dùng thử miễn phí không? Có app không?", required: true },
      { key: "chinh_sach",         label: "Giá & Chính sách",    placeholder: "VD: 199k/tháng, hoàn tiền 7 ngày",      required: true },
    ],
    outputExample: "Q: Tôi có thể dùng thử trước khi mua không?\nA: Có! Chúng tôi cung cấp 14 ngày dùng thử miễn phí, không cần thẻ tín dụng. Bạn có thể trải nghiệm đầy đủ tính năng Premium trong thời gian này. [Link: Đăng ký dùng thử]",
    instructions: "Thêm FAQ vào website → Paste JSON-LD schema vào <head> → Submit URL cho Google Search Console → Monitor featured snippets sau 4-6 tuần.",
  },

  // ═══════════════════════ HR ═══════════════════════
  {
    id: "hr-job-description",
    name: "Job Description Writer Pro",
    description: "Bài đăng tuyển dụng hấp dẫn, giảm bias, tăng quality applicants theo LinkedIn best practices.",
    model: "Claude",
    category: "HR",
    price: 79_000,
    rating: 4.6,
    sales: 287,
    seller: "MonetAI Official",
    tags: ["HR","Tuyển dụng","Job Post","LinkedIn","Talent"],
    preview: "Bạn là Talent Acquisition specialist với 10 năm tuyển dụng top talent...",
    fullPrompt: `Bạn là Talent Acquisition specialist với 10 năm tuyển dụng top talent cho startup và tech company, chuyên viết JD thu hút đúng người.

Vị trí tuyển: {{ten_vi_tri}}
Công ty: {{ten_cong_ty}}
Ngành: {{nganh}}
Level: {{level}} (Intern/Junior/Senior/Lead/Manager/Director)
Mức lương: {{luong}} (hoặc "Thương lượng")
Remote/Onsite: {{work_model}}
Yêu cầu bắt buộc: {{yeu_cau_bat_buoc}}
Yêu cầu ưu tiên (nice-to-have): {{yeu_cau_uu_tien}}
Văn hóa công ty: {{van_hoa}}
Benefits đặc biệt: {{benefits}}

Viết JOB DESCRIPTION ĐẦY ĐỦ:

[HEADLINE]:
"[Vị trí] tại [Công ty] — [1 benefit hấp dẫn nhất]"

[ABOUT US] (3-4 câu max):
Company story ngắn + mission + why it matters

[THE ROLE] (100-150 từ):
Tầm quan trọng của role này với company, impact, scope

[WHAT YOU'LL DO — Key Responsibilities]:
- 6-8 bullets, bắt đầu bằng action verb mạnh
- Cụ thể, đo lường được
- Thú vị, không boring

[WHAT YOU BRING — Requirements]:
MUST HAVE (3-5 điều thực sự cần thiết):
- [Requirement] vì [Lý do cụ thể]

NICE TO HAVE (3-4 điều bonus):

[WHAT WE OFFER — Benefits]:
Chia theo nhóm: 💰 Compensation | 🎓 Growth | 🏠 Flexibility | 🎉 Culture

[INTERVIEW PROCESS]:
Transparent 3-4 bước rõ ràng, timeline

[DIVERSITY STATEMENT]:
1 câu genuine diversity & inclusion

[HOW TO APPLY]:
CTA với instruction rõ ràng + contact

---
LINKEDIN POST VERSION (300 từ):
Viết lại thành post LinkedIn hấp dẫn hơn để share`,
    variables: [
      { key: "ten_vi_tri",       label: "Vị trí tuyển",       placeholder: "VD: Senior Product Manager",              required: true },
      { key: "ten_cong_ty",      label: "Tên công ty",         placeholder: "VD: MonetAI",                             required: true },
      { key: "nganh",            label: "Ngành",               placeholder: "VD: AI/SaaS startup",                     required: true },
      { key: "level",            label: "Level",               placeholder: "VD: Senior (3-5 năm kinh nghiệm)",         required: true },
      { key: "luong",            label: "Mức lương",           placeholder: "VD: 30-45 triệu/tháng gross",             required: true },
      { key: "work_model",       label: "Hình thức làm việc",  placeholder: "VD: Hybrid 3 ngày/tuần, Hà Nội",          required: true },
      { key: "yeu_cau_bat_buoc", label: "Yêu cầu bắt buộc",   placeholder: "VD: 3+ năm PM, English B2+, data-driven", required: true },
      { key: "yeu_cau_uu_tien",  label: "Yêu cầu ưu tiên",    placeholder: "VD: Đã làm B2B SaaS, có startup experience", required: false },
      { key: "van_hoa",          label: "Văn hóa công ty",     placeholder: "VD: Move fast, ownership, no BS",          required: false },
      { key: "benefits",         label: "Benefits nổi bật",    placeholder: "VD: ESOP, team trip abroad, learning budget", required: false },
    ],
    outputExample: "HEADLINE: Senior Product Manager tại MonetAI — Xây dựng nền tảng AI Commerce #1 Đông Nam Á\n\nWHAT YOU'LL DO:\n• Own product roadmap cho AI Marketplace — từ ideation đến launch trong 90 ngày\n• Phân tích dữ liệu 50k+ users để identify growth opportunities...",
    instructions: "Post trên LinkedIn + TopCV + Vietnamworks. Dùng LinkedIn version cho social. Track applicant quality để optimize JD sau mỗi hire.",
  },
];
