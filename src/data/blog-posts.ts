export type Category = "Hướng dẫn" | "Case Study" | "So sánh" | "Xu hướng";

export interface BlogPost {
  slug:        string;
  title:       string;
  excerpt:     string;
  category:    Category;
  readTime:    number;           // minutes
  publishedAt: string;           // ISO date
  featured:    boolean;
  content:     string;           // HTML string
  tags:        string[];
}

export const CATEGORIES: { id: Category; label: string; sub: string; num: string }[] = [
  { id: "Hướng dẫn", label: "Hướng dẫn dùng AI kiếm tiền",   sub: "Quy trình từng bước, dễ làm theo, dành cho người mới bắt đầu với AI.",          num: "01" },
  { id: "Case Study", label: "Câu chuyện thật từ MonetAI",     sub: "Số liệu, kết quả và bài học từ người dùng thật — không tô vẽ.",                  num: "02" },
  { id: "So sánh",   label: "Đánh giá công cụ AI",             sub: "So sánh khách quan để bạn chọn đúng công cụ cho đúng việc.",                     num: "03" },
  { id: "Xu hướng",  label: "Tin tức & xu hướng AI",           sub: "Cập nhật nhanh những thay đổi quan trọng trong thế giới AI.",                    num: "04" },
];

export const posts: BlogPost[] = [
  {
    slug:        "10-cach-dung-ai-kiem-tien-online-2026",
    title:       "10 cách dùng AI kiếm tiền online tại Việt Nam năm 2026",
    excerpt:     "Từ viết content, tạo ảnh, đến tự động hoá công việc — danh sách thực chiến kèm công cụ cụ thể cho từng cách, không lý thuyết suông.",
    category:    "Hướng dẫn",
    readTime:    12,
    publishedAt: "2026-06-18",
    featured:    true,
    tags:        ["AI kiếm tiền", "hướng dẫn", "2026", "thu nhập thụ động"],
    content: `
<h2>Tại sao 2026 là năm tốt nhất để bắt đầu kiếm tiền với AI?</h2>
<p>Thị trường AI toàn cầu đã vượt 200 tỷ USD và đang tăng trưởng 37% mỗi năm. Tại Việt Nam, hàng triệu người vẫn chưa biết cách tận dụng AI để tạo thu nhập — đây chính là cơ hội của bạn.</p>

<p>Khác với 2-3 năm trước khi AI còn mới và phức tạp, giờ đây bạn không cần biết code, không cần vốn lớn. Chỉ cần biết cách dùng đúng công cụ, đúng cách.</p>

<h2>1. Viết content Affiliate với AI</h2>
<p>Đây là cách phổ biến và dễ bắt đầu nhất. Bạn dùng ChatGPT hoặc Claude để viết review, hướng dẫn, so sánh sản phẩm AI — rồi gắn link affiliate để nhận hoa hồng khi người khác mua.</p>
<p><strong>Công cụ:</strong> ChatGPT-4, Claude 3.5, MonetAI Content Generator<br/>
<strong>Thu nhập tiềm năng:</strong> 3-30 triệu/tháng tùy traffic<br/>
<strong>Thời gian bắt đầu:</strong> 1 tuần</p>

<h2>2. Bán Prompt AI trên Marketplace</h2>
<p>Một prompt tốt có thể bán được hàng trăm lần. Bạn viết prompt chuyên sâu cho Marketing, Design, Business — rồi đăng bán trên MonetAI Prompt Marketplace.</p>
<p><strong>Mức giá:</strong> 19.000 — 299.000₫/prompt<br/>
<strong>Thu nhập tiềm năng:</strong> 5-50 triệu/tháng nếu có portfolio 20+ prompts</p>

<h2>3. Xây dựng và bán AI Agent</h2>
<p>AI Agent là "nhân viên AI" tự động thực hiện các tác vụ. Một agent chăm sóc khách hàng, agent viết content, agent phân tích data — giá trị từ 500k đến 50 triệu mỗi agent.</p>

<h2>4. Affiliate marketing cho AI Tools</h2>
<p>Hàng trăm công cụ AI có chương trình affiliate với hoa hồng 20-50%. Bạn chỉ cần lấy link, chia sẻ và thu tiền mỗi tháng.</p>
<p><strong>Ví dụ:</strong> Claude Pro (30%), Jasper (30%), Canva Pro (20%), ChatGPT Plus (recurring).</p>

<h2>5. Dạy AI cho doanh nghiệp</h2>
<p>Hầu hết doanh nghiệp SME tại Việt Nam chưa dùng AI hiệu quả. Bạn có thể tổ chức workshop 1-2 ngày dạy cách dùng AI trong công việc — mức giá từ 5-20 triệu/buổi.</p>

<h2>6. Tạo video TikTok về AI</h2>
<p>Nội dung AI đang là xu hướng nóng trên TikTok. Dùng AI viết kịch bản, edit video — rồi kiếm tiền qua TikTok Creator Fund, affiliate link trong bio, và sponsorship.</p>

<h2>7. Dịch vụ AI Automation cho SME</h2>
<p>Xây chatbot, hệ thống email tự động, CRM automation — charge 5-30 triệu/setup + phí duy trì hàng tháng.</p>

<h2>8. Resell tài khoản AI</h2>
<p>Mua tài khoản Claude Pro, ChatGPT Plus theo nhóm — chia sẻ chi phí và bán lại với margin 30-50%. MonetAI SaaS Marketplace là nơi hoàn hảo để bắt đầu.</p>

<h2>9. Viết ebook/khóa học về AI</h2>
<p>Đóng gói kiến thức thành ebook (99k-499k) hoặc khóa học video (299k-2 triệu). Bán mãi mãi, không tốn thêm công sức.</p>

<h2>10. Freelance AI Consultant</h2>
<p>Tư vấn chiến lược AI cho doanh nghiệp — charge 500k-2 triệu/giờ. Thị trường này đang thiếu người giỏi trầm trọng tại Việt Nam.</p>

<h2>Bắt đầu từ đâu?</h2>
<p>Gợi ý: Chọn 1-2 cách phù hợp nhất với kỹ năng hiện tại. Đừng làm nhiều cách cùng lúc. Tập trung 90 ngày đầu để có kết quả rõ ràng trước khi mở rộng.</p>
<p>MonetAI cung cấp đầy đủ công cụ cho cả 10 cách trên — từ Affiliate Marketplace, Prompt Marketplace, Agent Marketplace đến Content Generator và Academy.</p>
    `,
  },

  {
    slug:        "kiem-them-8-trieu-thang-nho-monetai",
    title:       "Mình đã kiếm thêm 8 triệu/tháng nhờ MonetAI",
    excerpt:     "Quy trình thật, từ ngày đầu dùng đến khi có thu nhập ổn định. Không có màu hồng, không tô vẽ — chỉ là những gì thực sự xảy ra.",
    category:    "Case Study",
    readTime:    7,
    publishedAt: "2026-06-15",
    featured:    true,
    tags:        ["case study", "affiliate", "thu nhập thực tế", "MonetAI"],
    content: `
<h2>Mình là ai?</h2>
<p>Tên mình là Đức, 28 tuổi, nhân viên marketing tại một công ty SME ở Hà Nội. Thu nhập chính khoảng 12 triệu/tháng. Mình không phải dân kỹ thuật, không biết code, không có kinh nghiệm Affiliate trước đó.</p>

<h2>Tháng 1: Bắt đầu và thất vọng</h2>
<p>Mình đăng ký MonetAI gói Creator (199k/tháng) vào đầu tháng 1. Tuần đầu thử tạo content, kết quả tệ — bài viết AI nghe rất "robot", không ai click link.</p>

<p>Thu nhập tuần đầu: <strong>0₫</strong>.</p>

<p>Nhưng thay vì bỏ cuộc, mình dành 3 ngày xem lại các bài hướng dẫn trong MonetAI Academy và học cách viết prompt tốt hơn. Đây là turning point.</p>

<h2>Tháng 1 (nửa sau): Tìm được công thức</h2>
<p>Mình đổi chiến lược: thay vì viết tổng quát, tập trung vào một niche hẹp — "AI tools cho người làm marketing Việt Nam". Dùng MonetAI Affiliate Marketplace tìm các tool có hoa hồng cao và phù hợp với niche.</p>

<p>Sản phẩm đầu tiên mình promote: Jasper (30% hoa hồng, ~$150/sale).</p>

<p>Kết quả cuối tháng 1: <strong>2 sale = 1.9 triệu₫</strong></p>

<h2>Tháng 2: Scale từ từ</h2>
<p>Mình giữ nguyên quy trình: mỗi ngày tạo 2-3 bài content bằng MonetAI Content Generator, đăng lên Facebook group Marketing và TikTok. Không quảng cáo trả phí.</p>

<p>Mình thêm 3 sản phẩm nữa: Claude Pro, Canva Pro, và CapCut Pro.</p>

<p>Kết quả tháng 2: <strong>5.3 triệu₫</strong></p>

<h2>Tháng 3: Đạt 8 triệu và ổn định</h2>
<p>Điểm then chốt của tháng 3: mình bắt đầu build email list. Tạo lead magnet là ebook "7 AI tools miễn phí cho Marketer" — dùng MonetAI tạo trong 2 giờ. 847 người đăng ký trong 30 ngày.</p>

<p>Email list chuyển đổi tốt hơn social media rất nhiều. CTR ~12% vs ~1.5% của Facebook posts.</p>

<p>Kết quả tháng 3: <strong>8.2 triệu₫</strong></p>

<h2>Bài học quan trọng nhất</h2>
<ol>
<li><strong>Niche hẹp thắng niche rộng.</strong> "AI tools cho marketer" tốt hơn "AI tools nói chung".</li>
<li><strong>Email list quan trọng hơn followers.</strong> 847 email subscribers đem lại nhiều doanh thu hơn 5.000 Facebook followers.</li>
<li><strong>MonetAI tiết kiệm 80% thời gian tạo content.</strong> Thay vì 3 giờ/bài, giờ mình chỉ mất 30-45 phút kể cả review và chỉnh sửa.</li>
</ol>

<h2>Hiện tại (tháng 6)</h2>
<p>Thu nhập affiliate ổn định 8-10 triệu/tháng. Mình vừa nâng lên gói Pro (499k/tháng) và đang thử nghiệm bán prompt trên Marketplace. Mục tiêu đến cuối năm: 20 triệu/tháng từ AI affiliate.</p>
    `,
  },

  {
    slug:        "monetai-vs-cong-cu-ai-kiem-tien-khac",
    title:       "MonetAI vs các công cụ AI kiếm tiền khác: Nên chọn gì?",
    excerpt:     "Bảng so sánh chi tiết về tính năng, giá, và hiệu quả thực tế giữa MonetAI và các nền tảng AI commerce phổ biến tại Việt Nam.",
    category:    "So sánh",
    readTime:    9,
    publishedAt: "2026-06-10",
    featured:    true,
    tags:        ["so sánh", "MonetAI", "AI tools", "review"],
    content: `
<h2>Tại sao cần so sánh?</h2>
<p>Thị trường "AI kiếm tiền" đang rất hot, kéo theo hàng chục nền tảng ra đời. Không phải tất cả đều chất lượng. Bài này sẽ giúp bạn phân biệt và chọn đúng.</p>

<h2>Tiêu chí so sánh</h2>
<ul>
<li>Breadth: Có đủ dịch vụ để kiếm tiền từ nhiều nguồn không?</li>
<li>Affiliate Program: Hoa hồng bao nhiêu? Thanh toán như thế nào?</li>
<li>AI Content Quality: Nội dung tạo ra có dùng được không?</li>
<li>Marketplace: Có nhiều sản phẩm để bán/mua không?</li>
<li>Hỗ trợ Tiếng Việt: UX có phù hợp người Việt không?</li>
<li>Giá: Chi phí có tương xứng với giá trị?</li>
</ul>

<h2>MonetAI</h2>
<p>Nền tảng All-in-One: Affiliate Marketplace, AI Content Generator, Agent Marketplace, Prompt Marketplace, SaaS Marketplace, Automation Builder và Academy — tất cả trong một.</p>
<p>✅ Hoa hồng 30-50% từ hàng nghìn AI products<br/>
✅ AI Content Generator tối ưu cho tiếng Việt<br/>
✅ 1.000+ AI Agent và 500+ Prompt có sẵn<br/>
✅ Dashboard real-time theo dõi doanh thu<br/>
✅ Thanh toán VietQR/Ngân hàng nội địa<br/>
❌ Chưa có mobile app riêng</p>

<h2>ClickBank (quốc tế)</h2>
<p>Marketplace affiliate lớn nhất thế giới nhưng chủ yếu sản phẩm quốc tế, thanh toán USD, ngôn ngữ Anh.</p>
<p>✅ Hàng chục nghìn sản phẩm<br/>
✅ Hoa hồng cao (50-75%)<br/>
❌ Không có AI Content Generator<br/>
❌ Thanh toán mất phí chuyển đổi ngoại tệ<br/>
❌ Audience Việt Nam khó convert vì sản phẩm không local<br/>
❌ Không có Marketplace AI agents/prompts</p>

<h2>AccessTrade Việt Nam</h2>
<p>Nền tảng affiliate lớn nhất Việt Nam, tập trung vào e-commerce và tài chính.</p>
<p>✅ Nhiều brand Việt Nam lớn<br/>
✅ Thanh toán nội địa dễ<br/>
❌ Không có AI tools/products<br/>
❌ Không có AI Content Generator<br/>
❌ Hoa hồng thấp hơn (5-15%)</p>

<h2>Kết luận</h2>
<p>Nếu bạn muốn kiếm tiền từ AI products với công cụ AI hỗ trợ, MonetAI là lựa chọn số 1 tại Việt Nam hiện tại. Không có nền tảng nào khác cung cấp ecosystem đầy đủ như vậy cho thị trường Việt.</p>
<p>Nếu bạn muốn làm affiliate cho e-commerce truyền thống → AccessTrade. Nếu muốn target audience quốc tế → ClickBank + MonetAI kết hợp.</p>
    `,
  },

  {
    slug:        "5-cong-cu-ai-moi-thang-6-2026",
    title:       "5 công cụ AI mới đáng chú ý tháng 6/2026",
    excerpt:     "Tổng hợp nhanh những cập nhật quan trọng nhất trong tháng — từ model mới đến tính năng breakthrough, lọc ra những gì thực sự đáng để dùng.",
    category:    "Xu hướng",
    readTime:    5,
    publishedAt: "2026-06-08",
    featured:    true,
    tags:        ["AI news", "xu hướng", "tools mới", "tháng 6 2026"],
    content: `
<h2>Tóm tắt tháng 6/2026</h2>
<p>Tháng 6 không có "big bang" như Claude 4 hay GPT-5, nhưng có nhiều cập nhật quan trọng ảnh hưởng trực tiếp đến người dùng AI kiếm tiền. Đây là 5 điều đáng chú ý nhất.</p>

<h2>1. Claude 3.7 Sonnet — Nhanh hơn, rẻ hơn 30%</h2>
<p>Anthropic vừa ra model mới với tốc độ xử lý tăng 2x và giá API giảm 30% so với 3.5. Đây là tin tốt cho ai đang dùng Claude API để build AI Agent hay automation.</p>
<p><strong>Tác động:</strong> Chi phí vận hành AI Agent giảm, margin cải thiện nếu bạn đang bán AI services.</p>

<h2>2. ChatGPT Voice Mode — Bán hàng qua giọng nói</h2>
<p>ChatGPT Voice Mode 2.0 có thể xử lý cuộc gọi bán hàng real-time với latency dưới 500ms. Một số doanh nghiệp đã test thay thế telesales — conversion rate tương đương 60-70% so với người thật.</p>
<p><strong>Cơ hội:</strong> Build và bán AI Voice Agent cho SME Việt Nam — thị trường chưa ai khai phá.</p>

<h2>3. Midjourney V7 — Ảnh sản phẩm chuyên nghiệp</h2>
<p>V7 với tính năng Product Photography: chụp ảnh sản phẩm thật, AI thay background, thêm context — chất lượng studio nhưng chi phí gần bằng 0.</p>
<p><strong>Cơ hội:</strong> Dịch vụ ảnh sản phẩm AI cho shop Tiki/Shopee — charge 50-200k/sản phẩm thay vì thuê photographer.</p>

<h2>4. Canva AI — Thiết kế từ brief văn bản</h2>
<p>Canva Magic Studio update: từ brief tiếng Việt → tự động tạo full campaign design (banner, post, story, email template). Không cần designer.</p>
<p><strong>Tác động:</strong> Ai đang làm freelance design cần nâng cấp kỹ năng AI ngay, hoặc scale output lên 5-10x.</p>

<h2>5. TikTok AI Studio — Tạo video không cần quay</h2>
<p>TikTok ra AI Avatar Creator: bạn nhập script tiếng Việt, AI tạo video với avatar người Việt tự nhiên. Không cần lộ mặt, không cần quay.</p>
<p><strong>Cơ hội:</strong> Nhân video TikTok lên 10x mà không tốn thêm thời gian. Affiliate marketing trên TikTok sẽ dễ hơn nhiều.</p>

<h2>Kết luận tháng 6</h2>
<p>Trend lớn: AI đang chuyển từ "text tools" sang "business operations" — voice sales, visual production, video creation tự động. Cơ hội kiếm tiền không phải ở việc "dùng AI" mà là "triển khai AI cho người khác".</p>
    `,
  },

  {
    slug:        "huong-dan-bat-dau-affiliate-ai-khong-co-von",
    title:       "Hướng dẫn bắt đầu AI Affiliate không cần vốn — từng bước chi tiết",
    excerpt:     "Quy trình 7 bước để bắt đầu kiếm tiền từ AI Affiliate ngay hôm nay, không cần đầu tư ban đầu. Phù hợp cho người hoàn toàn mới.",
    category:    "Hướng dẫn",
    readTime:    10,
    publishedAt: "2026-06-05",
    featured:    false,
    tags:        ["affiliate", "beginner", "không cần vốn", "hướng dẫn"],
    content: `
<h2>Bạn có thực sự cần vốn không?</h2>
<p>Câu trả lời ngắn gọn: Không. Hầu hết các chương trình AI Affiliate đều miễn phí để tham gia. Bạn chỉ cần: thiết bị để tạo nội dung (điện thoại hoặc laptop), tài khoản mạng xã hội, và thời gian.</p>

<p>Tất nhiên, có tài khoản MonetAI Creator (199k/tháng) sẽ giúp bạn tạo content nhanh hơn 5-10 lần — nhưng bạn vẫn có thể bắt đầu không mất đồng nào.</p>

<h2>Bước 1: Chọn niche hẹp</h2>
<p>Đừng cố promote tất cả AI tools cho tất cả mọi người. Chọn một nhóm cụ thể:</p>
<ul>
<li>AI tools cho giáo viên</li>
<li>AI tools cho freelancer thiết kế</li>
<li>AI tools cho chủ shop online</li>
<li>AI tools cho người làm HR</li>
</ul>
<p>Niche hẹp = ít cạnh tranh + dễ build trust + conversion cao hơn.</p>

<h2>Bước 2: Đăng ký chương trình Affiliate</h2>
<p>Trên MonetAI Affiliate Marketplace, bạn có thể lấy link affiliate của hàng nghìn AI tools trong vài phút. Ưu tiên chọn:</p>
<ul>
<li>Hoa hồng từ 20% trở lên</li>
<li>Sản phẩm recurring (thanh toán hàng tháng)</li>
<li>Sản phẩm bạn thực sự đã dùng hoặc hiểu rõ</li>
</ul>

<h2>Bước 3: Tạo tài khoản phân phối</h2>
<p>Chọn 1-2 kênh ban đầu, đừng dàn trải:</p>
<ul>
<li><strong>Facebook Group:</strong> Join các group AI/kiếm tiền online và contribute value</li>
<li><strong>TikTok:</strong> Video ngắn 30-60 giây review AI tools</li>
<li><strong>Blog/Substack:</strong> Viết review chi tiết, SEO dài hạn</li>
</ul>

<h2>Bước 4: Tạo content giá trị, không chỉ bán hàng</h2>
<p>Rule of thumb: 80% content educate, 20% content convert. Người ta mua từ ai họ tin tưởng, không phải từ ai quảng cáo nhiều nhất.</p>

<h2>Bước 5: Tracking và tối ưu</h2>
<p>MonetAI cung cấp dashboard real-time: click, conversion, revenue theo từng link, từng platform. Sau 30 ngày, xem cái gì work và double down.</p>

<h2>Bước 6: Build email list ngay từ đầu</h2>
<p>Tạo lead magnet đơn giản (checklist, template, mini-guide) và offer miễn phí để thu email. Email list là tài sản lâu dài nhất bạn có thể xây dựng.</p>

<h2>Bước 7: Mở rộng và tự động hóa</h2>
<p>Khi đã có income ổn định từ 1-2 nguồn, dùng MonetAI Automation Builder để tự động hóa: lên lịch content, email sequence, follow-up. Đây là lúc income trở thành thụ động thực sự.</p>
    `,
  },

  {
    slug:        "prompt-engineering-ban-hang-chatgpt",
    title:       "Prompt Engineering để viết content bán hàng với ChatGPT — 20 template thực chiến",
    excerpt:     "20 prompt template copy-paste được ngay, được test bởi đội ngũ MonetAI với tỷ lệ chuyển đổi thực tế. Không cần kinh nghiệm AI.",
    category:    "Hướng dẫn",
    readTime:    8,
    publishedAt: "2026-05-28",
    featured:    false,
    tags:        ["prompt", "ChatGPT", "content", "bán hàng", "template"],
    content: `
<h2>Tại sao 90% người dùng ChatGPT cho content không hiệu quả?</h2>
<p>Vì họ prompt sai. "Viết bài về AI" → kết quả tệ. "Viết review ChatGPT-4 cho marketer 35 tuổi muốn tăng năng suất, theo format AIDA, 500 từ, tone chuyên nghiệp nhưng dễ hiểu" → kết quả tốt.</p>

<p>Sự khác biệt là ở <strong>specificity</strong> — càng cụ thể, kết quả càng tốt.</p>

<h2>Framework: RACE</h2>
<ul>
<li><strong>R</strong>ole: Gán vai cho AI ("Bạn là copywriter 10 năm kinh nghiệm...")</li>
<li><strong>A</strong>udience: Mô tả rõ target audience</li>
<li><strong>C</strong>ontext: Cung cấp context cụ thể về sản phẩm/dịch vụ</li>
<li><strong>E</strong>xecution: Format, độ dài, tone, CTA mong muốn</li>
</ul>

<h2>20 Template Thực Chiến</h2>

<h3>1. Facebook Post Bán Hàng</h3>
<pre>Bạn là copywriter affiliate marketing chuyên về AI tools. Viết 1 Facebook post bán [tên sản phẩm] cho [target audience]. Theo format: Hook mạnh (1 câu, đặt câu hỏi hoặc pain point) → Body (3 lợi ích cụ thể) → Social proof (1-2 câu) → CTA rõ ràng. Tone: thân thiện, không aggressive. 200-250 từ.</pre>

<h3>2. TikTok Script 60 giây</h3>
<pre>Viết script TikTok 60 giây review [tên AI tool] cho [audience]. Cấu trúc: Hook 3 giây gây tò mò → Problem (10 giây) → Solution: cách tool giải quyết (30 giây, 3 điểm cụ thể) → CTA (10 giây). Dùng ngôn ngữ nói, không văn viết.</pre>

<h3>3. Email Marketing Subject Line</h3>
<pre>Tạo 10 subject line email marketing cho chiến dịch quảng bá [tên tool]. Audience: [mô tả]. Mỗi subject line dùng một kỹ thuật khác nhau: curiosity, urgency, social proof, benefit-driven, question, number, negative, personal, news, fear of missing out.</pre>

<p>... và 17 template khác trong bộ tài liệu đầy đủ trên MonetAI Academy.</p>

<h2>Mẹo nâng cao: Iterate nhanh</h2>
<p>Đừng chỉ dùng kết quả đầu tiên. Sau lần đầu, prompt: "Cái trên tốt nhưng [X]. Hãy rewrite với [điều chỉnh cụ thể]." Thường lần 2-3 mới cho ra kết quả tốt nhất.</p>
    `,
  },

  {
    slug:        "ai-content-creator-vs-nhan-vien-triendong",
    title:       "AI Content Creator vs Nhân viên Content: Cái nào hiệu quả hơn cho SME?",
    excerpt:     "So sánh chi phí, chất lượng và tốc độ thực tế sau 3 tháng test. Kết quả bất ngờ hơn bạn nghĩ.",
    category:    "So sánh",
    readTime:    6,
    publishedAt: "2026-05-20",
    featured:    false,
    tags:        ["AI content", "so sánh", "SME", "chi phí"],
    content: `
<h2>Bối cảnh thử nghiệm</h2>
<p>Chúng tôi theo dõi 2 doanh nghiệp SME trong 3 tháng: một dùng nhân viên content toàn thời gian (10 triệu/tháng), một dùng MonetAI + 1 người review part-time (2.5 triệu/tháng bao gồm tool fee).</p>

<h2>Kết quả về Volume</h2>
<p>Team AI: 45 bài/tháng (15 FB post + 20 short-form + 10 email)<br/>
Team người: 18 bài/tháng (cùng loại content)</p>
<p>AI thắng 2.5 lần về volume.</p>

<h2>Kết quả về Chất lượng</h2>
<p>Đây là chỗ thú vị. Chúng tôi cho 50 người test không biết bài nào do AI viết — tỷ lệ "nhận ra AI" chỉ là 42%, nghĩa là không tốt hơn random guess.</p>
<p>Engagement rate: AI 4.2% vs Người 5.8% — người vẫn thắng về chất lượng cảm xúc và storytelling cá nhân.</p>

<h2>Kết quả về Chi phí</h2>
<p>Chi phí/bài: AI = 56k, Người = 556k. AI rẻ hơn 10 lần.</p>

<h2>Kết luận thực tế</h2>
<p>AI không thay thế người làm content — nó làm cho 1 người có thể làm việc của 5 người. Mô hình tốt nhất: 1 Content Strategist giỏi + MonetAI = output của cả team content truyền thống, với 1/3 chi phí.</p>
    `,
  },

  {
    slug:        "gpt-5-va-co-hoi-kiem-tien-moi",
    title:       "GPT-5 sắp ra — Những cơ hội kiếm tiền mới nào sẽ xuất hiện?",
    excerpt:     "Phân tích các khả năng của GPT-5 và cách người làm AI affiliate/content nên chuẩn bị để đón đầu xu hướng tiếp theo.",
    category:    "Xu hướng",
    readTime:    7,
    publishedAt: "2026-05-15",
    featured:    false,
    tags:        ["GPT-5", "OpenAI", "xu hướng", "cơ hội"],
    content: `
<h2>GPT-5 sẽ có gì khác?</h2>
<p>Theo các leak và thông tin chính thức từ OpenAI, GPT-5 sẽ có: multimodal mạnh hơn nhiều (xử lý video, audio, document phức tạp), reasoning tốt hơn 3-5x, context window dài hơn (có thể đọc cả cuốn sách), và self-improvement capability (tự cải thiện trong quá trình dùng).</p>

<h2>3 Cơ Hội Kiếm Tiền Cụ Thể</h2>

<h3>1. AI Video Analysis Service</h3>
<p>GPT-5 có thể xem video và extract insights. Cơ hội: dịch vụ phân tích video TikTok của đối thủ cho SME — "Gửi tôi 20 video viral nhất trong niche của bạn, tôi sẽ dùng AI phân tích formula thành công và viết script cho bạn" — charge 2-5 triệu/tháng.</p>

<h3>2. Document Intelligence Service</h3>
<p>Upload hợp đồng, báo cáo tài chính, pitch deck — GPT-5 phân tích và đưa ra insight. Dịch vụ này hiện chỉ có ở công ty tư vấn lớn, charge 20-50 triệu/project. Với GPT-5, freelancer có thể cung cấp dịch vụ tương tự với 1/5 giá.</p>

<h3>3. Personal AI Business Consultant</h3>
<p>GPT-5 có thể "học" từ toàn bộ data của một doanh nghiệp và trở thành consultant ảo. Build và bán "AI Advisor" custom cho từng SME — recurring revenue mô hình SaaS.</p>

<h2>Chuẩn bị gì ngay bây giờ?</h2>
<p>Học prompt engineering nâng cao. Build portfolio case study. Chuẩn bị kỹ năng "AI + Domain expertise" — sự kết hợp giữa kiến thức chuyên ngành và AI skill mới là thứ thị trường sẵn sàng trả tiền cao nhất.</p>
    `,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(cat: Category): BlogPost[] {
  return posts.filter((p) => p.category === cat);
}

export function getFeaturedPosts(): BlogPost[] {
  return posts.filter((p) => p.featured);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", { day: "numeric", month: "short", year: "numeric" });
}
