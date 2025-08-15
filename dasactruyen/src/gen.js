function execute() {
    return Response.success([
        {
            title: "Tất cả truyện",
            input: "https://dasactruyen.xyz/",
            script: "genrecontent"
        },
        {
            title: "Truyện mới",
            input: "https://dasactruyen.xyz/",
            script: "genrecontent"
        }
    ]);
}
