function execute(keyword, page) {
  const host = 'https://dasactruyen.xyz';
  const response = fetch(host); // Tìm kiếm bằng cách lọc từ home vì không có search API
  if (response.ok) {
    let doc = Html.parse(response.text());
    let books = [];
    doc.select('table tr').forEach(e => {
      let name = e.select('td:first-child a').text();
      if (name.toLowerCase().includes(keyword.toLowerCase())) {
        let link = e.select('td:first-child a').attr('href');
        let description = e.select('td:nth-child(2)').text() + ' - ' + e.select('td:nth-child(3)').text();
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
  return Response.success([]);
}