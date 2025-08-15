function execute(url, page) {
    if (!page) page = 1;
    
    let requestUrl = url;
    if (page > 1) {
        requestUrl = url + "page/" + page + "/";
    }
    
    let response = fetch(requestUrl);
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = "";
        
        // Selector chính xác cho trang dasactruyen.xyz
        doc.select("article").forEach(function(element) {
            let titleElement = element.select("h2.entry-title a").first();
            let imageElement = element.select(".post-thumbnail img, .wp-post-image").first();
            
            if (titleElement) {
                let name = titleElement.text().trim();
                let link = titleElement.attr("href");
                let cover = imageElement ? imageElement.attr("src") : "";
                
                // Lấy excerpt từ content
                let description = element.select(".entry-summary, .entry-content").text().trim();
                if (description.length > 200) {
                    description = description.substring(0, 200) + "...";
                }
                
                if (name && link) {
                    novelList.push({
                        name: name,
                        link: link,
                        cover: cover,
                        description: description || "Truyện ngắn 18+",
                        host: "https://dasactruyen.xyz"
                    });
                }
            }
        });
        
        // Kiểm tra trang tiếp theo
        let nextElement = doc.select(".nav-previous a, .next.page-numbers").first();
        if (nextElement) {
            next = (page + 1).toString();
        }
        
        return Response.success(novelList, next);
    }
    
    return Response.error("Không thể tải trang");
}
