const Fridge = require('../models/Fridge');
const Trip = require('../models/Trip');

class FridgeController {
    async addFridge(req, res) {
        try {
            // Логика добавления нового холодильника
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async editFridge(req, res) {
        try {
            // Логика редактирования холодильника
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteFridge(req, res) {
        try {
            // Логика удаления холодильника
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getFridge(req, res) {
        try {
            const fridgeId = req.params.id;
            const fridge = await Fridge.findById(fridgeId);

            if (!fridge) {
                return res.status(404).json({ error: 'Fridge not found' });
            }

            const trips = await Trip.find({ fridgeId: fridge._id })
                .sort({ status: 1, start: 1 })
                .select('status start');

            res.status(200).json({ fridge, trips });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getNearestFridge(req, res) {
        try {
            const { fridgeId, latitude, longitude } = req.query; // Получаем айди рефрижератора и координаты из запроса
            const coordinates = [parseFloat(longitude), parseFloat(latitude)]; // Преобразуем координаты в массив чисел

            // Получаем текущее время
            const currentTime = new Date();
            // Вычисляем время, прошедшее за последний час
            const lastHourTime = new Date(currentTime.getTime() - 60 * 60 * 1000);

            // Находим ближайший активный холодильник к указанному айди, который отправлял данные за последний час и свободный
            const nearestActiveFridge = await Fridge.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: coordinates
                        },
                        distanceField: "distance",
                        spherical: true,
                        maxDistance: 10000, // Максимальное расстояние в метрах (задайте нужное значение)
                        query: {
                            _id: {
                                $ne: fridgeId // Исключаем указанный рефрижератор из поиска
                            },
                            timestamp: {
                                $gte: lastHourTime // Холодильник должен отправлять данные за последний час
                            },
                            location: {
                                $exists: true // Проверяем, что у холодильника есть данные о местоположении
                            }
                        }
                    }
                },
                { $sort: { distance: 1 } }, // Сортируем по расстоянию
                { $limit: 3 } // Берем только ближайший холодильник
            ]);

            if (nearestActiveFridge.length === 0) {
                return res.status(404).json({ error: 'No nearest active free fridge found in 10km radius' });
            }

            res.status(200).json(nearestActiveFridge[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllFridges(req, res) {
        try {
            const fridges = await Fridge.find()
                .sort({ timestamp: 1, inventoryNumber: 1 });

            const fridgesInfo = await Promise.all(fridges.map(async (fridge) => {
                const trips = await Trip.find({ fridgeId: fridge._id })
                    .sort({ status: 1, start: 1 })
                    .select('status start');
                return {
                    fridge,
                    trips
                };
            }));

            res.status(200).json(fridgesInfo);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new FridgeController();