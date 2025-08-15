function execute(url, page) {
    if (!page) page = 1;
    
    let requestUrl = url;
    
    // Xử lý URL cho các section khác nhau
    if (url.includes("#new-updated")) {
        requestUrl = "https://dasactruyen.xyz/";
    } else if (url.includes("#completed")) {
        requestUrl = "https://dasactruyen.xyz/";
    } else if (url.includes("/page/")) {
        requestUrl = "https://dasactruyen.xyz/page/" + page + "/";
    } else if (page > 1) {
        requestUrl = url + "page/" + page + "/";
    }
    
    let response = fetch(requestUrl);
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = "";
        
        // Xử lý section Truyện nổi bật (grid layout)
        if (url.includes("dasactruyen.xyz/") && !url.includes("#")) {
            // Lấy từ section truyện nổi bật
            let featuredSection = doc.select(".featured-stories, .story-grid, .wp-block-group").first();
            if (featuredSection) {
                featuredSection.select("a[href*='/truyen-chu/']").forEach(function(element) {
                    let link = element.attr("href");
                    let imgElement = element.select("img").first();
                    let name = element.attr("title") || (imgElement ? imgElement.attr("alt") : "");
                    let cover = imgElement ? imgElement.attr("src") : "";
                    
                    if (name && link && !isDuplicate(novelList, link)) {
                        novelList.push({
                            name: name.trim(),
                            link: link,
                            cover: cover,
                            description: "Truyện nổi bật",
                            host: "https://dasactruyen.xyz"
                        });
                    }
                });
            }
            
            // Fallback: lấy từ tất cả link truyện
            if (novelList.length === 0) {
                doc.select("a[href*='/truyen-chu/']").forEach(function(element) {
                    let link = element.attr("href");
                    let name = element.attr("title") || element.text().trim();
                    let imgElement = element.select("img").first();
                    let cover = imgElement ? imgElement.attr("src") : "";
                    
                    if (name && link && name.length > 3 && !isDuplicate(novelList, link)) {
                        novelList.push({
                            name: name,
                            link: link,
                            cover: cover,
                            description: "Truyện 18+",
                            host: "https://dasactruyen.xyz"
                        });
                    }
                });
            }
        }
        
        // Xử lý section mới cập nhật
        else if (url.includes("#new-updated")) {
            let updatedSection = doc.select(".recent-stories, .new-updated, .latest-stories").first();
            if (updatedSection) {
                updatedSection.select("a[href*='/truyen-chu/']").forEach(function(element) {
                    processStoryElement(element, novelList, "Mới cập nhật");
                });
            }
        }
        
        // Xử lý section đã hoàn thành  
        else if (url.includes("#completed")) {
            let completedSection = doc.select(".completed-stories, .finished-stories").first();
            if (completedSection) {
                completedSection.select("a[href*='/truyen-chu/']").forEach(function(element) {
                    processStoryElement(element, novelList, "Đã hoàn thành");
                });
            }
        }
        
        // Xử lý pagination cho tất cả truyện
        else {
            doc.select("article, .post, .story-item").forEach(function(element) {
                let titleElement = element.select("h2 a, h3 a, .entry-title a").first();
                if (titleElement) {
                    let name = titleElement.text().trim();
                    let link = titleElement.attr("href");
                    let cover = element.select("img").first()?.attr("src") || "";
                    let description = element.select(".entry-summary, .excerpt").text().trim();
                    
                    if (name && link) {
                        novelList.push({
                            name: name,
                            link: link,
                            cover: cover,
                            description: description || "Truyện 18+",
                            host: "https://dasactruyen.xyz"
                        });
                    }
                }
            });
        }
        
        // Loại bỏ trùng lặp
        novelList = removeDuplicates(novelList);
        
        // Kiểm tra trang tiếp theo
        let nextElement = doc.select(".nav-previous a, .next.page-numbers, .pagination .next").first();
        if (nextElement && novelList.length > 0) {
            next = (page + 1).toString();
        }
        
        return Response.success(novelList, next);
    }
    
    return Response.error("Không thể tải trang");
}

// Helper functions
function processStoryElement(element, novelList, category) {
    let link = element.attr("href");
    let name = element.attr("title") || element.text().trim();
    let imgElement = element.select("img").first();
    let cover = imgElement ? imgElement.attr("src") : "";
    
    if (name && link && !isDuplicate(novelList, link)) {
        novelList.push({
            name: name,
            link: link,
            cover: cover,
            description: category,
            host: "https://dasactruyen.xyz"
        });
    }
}

function isDuplicate(list, link) {
    return list.some(function(item) {
        return item.link === link;
    });
}

function removeDuplicates(list) {
    let seen = {};
    return list.filter(function(item) {
        if (seen[item.link]) {
            return false;
        }
        seen[item.link] = true;
        return true;
    });
}
