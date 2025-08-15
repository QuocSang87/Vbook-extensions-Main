function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        // Nếu bị redirect về trang chủ (URL chứa dasactruyen.xyz mà không có chuong)
        if (!url.includes("chuong") && url.includes("dasactruyen.xyz")) {
            return Response.error("Chương này có thể cần đăng nhập hoặc mua khóa vàng để đọc");
        }
        
        let content = "";
        
        // Thử lấy nội dung từ các selector khả thi
        let contentSelectors = [
            ".entry-content",
            ".post-content", 
            ".chapter-content",
            ".story-content",
            "article .content"
        ];
        
        for (let selector of contentSelectors) {
            let contentElement = doc.select(selector).first();
            if (contentElement) {
                let paragraphs = contentElement.select("p");
                if (paragraphs.size() > 0) {
                    paragraphs.forEach(function(p) {
                        let text = p.text().trim();
                        if (text && text.length > 10) {
                            content += text + "\n\n";
                        }
                    });
                    break;
                }
                
                // Fallback: lấy toàn bộ text
                if (!content) {
                    content = contentElement.text().trim();
                }
                break;
            }
        }
        
        // Nếu vẫn không có content, có thể là trang bị bảo vệ
        if (!content || content.length < 50) {
            // Kiểm tra có thông báo về khóa vàng không
            let lockMessage = doc.select(".lock-message, .premium-content, .vip-content").text();
            if (lockMessage) {
                return Response.error("Chương này cần khóa vàng: " + lockMessage);
            }
            
            return Response.error("Không thể tải nội dung chương. Có thể cần đăng nhập hoặc trả phí.");
        }
        
        // Làm sạch nội dung
        content = content.replace(/\n{3,}/g, "\n\n").trim();
        
        return Response.success(content);
    }
    
    return Response.error("Lỗi kết nối khi tải chương");
}
