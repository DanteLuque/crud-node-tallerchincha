
import express from 'express';
import pool from '../config/mysql.js';

const vehiculoRouter = express.Router();

vehiculoRouter.get('/', async(req, res) => {
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
    res.redirect('/')
  }catch(error){
    throw error;
  }
})

vehiculoRouter.get('/delete/:id', async(req, res)=> {
  try{
    const id = req.params.id;
    const [result] = await pool.query("DELETE FROM VEHICULOS WHERE ID = ?", [id]);
    console.log(`Columnas afectadas: ${result.affectedRows}`)
    res.redirect('/');
  }catch(error){
    throw error;
  }
})

vehiculoRouter.get('/edit/:id', async(req, res)=>{
  try{
    const id = req.params.id;
    const [marcas] = await pool.query("SELECT * FROM MARCAS");
    const [vehiculo] = await pool.query("SELECT * FROM VEHICULOS WHERE ID = ?", [id]);
    
    if (vehiculo.length===0) res.render('404');  
    
    res.render('vehiculo/edit', {marcas, vehiculo:vehiculo[0]});
  }catch(error){
    throw error;
  }
})

vehiculoRouter.post('/edit/:id', async(req,res)=>{
  try{
    const id = req.params.id;
    const {marcas, modelo, color, combustible, anio_fabricacion, condicion} = req.body
    await pool.query(`UPDATE VEHICULOS SET ID_MARCA=?,MODELO=?,COLOR=?,COMBUSTIBLE=?,ANIO_FABRICACION=?,CONDICION=? WHERE ID=?`,
                    [marcas, modelo, color, combustible, anio_fabricacion, condicion, id])
    res.redirect('/')
  }catch(error){
    throw error;
  }
})
export default vehiculoRouter;