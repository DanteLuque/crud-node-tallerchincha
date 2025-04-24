
import express from 'express';
import pool from '../config/mysql.js';

const vehiculoRouter = express.Router();

vehiculoRouter.get('/vehiculos', async (req, res) => {
  const query = `
    SELECT V.ID, M.NOMBRE AS MARCA, V.MODELO, V.COLOR, V.COMBUSTIBLE, V.ANIO_FABRICACION, V.CONDICION
	  FROM VEHICULOS V
	  INNER JOIN MARCAS M
    ON V.ID_MARCA = M.ID;
  `
  try {
    const [vehiculos] = await pool.query(query);
    res.render('vehiculo/index', {vehiculos});
  } catch (error) {
    throw error;
  }
});

vehiculoRouter.get('/create', async(req, res)=>{
  try{
    const [marcas] = await pool.query("SELECT * FROM MARCAS");
    res.render('vehiculo/create', {marcas});
  }catch(error){
    throw error;
  }
})

vehiculoRouter.post('/create', async(req,res)=>{
  
  try{
    const {marcas, modelo, color, combustible, anio_fabricacion, condicion} = req.body
    await pool.query(`INSERT INTO VEHICULOS(ID_MARCA,MODELO,COLOR,COMBUSTIBLE,ANIO_FABRICACION,CONDICION) VALUES 
	                    (?,?,?,?,?,?)`,
                    [marcas, modelo, color, combustible, anio_fabricacion, condicion])
    res.redirect('/vehiculos')
  }catch(error){
    throw error;
  }
})


export default vehiculoRouter;