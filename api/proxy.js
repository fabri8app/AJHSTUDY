export const config = { runtime: 'edge' };

export default async function (req) {
    const targetUrl = "https://deltastudy.site/study";
    
    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": req.headers.get("user-agent"),
                "Host": "deltastudy.site"
            }
        });

        const newHeaders = new Headers(response.headers);
        newHeaders.delete("content-security-policy");
        newHeaders.delete("x-frame-options"); // Isse iframe block nahi hoga
        newHeaders.set("Access-Control-Allow-Origin", "*");

        return new Response(response.body, {
            status: response.status,
            headers: newHeaders
        });
    } catch (e) {
        return new Response("Browser Error: " + e.message);
    }
}
