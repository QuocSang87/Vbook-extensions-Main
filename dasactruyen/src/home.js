function execute() {
    return Response.success([
        {
            title: "Truyện nổi bật",
            input: "https://dasactruyen.xyz/",
            script: "homecontent"
        },
        {
            title: "Truyện mới cập nhật", 
            input: "https://dasactruyen.xyz/#new-updated",
            script: "homecontent"
        },
        {
            title: "Truyện đã hoàn thành",
            input: "https://dasactruyen.xyz/#completed",
            script: "homecontent"
        },
        {
            title: "Tất cả truyện",
            input: "https://dasactruyen.xyz/page/1/",
            script: "homecontent"
        }
    ]);
}
