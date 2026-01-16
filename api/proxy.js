export const config = { runtime: 'edge' };

export default async function (req) {
  const targetHost = "deltastudy.site";
  const myDomain = "ajhstudy.vercel.app";
  const url = new URL(req.url);
  
  // Agar koi seedha domain pe aaye toh /study dikhao
  let path = url.pathname === "/" ? "/study" : url.pathname;
  const targetUrl = `https://${targetHost}${path}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": req.headers.get("user-agent"),
        "Host": targetHost,
        "Referer": `https://${targetHost}/`
      }
    });

    const contentType = response.headers.get("content-type") || "";

    // Agar HTML ya JS hai, toh uske andar domain replace karo
    if (contentType.includes("text/html") || contentType.includes("application/javascript")) {
      let text = await response.text();
      // Sab jagah unka domain replace karke apna daal rahe hain
      text = text.split(targetHost).join(myDomain);
      
      return new Response(text, {
        headers: { "content-type": contentType, "Access-Control-Allow-Origin": "*" }
      });
    }

    // Images aur fonts ke liye direct response
    return response;

  } catch (e) {
    return new Response("Analyzer Error: " + e.message, { status: 500 });
  }
}
