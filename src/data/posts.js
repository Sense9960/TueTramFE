// File này KHÔNG còn chứa mock data (đã xoá `mockPosts` và cả
// `src/data/products.js` ngày 2026-08-06 theo yêu cầu chủ dự án — sản phẩm và
// bài viết nay lấy 100% từ API thật qua productService/blogService).
//
// Phần còn lại dưới đây là NỘI DUNG TĨNH của trang giới thiệu (không phải dữ
// liệu nghiệp vụ, không có endpoint tương ứng trên backend), copy nguyên văn
// từ file mockup gốc.

// Toàn bộ nội dung dưới đây COPY NGUYÊN VĂN từ file mockup gốc
// "Tue Tram - Standalone.html" (khối "Người sáng lập" ở trang chủ + màn
// `isAbout` = trang /nguoi-sang-lap), đọc trực tiếp ngày 2026-08-06.
// KHÔNG tự viết lại/rút gọn — nếu cần sửa câu chữ phải hỏi chủ shop.
export const founder = {
  name: 'Lương y Phạm Ngọc Huỳnh',
  // h1 trang /nguoi-sang-lap xuống dòng sau "Lương y"
  nameLines: ['Lương y', 'Phạm Ngọc Huỳnh'],
  dharmaName: 'Pháp danh: Đại Đức Thích Minh Hiếu',
  source: 'Theo tạp chí Thương Gia & Thị Trường',
  photoCaption: 'Lương y Phạm Ngọc Huỳnh — pháp danh Đại Đức Thích Minh Hiếu',
  // Câu trích ở khối trang chủ. Mockup ngắt dòng sau "tốt đẹp", nhưng theo
  // yêu cầu chủ dự án (2026-08-07) hiển thị TRÊN MỘT DÒNG và có dấu chấm
  // cuối câu — cỡ chữ ở Home đã giảm cho vừa một dòng, xem Home/index.jsx.
  quote: 'Cho đi sẽ nhận lại điều tốt đẹp không thể đong đếm.',
  // Đoạn mô tả ngắn ở khối trang chủ
  bioShort:
    'Lương y Phạm Ngọc Huỳnh — pháp danh Đại Đức Thích Minh Hiếu, người phụ trách phòng thuốc từ thiện Tâm Không Đường tại Đà Lạt — đã dành hơn sáu năm khám chữa bệnh miễn phí cho người nghèo. Mỗi nén trầm Tuệ Trầm là một phần tiếp sức cho hành trình ấy.',
  // Đoạn giới thiệu dài ở đầu trang /nguoi-sang-lap
  intro:
    'Người phụ trách phòng thuốc Tâm Không Đường (Thôn Đất Làng, Xã Xuân Trường, Đà Lạt) — một chi nhánh của Phòng khám chẩn trị YHCT Tâm Không Đường tại Cần Giuộc, Long An — kiêm thêm công việc của Viện Phát triển Văn hoá và Chăm sóc Sức khoẻ Cộng đồng.',
  // Nội dung bài trong thẻ card kem ở trang /nguoi-sang-lap
  article: {
    section1Title: 'Phòng thuốc dành cho người nghèo',
    section1: [
      'Phòng thuốc Tâm Không Đường không chỉ là nơi những cơn đau nhức của bệnh nhân được đẩy lui nhờ những động tác châm cứu, bấm huyệt thành thục — mà hơn thế, nơi ấy người bệnh được phục vụ ân cần, tận tình trong bầu không khí gần gũi như ở nhà.',
      'Dù không có lương bổng hay trợ cấp, các lương y, thầy thuốc ở phòng thuốc vẫn cần mẫn khám chữa bệnh miễn phí cho người nghèo tại Đà Lạt suốt hơn sáu năm qua. Thầy chia sẻ, mỗi ngày mở cửa phòng thuốc, thầy luôn dành hết thời gian, công sức để bà con được thăm khám chu đáo nhất.',
    ],
    pullQuote: '"Cho đi sẽ nhận lại điều tốt đẹp không thể đong đếm."',
    section2Title: 'Từ phòng thuốc đến nén hương',
    section2: [
      'Giữa những giờ bắt mạch, bốc thuốc, thầy chuẩn bị những tép nhang trầm đầu tiên — thuần bột trầm tự nhiên, không hoá chất, không hương liệu — để dâng hương nơi bàn thờ Phật và gửi tặng bà con phật tử. Tiếng lành đồn xa, Tuệ Trầm ra đời từ đó, với tâm nguyện "hương thơm của trí tuệ": mỗi nén trầm được thỉnh đi là thêm một thang thuốc, một bữa cơm cho người nghèo.',
      'Với thầy, làm trầm cũng như làm thuốc — phải sạch từ nguyên liệu, thật từ tấm lòng. Trầm được tuyển từ những cánh rừng dó bầu, phơi gió cao nguyên Xuân Trường, tuyển chọn kỹ từng tép và đọc một thời kinh trước khi gói gửi đến tay người thỉnh.',
    ],
    figureCaption:
      'Một buổi trà đàm bên tôn tượng — nơi thầy trò chuyện cùng phật tử về đạo và về hương trầm',
  },
  cta: {
    titleLines: ['Thỉnh một nén trầm,', 'góp một phần thiện nguyện'],
    button: 'Xem sản phẩm Tuệ Trầm',
  },
}
