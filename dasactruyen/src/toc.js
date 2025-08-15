function execute(url) {
  // Giả định single chapter, nếu có nhiều chương thì parse heading từ content
  return Response.success([
    {
      name: 'Chương full',
      url: url,
      host: 'https://dasactruyen.xyz'
    }
  ]);
}