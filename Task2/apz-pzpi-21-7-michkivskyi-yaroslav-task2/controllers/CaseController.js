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

            res.status(200).json("deleted");
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
            const allCases = await Case.find();

            const casesWithTripCases = await Promise.all(allCases.map(async (singleCase) => {
                const tripCases = await TripCase.find({ caseId: singleCase._id });

                const isFree = !tripCases.some(tripCase => tripCase.tripId && !tripCase.tripId.finishFact);


                return { ...singleCase.toObject(), isFree };
            }));

            // Sort firstly by isFree, then by inventory number
            const sortedCases = casesWithTripCases.sort((a, b) => {
                if (a.isFree !== b.isFree) {
                    return a.isFree - b.isFree;
                }
                return a.inventoryNumber - b.inventoryNumber;
            });

            res.status(200).json(sortedCases);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new CaseController();