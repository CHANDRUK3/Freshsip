// Simple test API endpoint
export default function handler(req, res) {
    try {
        // Test environment variables
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            env_check: {
                MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING',
                JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING', 
                NODE_ENV: process.env.NODE_ENV || 'undefined'
            },
            mongodb_uri_length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
