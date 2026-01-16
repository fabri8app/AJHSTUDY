export const config = {
  runtime: 'edge', // Ye engine crash nahi hota
};

export default async function handler(req) {
  const url = new URL(req.url);
  
  // Agar koi seedha domain pe aaye toh use /study dikhao
  let path = url.pathname === "/" ? "/study" : url.pathname;
  const targetUrl = "https://deltastudy.site" + path + url.search;

  // DeltaStudy ko bewakoof banane ke liye headers
  const headers = new Headers(req.headers);
  headers.set("Host", "deltastudy.site");
  headers.set("Referer", "https://deltastudy.site/");

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      redirect: "follow"
    });

    // Security headers ko delete kar rahe hain taaki site block na ho
    const newHeaders = new Headers(response.headers);
    newHeaders.delete("content-security-policy");
    newHeaders.delete("x-frame-options");
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });

  } catch (e) {
    return new Response("Analyzer Error: " + e.message, { status: 500 });
  }
}
