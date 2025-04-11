const User = require('../models/users');
const jwt = require('jsonwebtoken');
const Coins = require('../models/Coins');
const bcrypt = require('bcryptjs');

const ShowData = async (req, res) => {
    try {
        const ShowUsers = await User.find();
        res.send(ShowUsers);
        console.log(ShowUsers);
    } catch (error) {
        res.status(500).send('Error getting users: ' + error.message);
    }
};

const NewData = async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;

        const hashedPassword = await bcrypt.hash(Password, 10);

        const token = jwt.sign({ Email }, process.env.SECRETKEY, { expiresIn: '14d' });

        const newUser = new User({
            Name,
            Email,
            Password: hashedPassword,
            Token: token
        });

        await newUser.save();

        const newCoins = new Coins({
            CoinGold: 0,
            CoinDimond: 0,
            CoinTN: 0,
            CoinNG: 0,
            CoinOF: 0,
            UserID: newUser._id  
        });

        await newCoins.save();

        res.json({
            user: newUser,
            coins: newCoins
        });

        console.log('User created:', newUser);
        console.log('Coins created:', newCoins);

    } catch (error) {
        res.status(500).send('Error adding user: ' + error.message);
    }
};

const UpdateData = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Email, Password } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.Name = Name || user.Name;
        user.Email = Email || user.Email;

        if (Password) {
            user.Password = await bcrypt.hash(Password, 10);
        }

        await user.save();

        res.json(user);
        console.log('User updated:', user);

    } catch (error) {
        res.status(500).send('Error updating user: ' + error.message);
    }
};

const DeleteData = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        await Coins.findOneAndDelete({ User: id });

        await User.findByIdAndDelete(id);

        res.send('User and associated coins deleted successfully');
        console.log('User and coins deleted:', id);

    } catch (error) {
        res.status(500).send('Error deleting user: ' + error.message);
    }
};

const Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(Password, user.Password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, Email: user.Email },
            process.env.SECRETKEY,
            { expiresIn: '14d' }
        );

        user.Token = token;
        await user.save();

        res.status(200).json({
            message: `Login successful welcome ${user.Name}`,
            user: { id: user._id, Name: user.Name, Email: user.Email }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in: ' + error.message });
    }
};


module.exports = {
    ShowData,
    NewData,
    UpdateData,
    DeleteData,
    Login
};
