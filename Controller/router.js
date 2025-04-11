const express = require('express');
const {ShowData,NewData,UpdateData,DeleteData,Login}=require('./ControllerUser');
const { ShowDataCoins, NewDataCoins, UpdateDataCoins, DeleteDataCoins,syncCoinsSchema } = require('./ControllerCoins');
const router = express.Router();

router.get("/users",ShowData);
router.post("/users", NewData);
router.put('/users/:id', UpdateData);
router.delete('/users/:id', DeleteData)

router.post("/login",Login)

router.get("/coins", ShowDataCoins);
router.post("/coins", NewDataCoins);
router.put('/coins/:id', UpdateDataCoins);
router.delete('/coins/:id', DeleteDataCoins);

syncCoinsSchema();
module.exports = router;