function execute(url) {
  const response = fetch(url);
  if (response.ok) {
    let doc = Html.parse(response.text());
    let content = doc.select('div.content').remove('h1, p.description, a').text().replace(/\n/g, '<br>'); // Giả định content trong div.content, loại bỏ metadata
    if (!content) content = doc.select('article').text().replace(/\n/g, '<br>'); // Backup selector
    return Response.success(content);
  }
  return Response.error('Không tải được nội dung chương');
}