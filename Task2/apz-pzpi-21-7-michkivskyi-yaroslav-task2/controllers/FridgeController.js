const Fridge = require('../models/Fridge');
const Trip = require('../models/Trip');

class FridgeController {
    async addFridge(req, res) {
        try {
            const { inventoryNumber, latitude, longitude } = req.body;
            const newFridge = new Fridge({
                inventoryNumber,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
            });
            await newFridge.save();
            res.status(201).json(newFridge);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async editFridge(req, res) {
        try {
            const { id } = req.params;
            const { inventoryNumber } = req.body;

            const updatedFridge = await Fridge.findByIdAndUpdate(id, { inventoryNumber }, { new: true });

            if (!updatedFridge) {
                return res.status(404).json({ error: 'Fridge not found' });
            }

            res.status(200).json(updatedFridge);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async relocateFridge(req, res) {
        try {
            const { id } = req.params;
            const { latitude, longitude } = req.body;

            const updatedFridge = await Fridge.findByIdAndUpdate(
                id,
                {
                    location: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    timestamp: new Date()
                },
                { new: true }
            );

            if (!updatedFridge) {
                return res.status(404).json({ error: 'Fridge not found' });
            }

            res.status(200).json(updatedFridge);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteFridge(req, res) {
        try {
            const { id } = req.params;
            const deletedFridge = await Fridge.findByIdAndDelete(id);

            if (!deletedFridge) {
                return res.status(404).json({ error: 'Fridge not found' });
            }

            res.status(200).json({ message: 'Fridge deleted successfully' });
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
                .select('-__v -fridgeId');

            res.status(200).json({ fridge, trips });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getNearestFridge(req, res) {
        try {
            const fridgeId = req.params.id;
            const fridge = await Fridge.findById(fridgeId)

            const coordinates = fridge.location.coordinates

            const currentTime = new Date();
            const lastHourTime = new Date(currentTime.getTime() - 60 * 60 * 1000);

            // знаходимо найближчий активний холодильник до вказаного, що відправляв дані останньої години та вільний
            const nearestActiveFridge = await Fridge.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: coordinates
                        },
                        distanceField: "dist.calculated",
                        // spherical: true,
                        maxDistance: 10000, // Максимальна відстань у метрах
                        query: {
                            _id: {
                                $ne: fridgeId // Виключаємо наш рефрижератор з пошуку
                            },
                            timestamp: {
                                $gte: lastHourTime // Відправляв дані в останню годину
                            },
                            location: {
                                $exists: true
                            }
                        }
                    }
                },
                { $sort: { distance: 1 } },
                { $limit: 3 }
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