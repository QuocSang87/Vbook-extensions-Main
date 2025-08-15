function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let content = "";
        
        // Lấy toàn bộ nội dung truyện từ .entry-content
        let contentElements = doc.select(".entry-content p, .entry-content div");
        
        contentElements.forEach(function(element) {
            let text = element.text().trim();
            if (text && text.length > 5) {
                // Loại bỏ các đoạn không cần thiết
                if (!text.includes("Đọc thêm") && 
                    !text.includes("Chia sẻ") && 
                    !text.includes("Facebook") &&
                    !text.includes("Twitter")) {
                    content += text + "\n\n";
                }
            }
        });
        
        // Làm sạch nội dung
        content = content.replace(/\n{3,}/g, "\n\n");
        content = content.trim();
        
        // Fallback nếu không lấy được content
        if (!content) {
            let fullContent = doc.select(".entry-content").text().trim();
            content = fullContent || "Không thể tải nội dung truyện";
        }
        
        return Response.success(content);
    }
    
    return Response.error("Lỗi kết nối");
}
