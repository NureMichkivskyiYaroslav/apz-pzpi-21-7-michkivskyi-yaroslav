const TemperatureIndicator = require('../models/TemperatureIndicator');

const temperatureExceededService = {
    async calculateStatistics(tripCaseId) {
        // Отримуємо всі температурні показники для даного tripCase
        const indicators = await TemperatureIndicator.find({ tripCaseId });

        if (!indicators || indicators.length === 0) {
            return {
                time0to5: 0,
                timeAbove5: 0,
                averageExceed: 0
            };
        }

        let time0to5 = 0;
        let timeAbove5 = 0;
        let totalExceed = 0;
        let exceedCount = 0;

        indicators.forEach(indicator => {
            const { temperature, maxTemperature } = indicator;
            const exceed = temperature - maxTemperature;

            if (exceed > 0) {
                totalExceed += exceed;
                exceedCount++;

                // Додаємо одну хвилину, бо дані з датчиків приходять кожну хвилину
                if (exceed <= 5) {
                    time0to5 += 1;
                } else {
                    timeAbove5 += 1;
                }
            }
        });

        const averageExceed = exceedCount > 0 ? totalExceed / exceedCount : 0;

        return {
            time0to5,
            timeAbove5,
            averageExceed
        };
    }
};

module.exports = temperatureExceededService;