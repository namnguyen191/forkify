import axios from 'axios';
import { apiKey, spoonacularAPIUrl } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
    
        try {
            const requestString = spoonacularAPIUrl + 'recipes/' + this.id + '/information' + '?apiKey=' + apiKey;
            const res =  await axios(requestString);
            this.title = res.data.title;
            this.creditsText = res.data.creditsText;
            this.sourceUrl = res.data.sourceUrl;
            this.img = res.data.image;
            this.ingredients = res.data.extendedIngredients;
            this.ingredients.forEach(ing => {
                let br = rationalize(bigRat(ing.amount),0.01);
                let dec = br.toString();
                let arr = dec.split('/');
                if (arr[1] === '1') {
                    ing.amountToDisplay = arr[0];
                } else {
                    ing.amountToDisplay = br.toString();
                }
                
            });
            this.prepTime = res.data.readyInMinutes;
            this.servings = res.data.servings;
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }

    updateServings(type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;


        // Ingredients
        this.ingredients.forEach(ing => {
            ing.amount = parseFloat(ing.amount) * (newServings / this.servings);
            ing.amount = formatDecimalToFraction(ing.amount);
        })
        this.servings = newServings;
    }

}

let bigRat = require("big-rational");

function rationalize(rational, epsilon) {
    let denominator = 0;
    let numerator;
    let error;

    do {
        denominator++;
        numerator = Math.round((rational.numerator * denominator) / rational.denominator);
        error = Math.abs(rational.minus(numerator / denominator));
    } while (error > epsilon);
    return bigRat(numerator, denominator);
}

