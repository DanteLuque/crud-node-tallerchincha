
import express from 'express';
import pool from '../config/mysql.js';

const vehiculoRouter = express.Router();

vehiculoRouter.get('/vehiculo', async(req,res)=>{
  const vehiculos = await pool.query(`SELECT * FROM VEHICULOS`);
  res.send(vehiculos[0]);
});


export default vehiculoRouter;