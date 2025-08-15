function execute(key, page) {
    let searchUrl = "https://dasactruyen.xyz/?s=" + encodeURIComponent(key);
    
    let response = fetch(searchUrl);
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        
        // Tìm kết quả tìm kiếm
        doc.select("a[href*='/truyen-chu/']").forEach(function(element) {
            let link = element.attr("href");
            let title = element.attr("title");
            let name = title || element.text().trim();
            let imgElement = element.select("img").first();
            let cover = imgElement ? imgElement.attr("src") : "";
            
            if (name && link && name.length > 3) {
                let exists = novelList.some(function(novel) {
                    return novel.link === link;
                });
                
                if (!exists) {
                    novelList.push({
                        name: name,
                        link: link,
                        cover: cover,
                        description: "Kết quả tìm kiếm: " + name,
                        host: "https://dasactruyen.xyz"
                    });
                }
            }
        });
        
        return Response.success(novelList);
    }
    
    return Response.error("Không thể thực hiện tìm kiếm");
}
