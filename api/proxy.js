export const config = {
  runtime: 'edge', // Edge runtime fast hai aur crash nahi hota
};

export default async function handler(req) {
  const url = new URL(req.url);
  const myDomain = "ajhstudy.vercel.app";
  const targetDomain = "deltastudy.site";

  // Agar koi seedha domain pe aaye toh /study dikhao
  let path = url.pathname === "/" ? "/study" : url.pathname;
  const targetUrl = "https://" + targetDomain + path + url.search;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": req.headers.get("user-agent"),
        "Host": targetDomain,
        "Referer": `https://${targetDomain}/`,
      }
    });

    const contentType = response.headers.get("content-type") || "";

    // Agar file HTML ya JS hai, toh uske andar ke links replace karo
    if (contentType.includes("text/html") || contentType.includes("application/javascript")) {
      let text = await response.text();
      
      // Magic logic: Unka domain replace karke apna domain daal rahe hain
      text = text.replaceAll(targetDomain, myDomain);
      text = text.replaceAll("https://deltastudy.site", `https://${myDomain}`);

      return new Response(text, {
        headers: {
          "content-type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store"
        }
      });
    }

    // Baaki files (images, fonts) ko waise hi jaane do
    return response;

  } catch (e) {
    return new Response("Analyzer Error: " + e.message, { status: 500 });
  }
}
  }
}
