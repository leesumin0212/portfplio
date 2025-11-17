// ============================================
// BitSentinel - Portfolio Version
// ============================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// 미들웨어
// ============================================

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================
// 기본 라우트
// ============================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        message: 'BitSentinel API - Portfolio Version',
        version: '1.0.0',
        note: 'This is a portfolio version. Core trading logic is not included.'
    });
});

// ============================================
// 에러 핸들링
// ============================================

app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Server error'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Not found'
    });
});

// ============================================
// 서버 시작
// ============================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log('🚀 BitSentinel Server (Portfolio Version)');
    console.log('========================================');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`⚠️  Core trading features are not included`);
    console.log('========================================');
});

module.exports = app;