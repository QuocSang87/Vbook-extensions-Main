function execute(url) {
    // Vì đây là truyện ngắn không chia chương, chỉ có 1 chương duy nhất
    return Response.success([
        {
            name: "Toàn bộ truyện",
            url: url,
            host: "https://dasactruyen.xyz"
        }
    ]);
}
