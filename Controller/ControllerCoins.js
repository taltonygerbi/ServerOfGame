const Coins = require('../models/Coins');

const ShowDataCoins = async (req, res) => {
    try {
        const coins = await Coins.find();
        res.json(coins);
    } catch (error) {
        res.status(500).send('Error getting coins: ' + error.message);
    }
};


const NewDataCoins = async (req, res) => {
    try {
        const { CoinGold, CoinDimond, CoinTN, CoinNG, CoinOF, UserID } = req.body;
        const newCoins = new Coins({ CoinGold, CoinDimond, CoinTN, CoinNG, CoinOF, UserID });
        await newCoins.save();

        const io = req.app.get('socketio');
        io.emit('coinUpdate', newCoins);

        res.json(newCoins);
    } catch (error) {
        res.status(500).send('Error adding coins: ' + error.message);
    }
};

const UpdateDataCoins = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCoins = await Coins.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCoins) {
            return res.status(404).send('Coins data not found');
        }

        const io = req.app.get('socketio');
        io.emit('coinUpdate', updatedCoins);

        res.json(updatedCoins);
    } catch (error) {
        res.status(500).send('Error updating coins: ' + error.message);
    }
};

const DeleteDataCoins = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCoins = await Coins.findByIdAndDelete(id);

        if (!deletedCoins) {
            return res.status(404).send('Coins data not found');
        }

        const io = req.app.get('socketio');
        io.emit('coinUpdate', deletedCoins);

        res.json(deletedCoins);
    } catch (error) {
        res.status(500).send('Error deleting coins: ' + error.message);
    }
};

const syncCoinsSchema = async () => {
    try {
        console.log('🔄 Syncing coins schema dynamically...');

        const schemaFields = Object.keys(Coins.schema.paths).filter(
            field => field !== '_id' && field !== '__v'
        );

        const allCoins = await Coins.find();

        for (const coin of allCoins) {
            let updated = false;

            for (const field of schemaFields) {
                if (coin[field] === undefined) {
                    coin[field] = 0;
                    updated = true;
                }
            }

            if (updated) {
                await coin.save();
                console.log(`🛠 Updated missing fields for user: ${coin.UserID}`);
            }
        }

        console.log('✅ Coins synced with schema!');
    } catch (err) {
        console.error('❌ Error syncing coins schema:', err.message);
    }
};
module.exports = { ShowDataCoins, NewDataCoins, UpdateDataCoins, DeleteDataCoins,syncCoinsSchema };
