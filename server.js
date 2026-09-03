import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
// This handles the automatic dynamic port assignment from Render
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Force the homepage to serve your custom index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. The proxy handler that strips security blocks from websites
app.use('/proxy', (req, res, next) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('No URL specified.');
    }

    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        followRedirects: true,
        logger: console,
        pathRewrite: {
            '^/proxy': '', 
        },
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Proxy application running cleanly on port ${PORT}`);
});
