# Tuệ Trầm - Frontend (CLAUDE.md)

Hướng dẫn nội bộ cho AI/dev khi làm việc trong repo này. Đọc file này trước khi sửa cấu trúc, thêm thư viện, hoặc động vào biến môi trường.

## 1. Bối cảnh dự án

Website bán hàng quy mô nhỏ cho Hộ Kinh Doanh **Tuệ Trầm** — trầm hương / nhang trầm tự nhiên từ Đà Lạt.

- **Frontend (repo này):** React + Vite, UI library **Ant Design (antd)**.
- **Backend:** Node.js + Express.js (repo riêng), giao tiếp qua REST API.
- Cấu trúc thư mục tham khảo theo repo [Sang-Truong20/FE-Horseracing](https://github.com/Sang-Truong20/FE-Horseracing) (React + Vite), điều chỉnh lại để dùng AntD thay vì Tailwind.
- Có **một** ứng dụng React duy nhất, responsive — không tách hai app desktop/mobile riêng. Ranh giới chuyển layout: `768px` (`MOBILE_BREAKPOINT` trong `src/constants/theme.js`, dùng `antd Grid.useBreakpoint` qua hook `src/hooks/useIsMobile.js`).
- **Quy tắc bắt buộc:** mỗi khi sửa/thêm UI cho desktop thì phải chỉnh responsive cho Mobile trong cùng lúc (dùng `useIsMobile()` hoặc CSS breakpoint tương ứng) — không để riêng thành việc làm sau, tránh phải quay lại rà soát toàn bộ UI để bổ sung mobile sau này.

## 2. Giao diện & theme — trang khách hàng là DARK THEME

**Nguồn sự thật duy nhất cho giao diện trang khách hàng là file mockup gốc `Tue Tram - Standalone.html`** (export từ Claude Design, chủ dự án gửi trực tiếp). Khi cần biết màu/spacing/bố cục thật, đọc CSS variables (`--color-*`, `--space-*`, `--radius-*`, `--font-*`) và markup trong chính file đó — **không suy đoán / không tự vibe màu**. File `Tue Tram Mobile - Standalone.html` (bản mobile) được nhắc tới nhưng **chưa được gửi vào repo này** — phần mobile hiện là suy luận hợp lý từ bản desktop, chưa verify.

- **Toàn bộ trang khách hàng (MainLayout: Header, Home, Products, Cart, Blog, Checkout...) là nền TỐI**, không phải nền sáng: nền = `colors.textDark2` (`--color-neutral-900`, `#2e2b25`), chữ chính = `colors.bgCreamAlt` (`--color-neutral-100`, `#f9f4ed`). Đây là phát hiện quan trọng ngày 2026-08-05 sau khi đọc trực tiếp file mockup — **không được quay lại theme sáng** cho khu vực này.
- **Khu vực `/admin/*` KHÔNG đổi, vẫn nền sáng** — mockup chỉ vẽ trang khách hàng, không có màn Admin, nên không có căn cứ để đổi Admin sang tối. Xử lý bằng 2 theme antd tách biệt (xem `src/constants/theme.js`):
  - `antdTheme` — theme sáng gốc, đặt ở root `<ConfigProvider>` trong `main.jsx`, áp dụng mặc định cho cả app (kể cả `/admin/*`).
  - `storefrontTheme` — theme tối (`algorithm: theme.darkAlgorithm` của antd + token màu riêng), chỉ bọc bên trong `MainLayout.jsx` bằng một `<ConfigProvider theme={storefrontTheme}>` lồng bên trong. Nhờ vậy Modal/Drawer/Table/Input... ở trang khách hàng tự động tối, còn Admin không bị ảnh hưởng.
  - Khi thêm section/trang mới cho trang khách hàng: mặc định sẽ tối do nằm trong `MainLayout`. Khi thêm UI cho Admin: mặc định sáng do nằm ngoài `MainLayout`, trong `AdminLayout`.
- **Font bắt buộc: Baloo 2 (heading, weight 600) + Be Vietnam Pro (body) — KHÔNG dùng lại Caprasimo/Figtree.** Mockup gốc định dùng Caprasimo/Figtree nhưng chính file đó tự có 1 đoạn CSS override kèm comment "Caprasimo/Figtree thiếu bộ dấu tiếng Việt — thay bằng font hỗ trợ vietnamese, giữ nguyên token", vì trên Google Fonts hai font đó **chỉ có subset `latin` + `latin-ext`, không có subset `vietnamese`** — chữ có dấu (ệ, ầ, ộ, ữ,...) bị trình duyệt fallback sang font hệ thống, nhìn vỡ/lệch font. Baloo 2 và Be Vietnam Pro có đầy đủ subset `vietnamese`. Khai báo ở 2 chỗ, sửa đồng bộ cả hai nếu đổi font: `index.html` (link Google Fonts) và `src/constants/theme.js` (`fontFamily`).
- **`index.html` KHÔNG được để comment** (yêu cầu chủ dự án 2026-08-07): Vite giữ nguyên file này khi build, ai bấm "View source" cũng đọc được — không nên để lộ ghi chú nội bộ (đường dẫn `src/`, lý do kỹ thuật, tên file mockup). Mọi giải thích về `index.html` viết ở đây thay vì viết trong file:
  - **Favicon**: bộ `favicon-32.png` / `favicon.ico` / `apple-touch-icon.png` trong `public/` tạo từ `src/assets/images/logo.png` (logo thật chủ shop gửi). Trước 2026-08-07 là file `favicon.svg` vẽ tạm nên tab trình duyệt hiện icon lạ — file đó đã xoá.
  - **Link Google Fonts**: lý do chọn Baloo 2 + Be Vietnam Pro xem ngay gạch đầu dòng phía trên.
- **Bảng màu** (`colors` trong `src/constants/theme.js`): mỗi token có comment ghi rõ tên biến CSS gốc trong mockup (vd `brandOrange` = `--color-accent`, `neutral800` = `--color-neutral-800`) — khi cần thêm màu mới, ưu tiên đọc thêm từ mockup rồi đặt tên theo đúng quy ước đó thay vì bịa hex mới.
- **Đã dựng lại chính xác 1:1 theo mockup** (đọc trực tiếp markup + CSS, ghi rõ trong comment code):
  - `Header.jsx` — nav trái / **logo ảnh 46px + chữ "Tuệ Trầm" + "TRẦM HƯƠNG ĐÀ LẠT"** ở giữa / Liên hệ + Giỏ hàng phải, sticky + blur. (Mockup có CẢ ảnh logo LẪN chữ — có lúc đã gỡ nhầm phần chữ, đã trả lại ngày 2026-08-06.)
  - `Home/index.jsx` — Hero, khối "Tuệ Trầm cung cấp gì?", khối "Người sáng lập" (ảnh tròn 250px + tag + câu trích + nút).
  - `ProductCarousel.jsx` — khối "Sản phẩm" trên Home: carousel cuộn ngang, thẻ nằm ngang 480px, ảnh trái 150px, nút prev/next tròn 42px, filter pill danh mục.
  - `Blog/Founder.jsx` (trang `/nguoi-sang-lap`) — 3 section: hero ảnh 3/4 + figcaption, thẻ bài viết nền kem (2 mục + blockquote + ảnh trà đàm), CTA cuối trang.
  - `TrustBadges.jsx`.
  - `Footer.jsx` — grid 1.2fr/1fr/1fr, logo tròn 58px + tagline, cột Địa chỉ có icon ghim, cột Liên hệ, dòng bản quyền căn giữa, nền gradient `--color-accent-900` 26%.
  - `Cart/index.jsx` (trang `/gio-hang`) — **prototype gộp giỏ hàng + thanh toán vào chung 1 màn**, không có trang thanh toán riêng. `pages/Checkout/index.jsx` đã xoá, route `/thanh-toan` chuyển hướng về `/gio-hang`.
- **Nội dung chữ lấy nguyên văn từ mockup**: object `founder` trong `src/data/posts.js` (toàn bộ câu chữ trang giới thiệu). **Không tự viết lại/rút gọn**, muốn đổi phải hỏi chủ shop.
- **Độ bo góc:** mockup dùng `--radius-md` = 16px cho nút/ô. Theo yêu cầu chủ dự án ngày 2026-08-06 ("làm mấy cái ô đó mềm mại xíu"), **nút bấm được bo tròn hẳn (999px)** — mềm hơn mockup một chút, có chủ đích; ô nhập/thẻ vẫn giữ 16px đúng mockup (token `borderRadius` trong `storefrontTheme` đã đổi 10 → 16).
  - `Header.jsx` — **mega-menu "Sản phẩm"** sổ từ header xuống (khối `menuOpen`): nền kem `--color-bg`, bo góc dưới 32.2px, danh sách danh mục chữ 23px + nhóm "Có thể bạn quan tâm" 19px, nút X đóng. Chọn danh mục → điều hướng `/san-pham?danh-muc=<id>` (ProductList đọc query này qua `useSearchParams`, nên link chia sẻ mở đúng danh mục).
  - `ContactWidget.jsx` — nút "Liên hệ" nổi góc phải dưới (KHÔNG có trong mockup, thêm theo yêu cầu chủ dự án 2026-08-07). Thu gọn = 1 nút "Liên hệ"; bấm vào sổ ra 3 nút dọc: **Zalo** (mở `https://zalo.me/<số>`, dùng logo Zalo thật chủ shop gửi — `src/assets/images/zalo.png`), **Gọi điện** (`tel:` quay số trực tiếp), và **X** để thu gọn lại. Đặt trong `MainLayout` nên có ở mọi trang khách hàng, không có ở `/admin`.
  - `Blog/BlogList.jsx` (trang `/bai-viet`) — breadcrumb uppercase, h1 40px, mô tả 56ch, lưới thẻ ảnh vuông + "Chuyên mục | ngày" + tiêu đề 19px + excerpt.
- **CHƯA dựng lại theo mockup** (markup CÓ trong file mockup nhưng chưa trích xuất — hiện chỉ là bản cũ đổi màu cho đọc được trên nền tối, KHÔNG khớp bố cục thật):
  - Khối "Bài viết" trên Home; các trang `/bai-viet/*` (chi tiết bài), `/san-pham`, `/san-pham/*` (tương ứng nhánh `isPost`, `isProducts`, `isProduct` trong file mockup).
  - Ở **bản mobile**: trang chi tiết sản phẩm (`isProduct`), danh sách/chi tiết bài viết (`isBlog`, `isPost`), giới thiệu (`isAbout`), giỏ hàng (`isCart`) — hiện mới dựng xong **trang chủ** (`HomeMobile.jsx`) và **danh sách sản phẩm** (`ProductListMobile.jsx`).
- Khi cần khớp tiếp các phần "CHƯA dựng lại" ở trên: yêu cầu chủ dự án gửi thêm phần tương ứng của file mockup (hoặc trỏ đúng đoạn trong file đã gửi), đọc trực tiếp CSS/markup như đã làm với Header/Hero — không đoán.

## 2a. Responsive: mobile có bố cục RIÊNG, không phải desktop thu nhỏ

**Nguồn sự thật cho mobile là file `Tue Tram Mobile - Standalone.html`** (chủ dự án gửi 2026-08-07 — trước đó chưa có nên phần mobile chỉ là suy luận; nay đã dựng theo file thật).

Nguyên tắc: **một app duy nhất, chung route / service / theme / data — chỉ phần hiển thị đổi theo `useIsMobile()`** (breakpoint 768px). Không tách thành app mobile riêng.

- `pages/Home/index.jsx` tải `products` / `categories` / `posts` **một lần**, rồi:
  - Desktop: render hero 2 cột + `ProductCarousel` + khối người sáng lập…
  - Mobile: `if (isMobile) return <HomeMobile products={...} categories={...} posts={...} />` — bố cục theo mockup mobile: hero là thẻ ảnh 190px có lớp phủ gradient + tiêu đề đè lên, 3 ô tin cậy lưới 3 cột, hàng tiêu đề + nút "TẤT CẢ" bo tròn, sản phẩm/bài viết cuộn ngang (thẻ 160px / 220px), thẻ người sáng lập nền `neutral-800` bo 24px.
- `pages/Products/ProductList.jsx` cũng theo đúng khuôn đó: tải dữ liệu + giữ state danh mục (trên URL `?danh-muc=`), rồi `if (isMobile) return <ProductListMobile products={filtered} categories={...} activeCat={...} onPickCat={...} />`. Bố cục theo nhánh `isCatalog` của mockup mobile: khung `padding:0 18px 24px` gap 14px, tiêu đề font-heading 24px (KHÔNG có dòng eyebrow — bản cũ dùng `SectionTitle` nên hiện chữ "Sản phẩm" 2 lần), hàng nút danh mục bo tròn cuộn ngang (thay antd `Tabs`), lưới `1fr 1fr` gap 14px, ảnh `aspect-ratio 1/1.05` bo 16px, tên 13px, giá 13.5px `accent-300`.
- `pages/Products/ProductDetail.jsx` → `ProductDetailMobile.jsx` (nhánh `isProduct` của mockup mobile): link "← Sản phẩm", ảnh `aspect-ratio 1/1` bo 24px, tên font-heading 21px, giá 22px `accent-300`, mô tả 13.5px, nút CTA block bo 999px, rồi tới tab Thông số/Cách dùng.
  - **Đây là bản vá một lỗi thật, không phải làm đẹp**: bản dùng chung với desktop bọc nội dung trong antd `<Row gutter={[32,24]}>`, mà `gutter` sinh `margin: 0 -16px` — đúng bằng `padding: 0 16px` của `.container` ở mobile, nên ảnh và chữ bị đẩy sát mép màn hình, nhìn như tràn ra ngoài (chủ dự án phản ánh 2026-08-07). Bản mobile bỏ hẳn Row/Col, tự đặt `padding: 0 18px`.
  - Mockup có dòng "4.9 ★" cạnh danh mục — **không dựng**, vì backend chưa có điểm đánh giá thật (tag Reviews mới khai báo, chưa có path). Không bịa số.
  - **Sai lệch có chủ đích so với mockup**: mockup dựng sẵn 6 sản phẩm nên lưới 2 cột lúc nào cũng cân; thực tế shop mới có 1 sản phẩm thì ô đó lọt nửa trái nhìn rất lệch (chủ dự án phản ánh 2026-08-07) — nên khi `products.length === 1` lưới chuyển về `1fr` cho sản phẩm chiếm trọn bề ngang.
- `Header.jsx` mobile: nút tròn 44px (mở menu) bên trái, logo + tên ở giữa, nút tròn 44px (Liên hệ) bên phải — đúng vị trí nút giỏ hàng trong mockup mobile.
  - **Nút ☰ mở CHÍNH mega-menu** giống hệt khi bấm "Sản phẩm" trên desktop (sửa 2026-08-07 theo yêu cầu chủ dự án). `Drawer` + `antd Menu` cũ **đã xoá** — nó dùng nền sáng mặc định của antd nên lạc hẳn theme tối, lại chỉ có 3 link, không có danh mục sản phẩm. Nay dùng chung một khối `menuOpen`, mobile chỉ khác: `max-height: 78vh` + cho cuộn, padding 18px, và class `.tt-mega-mobile` trong `global.css` thu cỡ chữ 23px→19px / 19px→16px.
- `MobileBottomNav.jsx` dựng theo mockup mobile: `space-around`, tab `flex:1` `min-height:44px`, icon 19px + nhãn 10px, màu chọn `--color-accent-300` / thường `--color-neutral-500`, dùng đúng path SVG trong file.

## 2b. Chế độ LANDING PAGE (`SHOP_MODE`) — quan trọng

Từ 2026-08-07 theo yêu cầu chủ dự án, website **chỉ là landing page giới thiệu, CHƯA bán hàng online**. Điều khiển bằng đúng **một cờ**: `export const SHOP_MODE = false` trong `src/components/layout/Header.jsx`.

Khi `SHOP_MODE = false`:

- `Header.jsx` ẩn nút **"Giỏ hàng"** và **"Đăng nhập"**; chỉ còn "Liên hệ" (trỏ sang `/lien-he`, không còn `tel:` trực tiếp).
- Mega-menu ẩn mục "Giỏ hàng & đặt hàng".
- `MobileBottomNav.jsx` thay tab "Giỏ hàng" bằng tab **"Liên hệ"**.
- `ProductCarousel.jsx` ẩn nút "+" thêm vào giỏ.
- `ProductDetail.jsx` thay ô số lượng + "Thêm vào giỏ hàng" bằng nút **"Liên hệ đặt trầm"** dẫn sang `/lien-he`.

**Toàn bộ code giỏ hàng / đăng nhập / thanh toán vẫn còn nguyên** (route `/gio-hang`, `CartContext`, `AuthModal`, `orderService`...) — chỉ ẩn lối vào. Muốn bật bán hàng lại: đổi `SHOP_MODE = true`, không cần viết lại gì.

### Lối đăng nhập khi `SHOP_MODE = false` — `/dang-nhap`

Ẩn nút "Đăng nhập" ở Header đã làm **mất luôn đường vào `/admin`**, vì trước đó đăng nhập CHỈ mở được bằng modal từ nút đó (chủ dự án phản ánh 2026-08-07). Nay có trang riêng:

- `src/pages/Auth/Login.jsx` — route **`/dang-nhap`** (alias `/login` chuyển hướng sang). Đặt **ngoài `MainLayout`** nên không có Header/Footer, tự bọc `ConfigProvider theme={storefrontTheme}`.
- **KHÔNG phụ thuộc `SHOP_MODE`** và **không có link nào trỏ tới** — khách vãng lai không thấy, chỉ ai biết địa chỉ mới vào.
- `RequireAdmin.jsx` khi chưa đăng nhập nay **chuyển hướng** sang `/dang-nhap` kèm `state.from` (trước đây chỉ hiện màn 403 với nút "Về trang chủ" → người dùng bị kẹt). Đăng nhập xong quay lại đúng trang đã định, mặc định `/admin`.

Trang `/lien-he` (`src/pages/Contact/index.jsx`) nằm **trong `MainLayout`** nên vẫn có Header + Footer. Nội dung xếp **theo chiều dọc, gói trong 1 khung hình** (`min-height: calc(100vh - 76px)`, canh giữa): hotline/Zalo → địa chỉ → giờ mở cửa → website, rồi 2 nút "Gọi điện" và "Chat Zalo".

## 3. Cấu trúc thư mục

```
tuetram-fe/
├── .env                # Biến môi trường thật, KHÔNG commit (xem mục 4)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── main.jsx           # Entry: ConfigProvider (theme antd SÁNG, root) + Router + AuthProvider + CartProvider
    ├── App.jsx             # Khai báo route (react-router-dom v6)
    ├── layouts/
    │   ├── MainLayout.jsx  # Header + Outlet + Footer (+ MobileBottomNav khi mobile) — trang khách hàng, tự bọc ConfigProvider theme TỐI riêng (xem mục 2)
    │   └── AdminLayout.jsx # Sidebar + Outlet — riêng cho /admin/*, theme sáng, xem mục 8
    ├── components/
    │   ├── layout/          # Header, Footer, MobileBottomNav
    │   ├── common/           # SectionTitle, TrustBadges,...
    │   ├── product/          # ProductCard,...
    │   ├── auth/              # AuthModal (login/register tabs) — đăng nhập Google đã gỡ (2026-08-06)
    │   ├── admin/              # RequireAdmin (route guard) + *FormModal, ProductEditDrawer
    │   └── cart/              # (mở rộng khi cần)
    ├── pages/
    │   ├── Home/
    │   ├── Products/         # ProductList, ProductDetail
    │   ├── Blog/             # BlogList, BlogDetail, Founder (trang Người sáng lập)
    │   ├── Cart/
    │   ├── Checkout/         # Checkout + OrderSuccess
    │   ├── Admin/             # Dashboard, Products, Categories, Users, Blog — xem mục 8
    │   └── NotFound/
    ├── routes/                # (dự phòng nếu tách route config lớn hơn)
    ├── services/               # apiClient.js (axios) + *Service.js theo domain
    ├── store/                   # AuthContext.jsx, CartContext.jsx (Context + useReducer)
    ├── hooks/                    # useIsMobile.js, useAuth.js, useCart.js
    ├── constants/                 # theme.js (màu, font, antdTheme sáng + storefrontTheme tối)
    ├── utils/                      # format.js, pickList.js (parse list/total phòng khi response backend chưa rõ shape)
    ├── data/                       # Mock data (products.js, posts.js) — XOÁ khi có API thật
    └── assets/styles/global.css
```

Quy ước: mỗi domain nghiệp vụ (product, blog, cart, order) có page riêng trong `pages/`, gọi qua 1 file service tương ứng trong `services/`. Không gọi `axios` trực tiếp trong component.

## 4. Biến môi trường (.env)

File `.env` chứa giá trị thật, đã được thêm vào `.gitignore` — **không bao giờ commit hoặc dán vào chat/PR**. Dự án này **không** dùng `.env.example` (theo yêu cầu chủ dự án) — khi cần biết cần khai báo biến gì, xem danh sách dưới đây và tự tạo `.env` cục bộ.

| Biến | Mô tả |
|---|---|
| `VITE_API_BASE_URL` | Base URL của backend Express. Mặc định trỏ vào bản đã deploy `https://tue-tram.vercel.app/api` (đã test: CORS mở sẵn cho `localhost:5173`, `/api/products`, `/api/categories`, `/api/blog` trả dữ liệu thật). Đổi thành `http://localhost:3000/api` (khớp `PORT` trong `.env` backend) nếu bạn chạy backend local. |
| `VITE_API_KEY` | API key xác thực FE → BE, gắn vào header `X-API-Key` (xem `src/services/apiClient.js`) |
| `VITE_STORE_HOTLINE` | Số hotline/Zalo hiển thị ở Footer, trang sản phẩm, checkout |
| `VITE_STORE_ZALO` | Số Zalo (hiện dùng chung số với hotline). Dùng cho widget liên hệ nổi — `src/components/common/ContactWidget.jsx` bỏ hết dấu chấm rồi ghép thành `https://zalo.me/<số>` và `tel:<số>`. |

Lưu ý Vite: chỉ biến có tiền tố `VITE_` mới được bundle vào client — không đặt secret nhạy cảm (vd key backend-only, DB credentials) vào các biến này vì chúng sẽ lộ trong bundle JS. `VITE_API_KEY` ở đây chỉ nên là key công khai được phép lộ phía client (public/anon key); mọi secret thật sự nhạy cảm phải nằm ở backend, không đưa qua FE.

**Quan trọng:** file `.env` của backend (MongoDB URL, `JWT_SECRET`, `CLOUDINARY_URL` có API secret,...) **không bao giờ** được copy sang `.env` của FE dù dưới bất kỳ tên biến nào — kể cả đặt tên không có tiền tố `VITE_` cũng không an toàn vì rất dễ có người sau này đổi nhầm thành `VITE_` hoặc log nhầm ra client. Những giá trị đó chỉ nên tồn tại trong `.env` của repo backend.

**Đã gỡ (2026-08-06):** `VITE_GOOGLE_CLIENT_ID` và toàn bộ tính năng "Đăng nhập với Google" — chủ dự án yêu cầu bỏ vì thấy không cần thiết. `GoogleLoginButton.jsx` đã xoá, `authService.loginWithGoogle`/`AuthContext.loginWithGoogle` đã gỡ khỏi code. Form đăng nhập/đăng ký (email/username + mật khẩu) trong `AuthModal.jsx` không đổi.

## 5. State & data

- Đăng nhập/đăng ký: `src/store/AuthContext.jsx` (Context + `useState`), expose qua hook `useAuth()`. Nối vào backend thật qua `src/services/authService.js` (`/api/auth/*`, xem [api-docs](https://tue-tram.vercel.app/api-docs)). Token JWT + user được lưu ở `localStorage` (`src/constants/auth.js`) và `apiClient.js` tự gắn header `Authorization: Bearer <token>` cho mọi request tiếp theo.
  - UI: nút "Đăng nhập" ở góc phải `Header.jsx` mở `AuthModal` (tab Đăng nhập/Đăng ký, email hoặc username + mật khẩu). Khi đã đăng nhập, nút này đổi thành avatar + dropdown "Đăng xuất". Đăng nhập Google đã bị gỡ (2026-08-06, theo yêu cầu chủ dự án) — xem mục 4.
  - Response backend chưa có tài liệu chi tiết field `data` cho login/register; `AuthContext.jsx` đang quy ước `data = { user, token }` — nếu backend thật trả khác, chỉnh hàm `extractAuthPayload` trong file đó là đủ.
  - Còn thiếu: trang/quên đổi mật khẩu (`forgotPassword`/`resetPassword` đã có sẵn trong `authService.js` nhưng chưa có UI), trang hồ sơ cá nhân, và gate các trang cần đăng nhập (checkout, review...).
- Giỏ hàng: `src/store/CartContext.jsx` (React Context + `useReducer`), expose qua hook `useCart()`.
- **ĐÃ BỎ HOÀN TOÀN MOCK DATA (2026-08-06)** — `src/data/products.js` đã xoá, `mockPosts` trong `src/data/posts.js` đã xoá, cờ `USE_MOCK` đã bỏ. `productService`/`blogService` gọi thẳng API thật và **trả về MẢNG đã chuẩn hoá** (không phải envelope `{ status, message, data }`) để component không phải tự bóc tách. `src/data/posts.js` nay chỉ còn object `founder` — là **nội dung tĩnh** của trang giới thiệu (không có endpoint tương ứng), không phải mock data.
  - Chuẩn hoá trong `productService.normalizeProduct()`: `sku` ← `_id` (UI dùng sku trong URL/giỏ hàng), `image` ← `images[0]`, `category` ← id (nếu backend populate object thì tách thêm `categoryName`), `priceOnRequest` ép về boolean, `specs`/`usageSteps` ép về mảng.
  - Hình dạng response đã verify bằng curl: `/api/categories` → `data: []`; `/api/products` và `/api/blog` → `data: { items, total, page, limit, totalPages }`.
  - **DATABASE BACKEND ĐANG RỖNG** (0 danh mục, 0 sản phẩm, 0 bài viết — verify 2026-08-06). Nên trang Sản phẩm/Bài viết sẽ trống, và ô "Danh mục" trong form thêm sản phẩm cũng trống — **không phải bug FE**. Chủ shop phải vào `/admin/danh-muc` tạo danh mục trước, rồi mới thêm được sản phẩm.
- Đặt hàng: `orderService.submitOrder()` gọi `POST /api/orders` thật (xem mục 7).

### Swagger cập nhật 2026-08-07 — schema Sản phẩm & Bài viết

Chủ dự án sửa lại spec trên **cùng link cũ** (`https://tue-tram.vercel.app/api-docs`, JSON ở `/api-docs.json`). **Đường dẫn endpoint KHÔNG đổi** — chỉ schema payload đổi:

| Schema | Field mới | Ý nghĩa | FE dùng ở đâu |
|---|---|---|---|
| `ProductInput` / `ProductUpdateInput` | `priceOnRequest` (bool) | Bán theo yêu cầu — `price` được phép bỏ trống, FE hiện **"Liên hệ"** | `utils/format.js → formatPrice()`, dùng ở ProductCard / ProductCarousel / HomeMobile / ProductListMobile / ProductDetail / bảng Admin |
| | `specs` `[{label,value}]` | Tab **"Thông số"** ở trang chi tiết | `ProductDetail.jsx` (antd `Tabs`) |
| | `usageSteps` `[string]` | Tab **"Cách dùng"** (đúng thứ tự nhập) | `ProductDetail.jsx` |
| `GET /products` | `minRating` (0-5) | Lọc theo đánh giá tối thiểu | mới ghi nhận, chưa gắn UI lọc |
| `BlogPostInput` | `images` `[string]` | Ảnh chèn **bên trong** nội dung bài (khác `thumbnail` = ảnh nền đầu bài) | `BlogFormModal.jsx` (2 nút upload riêng), `BlogDetail.jsx` |

Ghi chú thực thi:

- **Thứ tự hiển thị**: `productService.sortForDisplay()` (áp trong `getProducts()`, nên trang chủ / danh sách / mobile đều giống nhau) đẩy **sản phẩm giá "Liên hệ" xuống cuối**, sản phẩm có giá niêm yết lên trước, giữ nguyên thứ tự backend trong từng nhóm. Backend **chưa có field thứ tự** (`displayOrder`/`position`) nên KHÔNG ghim cứng được "sản phẩm A luôn đứng thứ 3" — muốn vậy phải nhờ backend bổ sung field rồi sort theo nó.
- `productService.cleanProductPayload()` **bỏ `price` khỏi payload khi `priceOnRequest = true`**, và lọc bỏ dòng `specs`/`usageSteps` rỗng do form để lại.
- Form Admin: `src/components/admin/ProductExtraFields.jsx` export `PriceFields` / `SpecsField` / `UsageStepsField`, **dùng chung** cho `ProductFormModal` (tạo) và `ProductEditDrawer` (sửa) để hai nơi không lệch schema.
- **Luôn in giá bằng `formatPrice(product)`, không gọi thẳng `formatVnd(product.price)`** — nếu không sản phẩm giá liên hệ sẽ hiện `0₫`.
- Nhân tiện sửa một lỗi thật: `BlogDetail.jsx` trước đây **luôn** hiện ô "Ảnh đang cập nhật" kể cả khi bài đã có `thumbnail`; nay render ảnh thật và hiện thêm mảng `images`.

## 5b. Màn hình trắng/đen trơn — ErrorBoundary

React 18 khi một component ném lỗi lúc render sẽ **gỡ sạch cây**, để lại `#root` rỗng → màn hình chỉ còn màu nền `#2e2b25`, tab Network trông vẫn bình thường nên rất dễ tưởng là lỗi mạng. Từ 2026-08-07 có `src/components/common/ErrorBoundary.jsx` bọc ngoài cùng trong `main.jsx`: hiện thông báo + nút "Tải lại trang", và **ở bản dev in luôn stack lỗi ra màn hình**.

Khi gặp trang trống mà ErrorBoundary cũng không hiện gì → gần như chắc chắn là **HMR của Vite kẹt** (hay xảy ra sau khi xoá/đổi tên component đang mở trên màn hình). Cách xử lý: `Ctrl+Shift+R` (tải lại bỏ cache); nếu vẫn vậy thì tắt `npm run dev`, xoá `node_modules/.vite`, chạy lại.

## 5c. Bảo mật khi build — đã tắt sourcemap

`vite.config.js`:

- `build.sourcemap: false` — không sinh `.js.map`, F12 > Sources chỉ thấy bundle đã nén, không dựng ngược được cây `src/` với tên file và comment gốc.
- `css.devSourcemap: false` — tương tự cho CSS.
- `esbuild.drop: ['console', 'debugger']` **chỉ khi `NODE_ENV=production`** — bỏ mọi `console.*` khỏi bản build để không lộ log nội bộ; `npm run dev` không bị ảnh hưởng.

**Nói cho đúng:** đây không phải mã hoá. Web frontend nào cũng phải gửi JavaScript xuống trình duyệt nên code vẫn đọc/gỡ rối được nếu ai đó quyết tâm — tắt sourcemap chỉ khiến việc đó không còn dễ như đọc source gốc. Logic nào thật sự cần giấu (công thức giá, khoá API, quy tắc nghiệp vụ) thì phải đặt ở backend.

## 6. Chạy dự án

```bash
npm install
# .env đã có sẵn trong repo cục bộ (không commit) - kiểm tra/điền lại giá trị
# thật theo bảng biến ở mục 4 nếu cần, rồi chạy:
npm run dev
```

## 7. Khu vực quản trị (`/admin`)

Toàn bộ CRUD Admin nối thẳng vào API thật (không mock), theo đúng các endpoint có `security: bearerAuth` + summary "(Admin)" trong [api-docs](https://tue-tram.vercel.app/api-docs). Backend tự kiểm tra quyền Admin qua JWT — FE chỉ ẩn/hiện UI, **không thay cho việc backend phải chặn** (`RequireAdmin` chỉ chặn hiển thị, không phải lớp bảo mật). Khu vực này giữ theme sáng gốc, không theo dark theme của trang khách hàng — xem mục 2.

- **Vào trang quản trị:** mở thẳng **`/dang-nhap`** (nút "Đăng nhập" ở Header đang ẩn vì `SHOP_MODE = false` — xem mục 2b), đăng nhập bằng tài khoản `role: "Admin"` → tự chuyển vào `/admin`. Vào thẳng `/admin` khi chưa đăng nhập cũng bị đẩy sang `/dang-nhap` rồi quay lại.
- **Route guard:** `src/components/admin/RequireAdmin.jsx` — chưa đăng nhập thì `Navigate` sang `/dang-nhap`; đã đăng nhập nhưng `user.role !== 'Admin'` thì hiện màn 403. `user.role` lấy từ object user do `/auth/login` trả về (xem quy ước ở mục 5) — nếu backend đặt tên field quyền khác `role`, sửa ở đây.
- **Giao diện:** dựng lại toàn bộ ngày 2026-08-06 theo **bộ 6 ảnh thiết kế Admin do chủ dự án gửi trong chat** (KHÔNG có trong `Tue Tram - Standalone.html` — file mockup đó chỉ vẽ trang khách hàng). Nền kem `#f5ead8`, thẻ/bảng `#ebddc5`, nhấn cam `#c67139` — cùng ramp màu thương hiệu trong `theme.js`, chỉ khác là khu vực này **nền sáng**.
- **UI kit dùng chung:** `src/components/admin/ui/index.jsx` — `AdminPageHeader` (tiêu đề + ô tìm kiếm + nút "+ Thêm mới"), `StatCards` (dải thẻ số liệu), `DataTable` (bảng nền kem), `Pill` (nhãn trạng thái), `RowActions` (nút sửa/xoá). 5 màn danh sách đều dựng từ bộ này, **không dùng `<Table>` của antd nữa** (antd Table không ra được đúng kiểu bảng trong thiết kế).
- **Layout:** `src/layouts/AdminLayout.jsx` — sidebar kem có logo + chữ "QUẢN TRỊ", 6 mục theo thiết kế (Tổng quan / Người dùng / Đơn hàng / Bài đăng / Sản phẩm / Mã voucher) + mục "Danh mục" giữ thêm ngoài thiết kế vì vẫn cần để gán danh mục cho sản phẩm. Đáy sidebar: hộp "Đăng nhập: `<email>`" + **2 nút hiện rõ "Về trang chủ" và "Đăng xuất"** (sửa 2026-08-06 — trước đó 2 chức năng này nằm trong dropdown ẩn nên không ai tìm thấy). Dưới breakpoint mobile sidebar ẩn, mở bằng nút "Menu".
- **Trang & service tương ứng** (`src/pages/Admin/*` gọi qua `src/services/*Service.js`):
  - Tổng quan (`Dashboard/`) — 4 thẻ số liệu + biểu đồ cột doanh thu 6 tháng + danh sách 5 đơn gần nhất. **Backend chưa có endpoint thống kê** (không có `/admin/stats`, `/orders/summary` trong api-docs) nên mọi con số được **tính tại FE** từ `GET /orders?limit=200`. Quá 200 đơn thì phải nhờ backend làm endpoint thống kê, đừng nâng limit.
  - Đơn hàng (`Orders/`) — `orderService.js` (`listOrders`, `updateOrderStatus`, `resolveOrderRequest`, `getOrder`). Bấm vào nhãn trạng thái để đổi: `pending → confirmed → shipping → completed`, huỷ chỉ khi đang `pending`/`confirmed` (backend tự chặn bước nhảy sai, FE hiện message lỗi trả về).
  - Mã voucher (`Coupons/`) — `couponService.js` (`listCoupons`, `createCoupon`, `updateCoupon`, `deleteCoupon`). `CouponFormModal` khớp đúng schema `CouponInput`. Trạng thái "Hết hạn"/"Hết lượt" là **suy ra tại FE** từ `endDate`/`usageLimit` (backend chỉ có Active/Inactive).
  - Sản phẩm (`Products/`) — `productService.js` (`adminListProducts`, `createProduct`, `updateProduct`, `deleteProduct`, `updateProductStock`, `updateProductFlags`, `addProductImage`, `removeProductImage`). List/tạo dùng Modal (`ProductFormModal`), sửa/tồn kho/nổi bật-mới/ảnh dùng Drawer riêng (`ProductEditDrawer`) vì API tách các thao tác này thành endpoint riêng.
  - Danh mục (`Categories/`) — `categoryService.js`, `CategoryFormModal` dùng chung tạo/sửa. Xoá sẽ báo lỗi (409) nếu danh mục còn sản phẩm — API tự chặn, FE chỉ hiển thị lại message.
  - Người dùng (`Users/`) — `userService.js`, path thật là **`/api/admin/users`** (backend đổi tên từ `/api/users` ngày 2026-08-05, đã cập nhật `userService.js` theo). `UserFormModal` dùng chung tạo/sửa; đổi trạng thái (Active/Inactive/Banned) qua Select ngay trong bảng, gọi riêng `PATCH /admin/users/:id/status`. Không cho tự khoá/tự xoá chính mình (API chặn 400, FE cũng disable nút tương ứng để rõ ràng hơn).
  - Bài viết (`Blog/`) — `blogService.js` (path thật `/api/blog` cho cả khách lẫn admin; mock đã bỏ từ 2026-08-06). `BlogFormModal` dùng chung tạo/sửa, có **2 nút upload tách biệt**: "Tải ảnh nền lên" (`thumbnail`) và "Thêm ảnh vào bài" (`images[]`) — theo swagger 2026-08-07.
  - Ảnh: `src/services/uploadService.js` → `POST /upload/image` (multipart, Cloudinary phía backend) dùng chung cho ảnh sản phẩm và ảnh bài viết.
- **Response list — đã verify trên bản deploy thật** (`curl https://tue-tram.vercel.app/api/...`): `/api/products` và `/api/blog` trả `data: { items: [...], total, page, limit, totalPages }`; `/api/categories` trả thẳng `data: [...]` (mảng, không bọc). `src/utils/pickList.js` (`pickList`, `pickTotal`) đã xử lý đúng cả hai kiểu này.
- **Cập nhật spec 2026-08-06:** backend **đã có** đầy đủ path cho Orders (`/api/orders`, `/orders/my`, `/orders/track`, `/orders/{id}`, `/orders/{id}/status`, `/orders/{id}/cancel-request`, `/orders/{id}/return-request`, `/orders/{id}/resolve-request`) và Coupons (`/api/coupons`, `/coupons/{id}`, `/coupons/apply`) — ghi chú cũ nói "mới khai báo tag chưa có path" đã sai, nay đã nối thật. **Payments và Reviews vẫn chỉ có tag, chưa có path** → chưa làm màn nào.
- **Đặt hàng phía khách đã nối API thật:** `orderService.submitOrder()` gọi `POST /api/orders`. Form trong `Cart/index.jsx` map sang đúng schema `OrderCheckoutInput`: gộp số nhà/phường/quận/tỉnh thành 1 chuỗi `customer.address`, `paymentMethod` `'cod' → 'COD'` / `'transfer' → 'SePay'`, `items: [{ productId, quantity }]` (giỏ hàng dùng `sku`, mà `sku` = `_id` thật sau khi bỏ mock data nên gửi lên là hợp lệ).
- **Thêm sản phẩm có upload ảnh ngay trong modal** (sửa 2026-08-06): `ProductFormModal` đẩy file qua `POST /upload/image` rồi gửi kèm mảng `images` trong payload `POST /products`, thay vì bắt tạo sản phẩm xong mới thêm ảnh ở Drawer. Modal cũng hiện cảnh báo + link sang trang Danh mục khi chưa có danh mục nào.
- **Cart API đã có** (`/api/cart`, `/api/cart/items`, `/api/cart/items/{productId}` — xuất hiện trong `api-docs` ngày 2026-08-05, trước đó chưa có) nhưng **FE chưa nối** — `src/store/CartContext.jsx` vẫn đang giỏ hàng local-only (`useReducer`, mất khi refresh, không đồng bộ tài khoản). Đây là việc riêng, khá lớn (phải quyết định giỏ hàng khách chưa đăng nhập xử lý sao, merge giỏ local vào giỏ server lúc login,...) — làm khi được yêu cầu cụ thể, không tự ý đổi vì ảnh hưởng luồng mua hàng hiện tại.

## 8. Việc còn thiếu / cần làm tiếp

- **Nhập liệu thật:** database backend đang rỗng. Chủ shop cần vào `/admin` tạo **danh mục → sản phẩm (kèm ảnh) → bài viết** thì trang khách hàng mới có nội dung. Đây là việc của chủ shop, không phải bug code.
- Dựng lại đúng mockup các trang **còn lại**: `/bai-viet` + `/bai-viet/*`, `/san-pham` (danh sách), `/san-pham/*` (chi tiết). Markup **có sẵn trong `Tue Tram - Standalone.html`** (nhánh `isBlog`, `isProducts`, `isProduct`) — đọc trực tiếp như đã làm với Header/Hero/About/Cart, không cần xin thêm file.
- Xin file `Tue Tram Mobile - Standalone.html` để verify lại phần mobile (Header mobile, MobileBottomNav hiện chỉ là suy luận đổi màu, chưa đối chiếu mockup thật).
- Auth (mục 5) mới có login/register — còn thiếu UI quên/đổi mật khẩu, trang hồ sơ cá nhân, và gate các trang cần đăng nhập trước khi đặt hàng. Có thể dùng `orderService.listMyOrders()` / `trackOrder()` để làm trang "Đơn hàng của tôi" và tra đơn cho khách vãng lai.
- Admin: còn thiếu **Payments** và **Reviews** (backend mới có tag, chưa có path). Dashboard đang tính thống kê tại FE — nên nhờ backend làm endpoint thống kê khi số đơn tăng.
- Nối `CartContext` vào Cart API thật (xem ghi chú cuối mục 7) — việc riêng, cần chốt cách xử lý giỏ hàng khách chưa đăng nhập.
