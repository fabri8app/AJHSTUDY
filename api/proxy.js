export const config = { runtime: 'edge' };

export default async function (req) {
  const targetHost = "deltastudy.site";
  const url = new URL(req.url);
  
  // Force study page on load
  let path = url.pathname === "/" ? "/study" : url.pathname;
  const targetUrl = `https://${targetHost}${path}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": req.headers.get("user-agent"),
        "Host": targetHost,
        "Referer": "https://deltastudy.site/",
      }
    });

    const newHeaders = new Headers(response.headers);
    // Professional Tip: In headers ko hatana hi 'Browser' ko real banata hai
    newHeaders.delete("content-security-policy");
    newHeaders.delete("x-frame-options"); 
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });
  } catch (e) {
    return new Response("Browser Core Failed: " + e.message, { status: 500 });
  }
}
