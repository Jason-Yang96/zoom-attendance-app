const { createProxyMiddleware } = require('http-proxy-middleware')
const axios = require('axios')

module.exports = {
    // Proxy requests to the Zoom REST API
    proxy: createProxyMiddleware({
        target: process.env.ZOOM_HOST,
        changeOrigin: true,
        pathRewrite: {
            '^/zoom/api': '',
        },

        onProxyRes: function (proxyRes, req, res) {
            console.log(
                'ZOOM API PROXY ==============================================',
                '\n'
            )

            var body = []
            proxyRes
                .on('error', (err) => {
                    console.error(err)
                })
                .on('data', (chunk) => {
                    body.push(chunk)
                })
                .on('end', async () => {
                    body = Buffer.concat(body).toString()
                    // At this point, we have the headers, method, url and body, and can now
                    // do whatever we need to in order to respond to this request.
                    const reqPath = req.path
                    if (reqPath === '/v2/users/me') {
                        console.log(
                            `Zoom API Proxy => ${req.method} ${reqPath} -> [${proxyRes.statusCode}] ${body}`
                        )
                        res.end()
                    } else {
                        try {
                            const processDataResponse = await axios.post(
                                'http://processlogic.link/att/data/meeting',
                                body,
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                }
                            )
                            res.json(processDataResponse.data)
                            console.log(
                                `processed data => POST processlogic.link/att/data/meeting -> ${body}`
                            )
                        } catch (error) {
                            console.error(error)
                            res.status(500).json({
                                message: 'Internal Server Error',
                            })
                        }
                    }
                })
        },
    }),
}
