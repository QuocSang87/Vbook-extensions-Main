function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        // Lấy tiêu đề từ nhiều selector khả thi
        let name = doc.select("h1.entry-title, .post-title, h1").text().trim();
        if (!name) {
            // Fallback: lấy từ title tag
            name = doc.select("title").text().split(" - ")[0].trim();
        }
        
        // Lấy ảnh cover
        let cover = doc.select(".wp-post-image, .post-thumbnail img, .entry-content img").first();
        let coverUrl = cover ? cover.attr("src") : "";
        
        // Lấy mô tả/nội dung
        let description = "";
        let contentElements = doc.select(".entry-content, .post-content").first();
        if (contentElements) {
            let paragraphs = contentElements.select("p");
            if (paragraphs.size() > 0) {
                // Lấy đoạn đầu tiên làm mô tả
                description = paragraphs.first().text().trim();
                if (description.length > 500) {
                    description = description.substring(0, 500) + "...";
                }
            }
        }
        
        return Response.success({
            name: name || "Truyện không tên",
            cover: coverUrl,
            author: "Tác giả ẩn danh",
            description: description || "Truyện dành cho người lớn trên 18 tuổi",
            detail: description,
            ongoing: true, // Vì có danh sách chương
            host: "https://dasactruyen.xyz"
        });
    }
    
    return Response.error("Không thể tải thông tin truyện");
}
