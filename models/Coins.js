const mongoose = require('mongoose');

const CoinsSchema = new mongoose.Schema({
    CoinGold: { type: Number, required: true },
    CoinDimond: { type: Number, required: true },
    CoinTN: { type: Number, required: true },
    CoinNG: { type: Number, required: true },
    CoinOF: { type: Number, required: true },
    UserID: { type: String, required: true }  
});

module.exports = mongoose.model('Coins', CoinsSchema);
