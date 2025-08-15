function execute(url) {
  const response = fetch(url);
  if (response.ok) {
    let doc = Html.parse(response.text());
    let name = doc.select('h1').first().text(); // Giả định tiêu đề trong h1
    let cover = ''; // Không có cover từ phân tích
    let author = doc.select('a[href*="/tac_gia/"]').text();
    let description = doc.select('p').next().text(); // Giả định mô tả là p sau tiêu đề, chỉnh nếu cần
    let detail = doc.select('td:nth-child(2)').text(); // Status từ table hoặc span
    let ongoing = detail.includes('Đang tiến hành');
    let genres = [];
    doc.select('a[href*="/the_loai/"]').forEach(e => {
      genres.push({
        title: e.text(),
        input: e.attr('href').split('/the_loai/')[1].replace('/', ''),
        script: 'gen.js'
      });
    });
    return Response.success({
      name,
      cover,
      author,
      description,
      detail,
      ongoing,
      genres,
      host: 'https://dasactruyen.xyz'
    });
  }
  return Response.error('Không tải được chi tiết truyện');
}