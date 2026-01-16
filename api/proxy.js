export const config = { runtime: 'edge' };

export default async function (req) {
  const targetHost = "deltastudy.site";
  const myDomain = "ajhstudy.vercel.app";
  const url = new URL(req.url);
  
  const path = url.pathname === "/" ? "/study" : url.pathname;
  const targetUrl = `https://${targetHost}${path}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": req.headers.get("user-agent"),
        "Host": targetHost,
        "Referer": `https://${targetHost}/`
      }
    });

    let contentType = response.headers.get("content-type") || "";

    if (contentType.includes("text/html")) {
      let html = await response.text();
      
      // Magic Injection: Firebase ko lagne lagega ki domain 'deltastudy.site' hi hai
      const injectionScript = `
        <script>
          // Domain spoofing logic
          Object.defineProperty(document, 'domain', { get: function() { return '${targetHost}'; } });
          const originalLocation = window.location;
          // Ye line Firebase ko confuse karne ke liye hai
          console.log("Analyzer Mode: Domain Masked Successfully");
        </script>
      `;
      
      // HTML ke <head> ke baad script inject kar rahe hain
      html = html.replace('<head>', '<head>' + injectionScript);
      
      // Saare links ko apne domain se replace karna taaki 404 na aaye
      html = html.split(targetHost).join(myDomain);

      return new Response(html, { headers: { "content-type": "text/html" } });
    }

    return response;
  } catch (e) {
    return new Response("Final Error: " + e.message, { status: 500 });
  }
}
