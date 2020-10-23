import { elements, elementStrings } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

// 'Pasta with tomato and spinach'
export const limiteRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0)
        return `${newTitle.join(' ')} ...`;
    }
    return title;
    
};

const renderRecipe = recipe => {
    const markup  = `
    <li>
        <a class="results__link" href="#${recipe.id}">
            <figure class="results__fig">
                <img src="${recipe.image}" alt="${recipe.title} image">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limiteRecipeTitle(recipe.title)}</h4>
                <p class="results__author">Ready in ${recipe.readyInMinutes} minutes</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// type: prev or next
const createButton = (page, type) => `
                                        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                                            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                                            <svg class="search__icon">
                                                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                                            </svg>
                                        </button>
`;

const renderButtons = (page, numOfRes, resPerPage) => {
    const pages = Math.ceil(numOfRes / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Only Button to go to next page
        button = createButton(page, 'next')
    } else if (page < pages) {
        // Both button
        button = `${createButton(page, 'next')}
                  ${createButton(page, 'prev')}`;
    } else if (page === pages && pages > 1) {
        // Only Button to go to previous page
        button = createButton(page, 'prev')
    }
    elements.searchResultPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // Render pagination
    renderButtons(page, recipes.length, resPerPage);
};
