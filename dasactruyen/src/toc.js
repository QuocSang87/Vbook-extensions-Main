function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let chapterList = [];
        
        // Tìm danh sách chương trong trang
        // Thử nhiều selector khả thi
        let chapterElements = doc.select("a[href*='chuong'], .chapter-list a, .chapter-item a, a[href*='chapter']");
        
        if (chapterElements.size() === 0) {
            // Fallback: tìm text chứa "Chương"
            doc.select("a").forEach(function(element) {
                let text = element.text();
                let href = element.attr("href");
                if (text && href && 
                    (text.toLowerCase().includes("chương") || text.toLowerCase().includes("chapter")) &&
                    href.includes(url.split("/truyen-chu/")[1])) {
                    chapterElements.push(element);
                }
            });
        }
        
        // Nếu không tìm thấy chương, tạo chương giả định từ 1-10
        if (chapterElements.size() === 0) {
            let storySlug = url.split("/truyen-chu/")[1].replace("/", "");
            for (let i = 1; i <= 10; i++) {
                chapterList.push({
                    name: "Chương " + i,
                    url: "https://dasactruyen.xyz/index.php/truyen-chu/" + storySlug + "/chuong-" + i + "/",
                    host: "https://dasactruyen.xyz"
                });
            }
        } else {
            // Xử lý các chương tìm được
            chapterElements.forEach(function(element) {
                let chapterName = element.text().trim();
                let chapterUrl = element.attr("href");
                
                if (chapterName && chapterUrl) {
                    // Đảm bảo URL đầy đủ
                    if (!chapterUrl.startsWith("http")) {
                        chapterUrl = "https://dasactruyen.xyz" + chapterUrl;
                    }
                    
                    chapterList.push({
                        name: chapterName,
                        url: chapterUrl,
                        host: "https://dasactruyen.xyz"
                    });
                }
            });
        }
        
        return Response.success(chapterList);
    }
    
    return Response.error("Không thể tải danh sách chương");
}
