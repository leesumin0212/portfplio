const {
    SMA, EMA, WMA, RSI, MACD, BollingerBands,
    Stochastic, ATR, ADX, OBV, VWAP,
    CCI, WilliamsR, MFI, ROC
} = require('technicalindicators');

class IndicatorService {
    
    // ==================== 이동평균 ====================
    
    // SMA (Simple Moving Average)
    calculateSMA(prices, period = 20) {
        return SMA.calculate({
            period: period,
            values: prices
        });
    }
    
    // EMA (Exponential Moving Average)
    calculateEMA(prices, period = 20) {
        return EMA.calculate({
            period: period,
            values: prices
        });
    }
    
    // WMA (Weighted Moving Average)
    calculateWMA(prices, period = 20) {
        return WMA.calculate({
            period: period,
            values: prices
        });
    }
    
    // ==================== 모멘텀 ====================
    
    // RSI (Relative Strength Index)
    calculateRSI(prices, period = 14) {
        return RSI.calculate({
            period: period,
            values: prices
        });
    }
    
    // MACD
    calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
        return MACD.calculate({
            values: prices,
            fastPeriod: fastPeriod,
            slowPeriod: slowPeriod,
            signalPeriod: signalPeriod,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        });
    }
    
    // Stochastic Oscillator
    calculateStochastic(high, low, close, period = 14, signalPeriod = 3) {
        return Stochastic.calculate({
            high: high,
            low: low,
            close: close,
            period: period,
            signalPeriod: signalPeriod
        });
    }
    
    // CCI (Commodity Channel Index)
    calculateCCI(high, low, close, period = 20) {
        return CCI.calculate({
            high: high,
            low: low,
            close: close,
            period: period
        });
    }
    
    // Williams %R
    calculateWilliamsR(high, low, close, period = 14) {
        return WilliamsR.calculate({
            high: high,
            low: low,
            close: close,
            period: period
        });
    }
    
    // MFI (Money Flow Index)
    calculateMFI(high, low, close, volume, period = 14) {
        return MFI.calculate({
            high: high,
            low: low,
            close: close,
            volume: volume,
            period: period
        });
    }
    
    // ROC (Rate of Change)
    calculateROC(prices, period = 12) {
        return ROC.calculate({
            values: prices,
            period: period
        });
    }
    
    // ==================== 변동성 ====================
    
    // Bollinger Bands
    calculateBollingerBands(prices, period = 20, stdDev = 2) {
        return BollingerBands.calculate({
            period: period,
            values: prices,
            stdDev: stdDev
        });
    }
    
    // ATR (Average True Range)
    calculateATR(high, low, close, period = 14) {
        return ATR.calculate({
            high: high,
            low: low,
            close: close,
            period: period
        });
    }
    
    // ==================== 추세 ====================
    
    // ADX (Average Directional Index)
    calculateADX(high, low, close, period = 14) {
        return ADX.calculate({
            high: high,
            low: low,
            close: close,
            period: period
        });
    }
    
    // ==================== 거래량 ====================
    
    // OBV (On Balance Volume)
    calculateOBV(close, volume) {
        return OBV.calculate({
            close: close,
            volume: volume
        });
    }
    
    // VWAP (Volume Weighted Average Price)
    calculateVWAP(high, low, close, volume) {
        return VWAP.calculate({
            high: high,
            low: low,
            close: close,
            volume: volume
        });
    }
    
    // ==================== 고급 지표 ====================
    
    // SuperTrend
    calculateSuperTrend(high, low, close, period = 10, multiplier = 3) {
        const atr = this.calculateATR(high, low, close, period);
        const supertrend = [];
        
        for (let i = period; i < close.length; i++) {
            const hl2 = (high[i] + low[i]) / 2;
            const upperBand = hl2 + (multiplier * atr[i - period]);
            const lowerBand = hl2 - (multiplier * atr[i - period]);
            
            supertrend.push({
                upperBand,
                lowerBand,
                trend: close[i] > lowerBand ? 'bullish' : 'bearish'
            });
        }
        
        return supertrend;
    }
    
    // Ichimoku Cloud (간단 버전)
    calculateIchimoku(high, low, close) {
        const tenkanPeriod = 9;
        const kijunPeriod = 26;
        const senkouBPeriod = 52;
        
        const ichimoku = [];
        
        for (let i = Math.max(tenkanPeriod, kijunPeriod, senkouBPeriod); i < close.length; i++) {
            // Tenkan-sen (전환선)
            const tenkanHigh = Math.max(...high.slice(i - tenkanPeriod, i));
            const tenkanLow = Math.min(...low.slice(i - tenkanPeriod, i));
            const tenkan = (tenkanHigh + tenkanLow) / 2;
            
            // Kijun-sen (기준선)
            const kijunHigh = Math.max(...high.slice(i - kijunPeriod, i));
            const kijunLow = Math.min(...low.slice(i - kijunPeriod, i));
            const kijun = (kijunHigh + kijunLow) / 2;
            
            // Senkou Span A (선행스팬 A)
            const senkouA = (tenkan + kijun) / 2;
            
            // Senkou Span B (선행스팬 B)
            const senkouBHigh = Math.max(...high.slice(i - senkouBPeriod, i));
            const senkouBLow = Math.min(...low.slice(i - senkouBPeriod, i));
            const senkouB = (senkouBHigh + senkouBLow) / 2;
            
            ichimoku.push({
                tenkan,
                kijun,
                senkouA,
                senkouB,
                signal: close[i] > senkouA && close[i] > senkouB ? 'bullish' : 'bearish'
            });
        }
        
        return ichimoku;
    }
    
    // Parabolic SAR (간단 버전)
    calculateParabolicSAR(high, low, close, step = 0.02, max = 0.2) {
        const sar = [];
        let trend = 'bullish';
        let af = step;
        let ep = high[0];
        let currentSAR = low[0];
        
        for (let i = 1; i < close.length; i++) {
            if (trend === 'bullish') {
                currentSAR = currentSAR + af * (ep - currentSAR);
                
                if (close[i] < currentSAR) {
                    trend = 'bearish';
                    currentSAR = ep;
                    ep = low[i];
                    af = step;
                } else if (high[i] > ep) {
                    ep = high[i];
                    af = Math.min(af + step, max);
                }
            } else {
                currentSAR = currentSAR - af * (currentSAR - ep);
                
                if (close[i] > currentSAR) {
                    trend = 'bullish';
                    currentSAR = ep;
                    ep = high[i];
                    af = step;
                } else if (low[i] < ep) {
                    ep = low[i];
                    af = Math.min(af + step, max);
                }
            }
            
            sar.push({
                value: currentSAR,
                trend: trend
            });
        }
        
        return sar;
    }
    
    // ==================== 헬퍼 함수 ====================
    
    // 캔들 데이터에서 배열 추출
    extractArrays(candles) {
        return {
            high: candles.map(c => c.high),
            low: candles.map(c => c.low),
            close: candles.map(c => c.close),
            open: candles.map(c => c.open),
            volume: candles.map(c => c.volume)
        };
    }
    
    // 모든 지표 한번에 계산
    calculateAll(candles, config = {}) {
        const { high, low, close, open, volume } = this.extractArrays(candles);
        
        return {
            // 이동평균
            sma20: this.calculateSMA(close, 20),
            sma50: this.calculateSMA(close, 50),
            ema20: this.calculateEMA(close, 20),
            ema50: this.calculateEMA(close, 50),
            wma20: this.calculateWMA(close, 20),
            
            // 모멘텀
            rsi: this.calculateRSI(close, 14),
            macd: this.calculateMACD(close),
            stochastic: this.calculateStochastic(high, low, close),
            cci: this.calculateCCI(high, low, close),
            williamsR: this.calculateWilliamsR(high, low, close),
            mfi: this.calculateMFI(high, low, close, volume),
            roc: this.calculateROC(close),
            
            // 변동성
            bollingerBands: this.calculateBollingerBands(close),
            atr: this.calculateATR(high, low, close),
            
            // 추세
            adx: this.calculateADX(high, low, close),
            
            // 거래량
            obv: this.calculateOBV(close, volume),
            vwap: this.calculateVWAP(high, low, close, volume),
            
            // 고급
            supertrend: this.calculateSuperTrend(high, low, close),
            ichimoku: this.calculateIchimoku(high, low, close),
            parabolicSAR: this.calculateParabolicSAR(high, low, close)
        };
    }
}

module.exports = new IndicatorService();