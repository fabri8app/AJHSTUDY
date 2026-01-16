export const config = {
  runtime: 'edge', // Isse library ki zaroorat nahi padegi
};

export default async function handler(req) {
  const url = new URL(req.url);
  
  // Target URL ko setup kar rahe hain
  const targetHost = "deltastudy.site";
  const targetUrl = "https://" + targetHost + url.pathname + url.search;

  // Headers ko spoof kar rahe hain taaki unhe lage request unki site se hai
  const headers = new Headers(req.headers);
  headers.set("Host", targetHost);
  headers.set("Referer", "https://deltastudy.site/");
  headers.set("Origin", "https://deltastudy.site");

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      redirect: "follow"
    });

    // Content type check kar rahe hain (HTML hai ya Image)
    const contentType = response.headers.get("content-type");
    
    // Security headers ko raste mein hi khatam kar rahe hain
    const newHeaders = new Headers(response.headers);
    newHeaders.delete("content-security-policy");
    newHeaders.delete("x-frame-options");
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });

  } catch (e) {
    return new Response("Bhai, Proxy mein error aa gaya: " + e.message, { status: 500 });
  }
}
