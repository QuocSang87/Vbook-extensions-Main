function execute(url, page) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        
        // Lấy tất cả link truyện từ trang chủ
        doc.select("a[href*='/truyen-chu/']").forEach(function(element) {
            let link = element.attr("href");
            let title = element.attr("title");
            let imgElement = element.select("img").first();
            
            // Lấy tên từ title attribute hoặc alt của img
            let name = title || (imgElement ? imgElement.attr("alt") : "");
            let cover = imgElement ? imgElement.attr("src") : "";
            
            // Chỉ thêm nếu có tên và link hợp lệ
            if (name && link && name.length > 3) {
                // Loại bỏ trùng lặp
                let exists = novelList.some(function(novel) {
                    return novel.link === link;
                });
                
                if (!exists) {
                    novelList.push({
                        name: name.trim(),
                        link: link,
                        cover: cover,
                        description: "Truyện 18+ - " + name,
                        host: "https://dasactruyen.xyz"
                    });
                }
            }
        });
        
        return Response.success(novelList);
    }
    
    return Response.error("Không thể tải danh sách truyện");
}
