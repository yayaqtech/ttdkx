# Thủ tục Đăng ký Xe – Công an phường Ngũ Hành Sơn

Trang thông tin hướng dẫn các thủ tục đăng ký xe trực tuyến dành cho người dân, do **Công an phường Ngũ Hành Sơn, TP. Đà Nẵng** cung cấp.

Các thủ tục được hướng dẫn bao gồm: bấm biển số tại nhà, sang tên xe, cấp lại giấy đăng ký, khai báo xe đã bán/cho tặng và sử dụng ứng dụng VNETRAFFIC.

## Kiến trúc triển khai

Dự án sử dụng **hai nền tảng host với hai mục đích khác nhau**:

```
Người dân  ──────────────────►  GitHub Pages
                                 (trang web công khai)

Người biên tập  ──────────────►  Netlify
                                 (Decap CMS admin)
                                      │
                                      │ Git Gateway
                                      ▼
                                 GitHub repository
                                 (lưu nội dung)
```

- **GitHub Pages** là nơi người dân truy cập để xem hướng dẫn. Build được tự động deploy qua GitHub Actions mỗi khi có thay đổi trên nhánh `main`.

- **Netlify** không phục vụ trang web cho người dân mà đóng vai trò host cho **Decap CMS**. Netlify cung cấp hai dịch vụ thiết yếu cho CMS hoạt động: **Netlify Identity** (xác thực người dùng biên tập) và **Git Gateway** (cho phép CMS đọc/ghi trực tiếp vào repository mà không cần personal access token).

Khi người biên tập lưu thay đổi qua CMS, Netlify sẽ commit vào repository → GitHub Actions tự động build lại → nội dung mới được cập nhật trên GitHub Pages.

## Tech Stack

| Thành phần | Công nghệ                                             |
| ---------- | ----------------------------------------------------- |
| Framework  | [Astro](https://astro.build/) v5                      |
| Styling    | [Tailwind CSS](https://tailwindcss.com/) v3           |
| Language   | TypeScript (strict mode)                              |
| CMS        | [Decap CMS](https://decapcms.org/) + Netlify Identity |
| Deployment | Netlify                                               |
| CI         | GitHub Actions → GitHub Pages                         |

## Cấu trúc dự án

```
├── public/
│   ├── admin/          # Decap CMS admin panel
│   └── imgs/           # Ảnh tĩnh (banner, ...)
├── src/
│   ├── components/
│   │   └── VideoCard.astro   # Component hiển thị video YouTube
│   ├── data/
│   │   ├── meta.json         # SEO metadata (title, OG tags, ...)
│   │   └── videos.json       # Danh sách video hướng dẫn
│   ├── layouts/
│   │   └── BaseLayout.astro  # Layout chính (head, fonts, Netlify Identity)
│   ├── pages/
│   │   └── index.astro       # Trang chủ duy nhất
│   └── styles/
│       └── global.css        # Tailwind directives + custom styles
├── .env                      # Biến môi trường local (không commit)
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

## Yêu cầu

- **Node.js** >= 20
- **npm** >= 10

## Cài đặt và chạy local

**1. Clone repository**

```bash
git clone <repository-url>
cd ttdkx
```

**2. Cài dependencies**

```bash
npm install
```

**3. Tạo file `.env`** (nếu chưa có)

```bash
cp .env.example .env
```

Hoặc tạo thủ công với nội dung:

```env
SITE_URL=http://localhost:4321
BASE_PATH=/
```

**4. Chạy dev server**

```bash
npm run dev
```

Mở trình duyệt tại `http://localhost:4321`.

## Biến môi trường

| Biến        | Mô tả                    | Giá trị mặc định              |
| ----------- | ------------------------ | ----------------------------- |
| `SITE_URL`  | URL gốc của site         | `https://yayaqtech.github.io` |
| `BASE_PATH` | Đường dẫn base (subpath) | `/ttdkx`                      |

> Khi chạy local, `.env` ghi đè giá trị mặc định. Khi deploy, biến CI/CD ghi đè `.env`.

## Quản lý nội dung (Decap CMS)

### Chạy CMS local

Cần khởi động cả proxy và dev server:

```bash
# Terminal 1 – proxy cho Decap CMS
npx decap-server

# Terminal 2 – Astro dev
npm run dev
```

Truy cập admin tại `http://localhost:4321/admin/`.

### Trên production (Netlify)

CMS sử dụng **Netlify Identity** + **Git Gateway**. Để kích hoạt:

1. Vào **Site configuration → Identity → Enable Identity**
2. Vào **Identity → Services → Git Gateway → Enable Git Gateway**
3. Mời editors qua **Identity → Invite users**

## Code Quality

### Kiểm tra và sửa tự động

```bash
npm run lint          # Kiểm tra ESLint
npm run lint:fix      # Tự động sửa lỗi ESLint
npm run format        # Format code bằng Prettier
npm run format:check  # Kiểm tra format (dùng trong CI)
```

### Pre-commit hook (Husky)

Mỗi commit sẽ tự động chạy **lint-staged** để kiểm tra các file được staged:

- File `.astro`, `.ts`, `.js`, `.mjs`: Prettier format + ESLint fix
- File `.json`, `.yml`, `.css`, `.md`: Prettier format

Nếu ESLint phát hiện lỗi không tự sửa được, commit sẽ bị chặn cho đến khi lỗi được khắc phục.

## Scripts

| Script                 | Mô tả                         |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Chạy dev server               |
| `npm run build`        | Build production              |
| `npm run preview`      | Preview bản build             |
| `npm run lint`         | Chạy ESLint                   |
| `npm run lint:fix`     | ESLint với auto-fix           |
| `npm run format`       | Prettier format toàn bộ       |
| `npm run format:check` | Kiểm tra Prettier (không sửa) |

## Deployment

### GitHub Pages (trang công khai cho người dân)

Workflow `.github/workflows/deploy.yml` tự động build và deploy lên GitHub Pages mỗi khi push lên `main`. Đây là URL mà người dân truy cập.

Cần thiết lập trong **Settings → Environments → github-pages**:

| Biến        | Giá trị                        |
| ----------- | ------------------------------ |
| `SITE_URL`  | `https://<username>.github.io` |
| `BASE_PATH` | `/ttdkx`                       |

### Netlify (host Decap CMS)

Netlify không phục vụ trang web cho người dân. Vai trò của Netlify là cung cấp **Netlify Identity** và **Git Gateway** để Decap CMS hoạt động. Push lên `main` cũng trigger build trên Netlify nhưng URL này chỉ dùng để truy cập trang `/admin/`.

Cần thiết lập các biến môi trường trong **Site configuration → Environment variables**:

| Biến        | Giá trị                           |
| ----------- | --------------------------------- |
| `SITE_URL`  | `https://<your-site>.netlify.app` |
| `BASE_PATH` | `/`                               |
