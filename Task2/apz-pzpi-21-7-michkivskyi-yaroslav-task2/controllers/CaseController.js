const Case = require('../models/Case');
const TripCase = require('../models/TripCase');

class CaseController {
    async addCase(req, res) {
        try {
            const { capacity, inventoryNumber } = req.body;
            const newCase = await Case.create({ capacity, inventoryNumber });
            res.status(201).json(newCase);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async editCase(req, res) {
        try {
            const { id } = req.params;
            const { capacity, inventoryNumber } = req.body;

            const updatedCase = await Case.findByIdAndUpdate(id, { capacity, inventoryNumber }, { new: true });

            if (!updatedCase) {
                return res.status(404).json({ error: 'Case not found' });
            }

            res.status(200).json(updatedCase);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteCase(req, res) {
        try {
            const { id } = req.params;
            const deletedCase = await Case.findByIdAndDelete(id);

            if (!deletedCase) {
                return res.status(404).json({ error: 'Case not found' });
            }

            res.status(200).json(deletedCase);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getCase(req, res) {
        try {
            const { id } = req.params;
            const foundCase = await Case.findById(id);

            if (!foundCase) {
                return res.status(404).json({ error: 'Case not found' });
            }

            const tripCases = await TripCase.find({ caseId: id });

            res.status(200).json({ foundCase, tripCases });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getAllCases(req, res) {
        try {
            // Получаем все кейсы из базы данных
            const allCases = await Case.find();

            // Для каждого кейса находим все TripCase, которые с ним связаны
            const casesWithTripCases = await Promise.all(allCases.map(async (singleCase) => {
                const tripCases = await TripCase.find({ caseId: singleCase._id });

                // Вычисляем занятость кейса (суммируем количество TripCase)
                const occupancy = tripCases.reduce((total, tripCase) => total + tripCase.price, 0);

                return { ...singleCase.toObject(), occupancy };
            }));

            // Сортируем кейсы сначала по занятости, затем по инвентарному номеру
            const sortedCases = casesWithTripCases.sort((a, b) => {
                if (a.occupancy !== b.occupancy) {
                    return a.occupancy - b.occupancy;
                }
                return a.inventoryNumber - b.inventoryNumber;
            });

            // Возвращаем отсортированные кейсы
            res.status(200).json(sortedCases);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new CaseController();