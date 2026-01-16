export default async function handler(req, res) {
    const targetDomain = "deltastudy.site";
    const url = new URL(req.url, `https://${req.headers.host}`);
    
    // Agar koi homepage pe aaye toh use /study dikhao
    let path = url.pathname === "/" ? "/study" : url.pathname;
    const targetUrl = "https://" + targetDomain + path + url.search;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": req.headers["user-agent"],
                "Host": targetDomain,
                "Referer": "https://deltastudy.site/"
            }
        });

        const contentType = response.headers.get("content-type");
        res.setHeader("Content-Type", contentType);
        res.setHeader("Access-Control-Allow-Origin", "*");
        
        // Security headers hatana zaroori hai
        res.setHeader("X-Frame-Options", "ALLOWALL");

        const data = await response.arrayBuffer();
        res.send(Buffer.from(data));

    } catch (error) {
        res.status(500).send("Analyzer Error: " + error.message);
    }
}
