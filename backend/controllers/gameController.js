/*Aqui se una busqueda desde el frontend, consulta el servicio de IGDB para obtener juegos relacionados 
y devuelve los resultados en JSON, funcionando como el puente que permite traer informacion de videojuegos al SPA.*/

import { buscarJuegos } from '../services/igdbService.js';

export const getGames = async (req, res) => {
    const query = req.query.q || 'battlefield';
    try {
        const games = await searchGames(query);
        res.json(games);
    } catch (error) {
        console.error('Error al obtener los juegos:', error);
        res.status(500).json({ message: 'Error al obtener los juegos' });
    }
};
