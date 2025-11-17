const axios = require('axios');

class CandleDataService {
    constructor() {
        this.baseUrl = 'https://api.bitget.com';
    }

    /**
     * 과거 캔들 데이터 가져오기
     * @param {string} symbol - 심볼 (예: BTCUSDT)
     * @param {string} interval - 간격 (1m, 5m, 15m, 1H, 4H, 1D)
     * @param {number} limit - 개수 (최대 1000)
     * @param {number} endTime - 종료 시간 (밀리초, 선택)
     */
    async getCandles(symbol, interval = '15m', limit = 1000, endTime = null) {
        try {
            const params = {
                symbol: symbol,
                productType: 'USDT-FUTURES',
                granularity: this.convertInterval(interval),
                limit: Math.min(limit, 1000).toString()
            };

            if (endTime) {
                params.endTime = endTime.toString();
            }

            console.log('📊 캔들 데이터 요청:', params);

            const response = await axios.get(`${this.baseUrl}/api/v2/mix/market/candles`, {
                params,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('📥 응답:', response.data);

            if (response.data && response.data.code === '00000') {
                return this.formatCandles(response.data.data);
            } else {
                throw new Error(`Bitget API 에러: ${response.data?.msg || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('캔들 데이터 조회 실패:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * 간격 변환 (우리 형식 → Bitget 형식)
     */
    convertInterval(interval) {
        const map = {
            '1m': '1m',
            '5m': '5m',
            '15m': '15m',
            '30m': '30m',
            '1h': '1H',
            '4h': '4H',
            '1d': '1D'
        };
        return map[interval.toLowerCase()] || '15m';
    }

    /**
     * 캔들 데이터 포맷
     */
    formatCandles(rawData) {
        if (!Array.isArray(rawData)) {
            return [];
        }

        return rawData.map(candle => ({
            timestamp: parseInt(candle[0]),
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5])
        })).sort((a, b) => a.timestamp - b.timestamp); // 시간순 정렬
    }

    /**
     * 여러 개 캔들 가져오기 (1000개 이상 필요 시)
     */
    async getMultipleCandles(symbol, interval, totalLimit) {
        const candles = [];
        let endTime = Date.now();
        const limit = 1000;

        while (candles.length < totalLimit) {
            const batch = await this.getCandles(symbol, interval, limit, endTime);
            
            if (batch.length === 0) {
                break;
            }

            candles.push(...batch);
            
            // 다음 배치를 위해 endTime 업데이트
            endTime = batch[0].timestamp - 1;

            // API 제한 방지
            await this.sleep(100);

            if (batch.length < limit) {
                break;
            }
        }

        return candles.slice(0, totalLimit).sort((a, b) => a.timestamp - b.timestamp);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new CandleDataService();