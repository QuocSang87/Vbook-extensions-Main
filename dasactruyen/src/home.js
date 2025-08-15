function execute() {
  const host = 'https://dasactruyen.xyz';
  const response = fetch(host);
  if (response.ok) {
    let doc = Html.parse(response.text());
    let books = [];
    doc.select('table tr').forEach(e => {
      let name = e.select('td:first-child a').text();
      let link = e.select('td:first-child a').attr('href');
      let description = e.select('td:nth-child(2)').text() + ' - ' + e.select('td:nth-child(3)').text();
      if (name) {
        books.push({
          name,
          link,
          description,
          host
        });
      }
    });
    return Response.success(books);
  }
  return Response.error('Không tải được trang chủ');
}