import { buscarJuegos } from "./igdbService.js";

buscarJuegos("battlefield").then(juegos => {
    console.log(juegos);
});