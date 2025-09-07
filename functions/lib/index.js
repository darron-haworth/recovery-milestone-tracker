"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_slow_down_1 = __importDefault(require("express-slow-down"));
const admin = __importStar(require("firebase-admin"));
const functions = __importStar(require("firebase-functions"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Initialize Firebase Admin
admin.initializeApp();
// Import routes
const auth_js_1 = __importDefault(require("./routes/auth.js"));
const friends_js_1 = __importDefault(require("./routes/friends.js"));
const milestones_js_1 = __importDefault(require("./routes/milestones.js"));
const notifications_js_1 = __importDefault(require("./routes/notifications.js"));
const user_js_1 = __importDefault(require("./routes/user.js"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            baseUri: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            formAction: ["'self'"],
            frameAncestors: ["'self'"],
            objectSrc: ["'none'"],
            scriptSrcAttr: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: {
        maxAge: 15552000,
        includeSubDomains: true,
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true,
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:8081',
        'https://recovery-milestone-tracker.web.app',
        'https://recovery-milestone-tracker.firebaseapp.com',
        // Add your production domains here
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
// Compression
app.use((0, compression_1.default)());
// Logging
app.use((0, morgan_1.default)('combined'));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Slow down repeated requests
const speedLimiter = (0, express_slow_down_1.default)({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: 500, // begin adding 500ms of delay per request above 50
});
app.use(speedLimiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'production',
        version: '1.0.0',
    });
});
// API routes
app.use('/api/auth', auth_js_1.default);
app.use('/api/user', user_js_1.default);
app.use('/api/friends', friends_js_1.default);
app.use('/api/milestones', milestones_js_1.default);
app.use('/api/notifications', notifications_js_1.default);
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json(Object.assign({ success: false, error: err.message || 'Internal Server Error' }, (process.env.NODE_ENV === 'development' && { stack: err.stack })));
});
// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map