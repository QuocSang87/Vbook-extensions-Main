function execute(page) {
  if (!page) page = '1';
  const host = 'https://dasactruyen.xyz';
  const url = host + '/index.php/the_loai/' + input + (page > 1 ? '/' + page : '');
  const response = fetch(url);
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
    let next = doc.select('a.next').attr('href').match(/page=(\d+)/); // Giả định có pagination, nếu có
    if (next) next = next[1];
    else next = '';
    return Response.success(books, next);
  }
  return Response.error('Không tải được thể loại');
}