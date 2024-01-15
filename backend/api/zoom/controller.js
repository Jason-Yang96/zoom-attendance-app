const { createProxyMiddleware } = require('http-proxy-middleware')
const axios = require('axios')

module.exports = {
    // Proxy requests to the Zoom REST API
    proxy: createProxyMiddleware({
        target: process.env.ZOOM_HOST,
        changeOrigin: true,
        selfHandleResponse: true,
        pathRewrite: {
            '^/zoom/api': '',
        },
        onProxyRes: function (proxyRes, req, res) {
            // if (req.path === '/zoom/api/v2/users/me') {
            console.log(
                'ZOOM API UserHandleProxy ==============================================',
                '\n'
            )
            var body = []
            proxyRes
                .on('error', (err) => {
                    console.error(err)
                })
                .on('data', async (chunk) => {
                    body.push(chunk)
                })
                .on('end', async () => {
                    body = Buffer.concat(body).toString()
                    try {
                        const processDataResponse = await axios.post(
                            'http://processlogic.link/att/data/meeting',
                            JSON.parse(body),
                            {
                                headers: {
                                    'content-type': 'application/json',
                                },
                            }
                        )
                        body = processDataResponse.data
                        console.log(`Zoom API Proxy => participant`)
                    } catch (error) {
                        console.error(error)
                        res.status(500).json({
                            message: 'Internal Server Error',
                        })
                    }
                    console.log(
                        `Zoom API Proxy => ${req.method} ${req.path} -> [${proxyRes.statusCode}] ${body}`
                    )
                    res.json(body)
                })
        },
    }),
}
