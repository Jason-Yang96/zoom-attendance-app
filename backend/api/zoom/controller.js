const { createProxyMiddleware } = require('http-proxy-middleware')
const axios = require('axios')

module.exports = {
    // Proxy requests to the Zoom REST API
    // userProxy: createProxyMiddleware({
    //     target: process.env.ZOOM_HOST,
    //     changeOrigin: true,
    //     pathRewrite: {
    //         '^/zoom/api': '',
    //     },
    //
    //     onProxyRes: function (proxyRes, req, res) {
    //         // if (req.path === '/zoom/api/v2/users/me') {
    //         console.log(
    //             'ZOOM API UserHandleProxy ==============================================',
    //             '\n'
    //         )
    //         var body = []
    //         proxyRes
    //             .on('error', (err) => {
    //                 console.error(err)
    //             })
    //             .on('data', (chunk) => {
    //                 body.push(chunk)
    //             })
    //             .on('end', () => {
    //                 body = Buffer.concat(body).toString()
    //                 // At this point, we have the headers, method, url and body, and can now
    //                 // do whatever we need to in order to respond to this request.
    //                 console.log(
    //                     `Zoom API Proxy => ${req.method} ${req.path} -> [${proxyRes.statusCode}] ${body}`
    //                 )
    //                 res.end() //프론트에 넘기고 끝냈다.
    //             })
    //     },
    // }),
    // } else {
    //             console.log(
    //                 'ZOOM API PARTICIPANTHANDLEPROXY ==============================================',
    //                 '\n'
    //             )
    //             var body = []
    //             proxyRes
    //                 .on('error', (err) => {
    //                     console.error(err)
    //                 })
    //                 .on('data', (chunk) => {
    //                     body.push(chunk)
    //                 })
    //                 .on('end', async () => {
    //                     body = Buffer.concat(body).toString()
    //                     // At this point, we have the headers, method, url and body, and can now
    //                     // do whatever we need to in order to respond to this request.
    //                     try {
    //                         const processDataResponse = await axios.post(
    //                             'http://processlogic.link/att/data/meeting',
    //                             body,
    //                             {
    //                                 headers: {
    //                                     'Content-Type': 'application/json',
    //                                 },
    //                             }
    //                         )
    //                         res.json(processDataResponse.data) //json으로 넘기고 끝낸다.
    //                         console.log(
    //                             `processed data => POST processlogic.link/att/data/meeting -> ${processDataResponse.data}`
    //                         )
    //                     } catch (error) {
    //                         console.error(error)
    //                         res.status(500).json({
    //                             message: 'Internal Server Error',
    //                         })
    //                     }
    //                 })
    //         }
    //     },
    // }),
    participantProxy: createProxyMiddleware({
        target: process.env.ZOOM_HOST,
        changeOrigin: true,
        pathRewrite: {
            '^/zoom/api': '',
        },

        onProxyRes: function (proxyRes, req, res) {
            console.log(
                'ZOOM API PARTICIPANTHANDLEPROXY ==============================================',
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
                        res.json(processDataResponse.data) //json으로 넘기고 끝낸다.
                        console.log(
                            `processed data => POST processlogic.link/att/data/meeting -> ${processDataResponse.data}`
                        )
                    } catch (error) {
                        console.error(error)
                        res.status(500).json({
                            message: 'Internal Server Error',
                        })
                    }
                })
        },
    }),
}
