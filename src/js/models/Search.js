import axios from 'axios';
import { apiKey, spoonacularAPIUrl } from '../config';

export default class Search {
    constructor(query, numbOfResults = 30) {
        this.query = query;
        this.numbOfResults = numbOfResults;
    }
    
    async getResults() {
        
        
        const requestString = spoonacularAPIUrl + 'recipes/search?query=' + this.query + '&number=' + this.numbOfResults +  '&apiKey=' + apiKey;
        try {
            const result = await axios(requestString);
            this.result = result.data.results;
            this.result.forEach( x => {
                x.image = 'https://spoonacular.com/recipeImages/' + x.image;
            });
            // console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}