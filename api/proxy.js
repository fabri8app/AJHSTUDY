export const config = {
  runtime: 'edge', // Sabse fast aur no-error runtime
};

export default async function (req) {
  const url = new URL(req.url);
  const targetHost = "deltastudy.site/study-v2/batches";
  
  // Agar koi seedha site pe aaye toh use /study dikhao, baaki paths ko waise hi rehne do
  const path = url.pathname === "/" ? "/study" : url.pathname;
  const targetUrl = `https://${targetHost}${path}${url.search}`;

  const modifiedRequest = new Request(targetUrl, {
    method: req.method,
    headers: {
      "Host": targetHost,
      "Referer": "https://deltastudy.site/study-v2/batches",
      "User-Agent": req.headers.get("user-agent"),
    },
    body: req.body,
  });

  try {
    const response = await fetch(modifiedRequest);
    
    // Security headers ko delete kar rahe hain taaki site block na ho
    const newHeaders = new Headers(response.headers);
    newHeaders.delete("content-security-policy");
    newHeaders.delete("x-frame-options");
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (e) {
    return new Response("Analyzer Error: " + e.message, { status: 500 });
  }
}
