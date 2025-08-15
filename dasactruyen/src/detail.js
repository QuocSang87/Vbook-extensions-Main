function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        let name = doc.select("h1.entry-title").text().trim();
        let cover = doc.select(".wp-post-image, .post-thumbnail img").attr("src") || "";
        
        // Tác giả mặc định vì không có thông tin
        let author = "Tác giả ẩn danh";
        
        // Lấy mô tả từ content đầu tiên
        let description = "";
        let contentElements = doc.select(".entry-content p");
        if (contentElements.size() > 0) {
            let firstParagraph = contentElements.first().text().trim();
            if (firstParagraph.length > 300) {
                description = firstParagraph.substring(0, 300) + "...";
            } else {
                description = firstParagraph;
            }
        }
        
        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description || "Truyện ngắn dành cho người lớn",
            detail: description,
            ongoing: false, // Đây là truyện ngắn, không ongoing
            host: "https://dasactruyen.xyz"
        });
    }
    
    return Response.error("Không thể tải thông tin truyện");
}
