'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

// ═══════════════════════════════════════════════════════════════════════
// SECURITY MIDDLEWARE - HELMET (15+ headers in one call)
// ═══════════════════════════════════════════════════════════════════════
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                // External GSAP from cdnjs — no unsafe-inline needed
                "https://cdnjs.cloudflare.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",   // CSS custom properties require this
                "https://fonts.googleapis.com"
            ],
            fontSrc: [
                "'self'",
                "https://fonts.gstatic.com",
                "data:"
            ],
            imgSrc: [
                "'self'",
                "data:",
                "blob:",
                "https://images.unsplash.com",
                "https://meganuel.com.ng"
            ],
            connectSrc: ["'self'"],
            frameSrc:   ["'none'"],   // Prevents Clickjacking via iframes
            objectSrc:  ["'none'"],   // Blocks Flash / old plugins
            formAction: ["'self'"],   // Forms can only submit to same origin
            upgradeInsecureRequests: [],
        }
    },
    // Prevents browsers from detecting content type to prevent MIME sniffing
    noSniff: true,
    // Enables XSS filter in older browsers
    xssFilter: true,
    // Prevents site from loading in iFrames (Clickjacking protection)
    frameguard: { action: 'deny' },
    // Forces HTTPS connections for 1 year
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    // Hides server "powered by express" info
    hidePoweredBy: true,
    // Prevents referrer data leakage on cross-origin requests
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// ═══════════════════════════════════════════════════════════════════════
// RATE LIMITING - Prevent DDoS & Brute Force Attacks
// ═══════════════════════════════════════════════════════════════════════
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200,                  // Max 200 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: 'Too many requests, please slow down.'
    }
});
app.use(limiter);

// Stricter limit for any API/form endpoints
const formLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10,                   // Max 10 form submissions per window
    message: { status: 429, error: 'Too many submissions. Please wait.' }
});

// ═══════════════════════════════════════════════════════════════════════
// CORS
// ═══════════════════════════════════════════════════════════════════════
app.use(cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// ═══════════════════════════════════════════════════════════════════════
// PERFORMANCE MIDDLEWARE
// ═══════════════════════════════════════════════════════════════════════
// Gzip all responses for faster page loads (critical for mobile in Nigeria)
app.use(compression({
    level: 9,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

// Parse JSON bodies (for future API use)
app.use(express.json({ limit: '10kb' }));  // Limit body size to prevent payload attacks

// ═══════════════════════════════════════════════════════════════════════
// SERVE STATIC FILES
// ═══════════════════════════════════════════════════════════════════════
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '7d',  // Cache static assets for 7 days (huge performance boost)
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // Always revalidate HTML and JS so updates are served immediately
        if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        }
    }
}));

// ═══════════════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════════════
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check for uptime monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        company: 'Meganuel Consortium',
        timestamp: new Date().toISOString()
    });
});

// ═══════════════════════════════════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════════════════════════════════
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL ERROR HANDLER
// ═══════════════════════════════════════════════════════════════════════
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({ status: 500, error: 'Internal Server Error' });
});

// ═══════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║          MEGANUEL CONSORTIUM SERVER RUNNING          ║
║                                                      ║
║  Local:    http://localhost:${PORT}                  ║
║  Security: Helmet + CORS + Rate Limiter ACTIVE       ║
║  Mode:     ${process.env.NODE_ENV || 'development'}  ║
╚══════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
