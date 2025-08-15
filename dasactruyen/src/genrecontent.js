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
        
        doc.select("article.post, .story-item").forEach(function(element) {
            let titleElement = element.select("h2.entry-title a, .story-title a").first();
            let imageElement = element.select("img").first();
            
            if (titleElement) {
                let name = titleElement.text().trim();
                let link = titleElement.attr("href");
                let cover = imageElement ? (imageElement.attr("src") || imageElement.attr("data-src")) : "";
                let description = element.select(".entry-summary, .story-description").text().trim();
                
                novelList.push({
                    name: name,
                    link: link,
                    cover: cover,
                    description: description || "Không có mô tả",
                    host: "https://dasactruyen.xyz"
                });
            }
        });
        
        // Tìm trang tiếp theo
        let nextElement = doc.select(".next, .page-numbers.next").first();
        if (nextElement) {
            next = (page + 1).toString();
        }
        
        return Response.success(novelList, next);
    }
    
    return Response.error("Không thể tải danh sách thể loại");
}