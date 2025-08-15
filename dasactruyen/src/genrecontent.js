function execute(url, page) {
    if (!page) page = 1;
    
    let requestUrl = url;
    
    // Xử lý pagination cho search
    if (url.includes("?s=") && page > 1) {
        requestUrl = url + "&paged=" + page;
    }
    
    let response = fetch(requestUrl);
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        let next = "";
        
        // Nếu là trang chủ (tất cả truyện)
        if (url === "https://dasactruyen.xyz/") {
            doc.select("a[href*='/truyen-chu/']").forEach(function(element) {
                processStoryLink(element, novelList);
            });
        } 
        // Nếu là search results
        else {
            // Tìm trong search results
            let searchResults = doc.select(".search-results, .search-content, .entry-content");
            if (searchResults.size() > 0) {
                searchResults.select("a[href*='/truyen-chu/']").forEach(function(element) {
                    processStoryLink(element, novelList);
                });
            } else {
                // Fallback: tìm tất cả link truyện
                doc.select("a[href*='/truyen-chu/']").forEach(function(element) {
                    processStoryLink(element, novelList);
                });
            }
            
            // Kiểm tra có trang tiếp theo không
            let nextElement = doc.select(".next.page-numbers, .nav-previous a").first();
            if (nextElement && novelList.length > 0) {
                next = (page + 1).toString();
            }
        }
        
        // Loại bỏ truyện trùng lặp
        novelList = removeDuplicates(novelList);
        
        // Nếu không tìm thấy kết quả cho search
        if (novelList.length === 0 && url.includes("?s=")) {
            return Response.success([
                {
                    name: "Không tìm thấy kết quả",
                    link: "https://dasactruyen.xyz/",
                    cover: "",
                    description: "Thử tìm kiếm với từ khóa khác",
                    host: "https://dasactruyen.xyz"
                }
            ]);
        }
        
        return Response.success(novelList, next);
    }
    
    return Response.error("Không thể tải danh sách thể loại");
}

// Helper function để xử lý link truyện
function processStoryLink(element, novelList) {
    let link = element.attr("href");
    let title = element.attr("title");
    let imgElement = element.select("img").first();
    
    // Lấy tên từ title attribute hoặc alt của img hoặc text
    let name = title || (imgElement ? imgElement.attr("alt") : "") || element.text().trim();
    let cover = imgElement ? imgElement.attr("src") : "";
    
    // Lấy category từ URL search
    let category = "Truyện 18+";
    let currentUrl = element.ownerDocument().location().href;
    if (currentUrl && currentUrl.includes("?s=")) {
        let searchTerm = decodeURIComponent(currentUrl.split("?s=")[1].split("&")[0]);
        category = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
    }
    
    // Chỉ thêm nếu có tên và link hợp lệ
    if (name && link && name.length > 3) {
        // Kiểm tra trùng lặp
        let exists = novelList.some(function(novel) {
            return novel.link === link;
        });
        
        if (!exists) {
            novelList.push({
                name: name.trim(),
                link: link,
                cover: cover,
                description: category + " - " + name,
                host: "https://dasactruyen.xyz"
            });
        }
    }
}

// Helper function để loại bỏ trùng lặp
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
