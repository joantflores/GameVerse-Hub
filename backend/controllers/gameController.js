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
