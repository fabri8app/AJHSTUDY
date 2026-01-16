const fetch = require('node-fetch');

export default async function handler(req, res) {
    const targetUrl = 'https://deltastudy.site' + req.url;

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'User-Agent': req.headers['user-agent'],
                'Host': 'deltastudy.site',
                'Referer': 'https://deltastudy.site/',
                'Origin': 'https://deltastudy.site',
                'Cookie': req.headers['cookie'] || ''
            }
        });

        const contentType = response.headers.get('content-type');
        res.setHeader('Content-Type', contentType);
        
        // Security headers hata rahe hain taaki site block na ho
        res.setHeader('Access-Control-Allow-Origin', '*');

        const data = await response.buffer();
        res.send(data);

    } catch (error) {
        res.status(500).send('Proxy Error: ' + error.message);
    }
}
