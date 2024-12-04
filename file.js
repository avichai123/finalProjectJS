
document.querySelector(".toggle-btn").addEventListener("click", () => {
    const savedDiv = document.getElementById("saved");
    savedDiv.classList.toggle("show");
});
const searchButton = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const performSearch = async () => {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        alert("Please enter a word");
        return;
    }
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=6b5ba6c353184cf5a32ca221a3e39eae&query=${searchTerm}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error("Error with API");
        }
        const data = await response.json();
        displayRecipes(data.results); 
        console.log(data);
        searchInput.value = '';
    } catch (error) {
        console.log('Error with loading:', error);
    }
};
searchButton.addEventListener("click", performSearch);
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        performSearch();
    }
});
function displayRecipes(recipes){
    console.log("OK");
    
    const recipesList = document.getElementById('recipe-list');
    recipesList.innerHTML = "";
    recipes.forEach(recipe => {
        const listItem = document.createElement('li');
        const img = document.createElement('img');
        const title = document.createElement('p');
        listItem.setAttribute('id' , recipe.id);
        img.src = recipe.image;
        img.alt = recipe.title;
        title.textContent = recipe.title;
        listItem.appendChild(img);
        listItem.appendChild(title);
        listItem.addEventListener('click', () => getInfo(recipe.id));
        recipesList.appendChild(listItem);
    });
}
const getInfo = async (recipeId)=> { 
    try{
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=6b5ba6c353184cf5a32ca221a3e39eae`,{
            method:"GET",
            headers:{"content-Type":"application/json",},
        });
        if(!response.ok){
            console.log('something went wrong');
        }
        const data = await response.json();
        selectedRecipe(data);
        console.log(data);
        
    }catch{
        console.log('error to choose recipe');
        
    }
}
function selectedRecipe(selectRecipe) {
 
    const containerSelectedRecipe = document.getElementById('recipe');
    containerSelectedRecipe.innerHTML = '';

    
    const imgRecipe = createImage(selectRecipe.image);
    const title = createTitle(selectRecipe.title);
    const saveRecipe = createSaveButton(selectRecipe);
    const servingsContainer = createServingsContainer(selectRecipe);
    const ingredientsList = createIngredientsList(selectRecipe.extendedIngredients);
    const shoppingListBtn = createShoppingListButton();
    const preparationInstructions = createPreparationInstructions(selectRecipe);

   
    const containerComponents = document.createElement('div');
    containerComponents.classList.add('container-components');
    containerComponents.appendChild(servingsContainer);
    containerComponents.appendChild(ingredientsList);
    containerComponents.appendChild(shoppingListBtn);

   
    containerSelectedRecipe.appendChild(title);
    containerSelectedRecipe.appendChild(imgRecipe);
    containerSelectedRecipe.appendChild(saveRecipe);
    containerSelectedRecipe.appendChild(containerComponents);
    containerSelectedRecipe.appendChild(preparationInstructions);
}


function createImage(src) {
    const img = document.createElement('img');
    img.src = src;
    return img;
}

function createTitle(text) {
    const title = document.createElement('h4');
    title.textContent = text;
    return title;
}

function createSaveButton(selectRecipe) {
    const saveRecipe = document.createElement('button');
    saveRecipe.textContent = '🤍';
    saveRecipe.classList.add('toggle-btn');
    saveRecipe.addEventListener('click', () =>
        savingARecipe(selectRecipe.title, selectRecipe.image, selectRecipe.id)
    );
    return saveRecipe;
}

function createServingsContainer(selectRecipe) {
    const servingsContainer = document.createElement('div');
    const prepTime = document.createElement('p');
    const serving = document.createElement('div'); 
    const servingNumber = document.createElement('span');
    const addServings = document.createElement('button');
    const removeServings = document.createElement('button');


    prepTime.textContent = `⏳ ${selectRecipe.readyInMinutes ? selectRecipe.readyInMinutes + ' min' : 'not mention'}`;
    prepTime.classList.add('prep-time');


    servingNumber.textContent = selectRecipe.servings;
    servingNumber.classList.add('servings-number');
    addServings.textContent = '+';
    removeServings.textContent = '-';
    addServings.addEventListener('click', () => updateServings(1, selectRecipe));
    removeServings.addEventListener('click', () => updateServings(-1, selectRecipe));
    serving.classList.add('servings');
    serving.appendChild(removeServings);
    serving.appendChild(servingNumber);
    serving.appendChild(addServings);

    servingsContainer.classList.add('servings-container');
    servingsContainer.appendChild(prepTime);
    servingsContainer.appendChild(serving);

    return servingsContainer;
}

function createIngredientsList(ingredients) {
    const ingredientsList = document.createElement('ul');
    ingredientsList.classList.add('ingredients-list');
    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.amount} ${ingredient.unit} ${ingredient.nameClean}`;
        ingredientsList.appendChild(li);
    });
    return ingredientsList;
}

function createShoppingListButton() {
    const shoppingListBtn = document.createElement('button');
    shoppingListBtn.textContent = 'Add to shopping list';
    shoppingListBtn.classList.add('shopping-list-btn');
    shoppingListBtn.addEventListener('click', addToShoppingList);
    return shoppingListBtn;
}

function createPreparationInstructions(selectRecipe) {
    const preparationInstructions = document.createElement('div');
    const header = document.createElement('h3');
    const par = document.createElement('p');
    const preparationInstructionsBtn = document.createElement('button');

    header.textContent = 'HOW TO COOK';
    par.textContent = `This recipe was carefully designed and tasted by ${selectRecipe.sourceName} Please check out directions on their website.`;
    preparationInstructionsBtn.textContent = 'DIRECTIONS';
    preparationInstructionsBtn.classList.add('shopping-list-btn');
    preparationInstructionsBtn.addEventListener('click', () => {
        window.open(selectRecipe.sourceUrl , '_blank');
    });

    preparationInstructions.classList.add('preparation-instructions');
    preparationInstructions.appendChild(header);
    preparationInstructions.appendChild(par);
    preparationInstructions.appendChild(preparationInstructionsBtn);

    return preparationInstructions;
}

function updateServings(amount ,selectRecipe){
    const servingNumber = document.querySelector('.servings-number')
    let currentServing = parseInt(servingNumber.textContent , 10);
    currentServing += amount;
    if (currentServing < 1){
        currentServing =1; 
    }
    servingNumber.textContent = currentServing;
    const ingredientList = document.querySelector('.ingredients-list');
    ingredientList.innerHTML = '';
    selectRecipe.extendedIngredients.forEach(ingredient => {
        const li = document.createElement('li');
        const newAmount = (ingredient.amount / selectRecipe.servings) * currentServing;
        li.textContent = `${newAmount.toFixed(2)} ${ingredient.unit || ''} ${ingredient.nameClean}`;
        ingredientList.appendChild(li);
    });

}
function addToShoppingList(){
    const shoppingList = document.getElementById('shopping-list');
    shoppingList.innerHTML = '';
    const ingredientsList = document.querySelectorAll('.ingredients-list li');
    ingredientsList.forEach(item => {
        const parts = item.textContent.split(' ');
        const li = document.createElement('li');
        const deleteBtn = document.createElement('button');
        const container = document.createElement('div');
        container.classList.add('amount-container');
        const quantityItem = document.createElement('input');
        const unit = document.createElement('label');
        const nameProduct = document.createElement('span');
        quantityItem.type = 'number';
        quantityItem.min = 0;
        quantityItem.step = parseFloat(parts[0]);
        quantityItem.value = parseFloat(parts[0]);
        quantityItem.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
                event.preventDefault();
            }
        });
        unit.textContent = (parts[1] === 'cup' || parts[1] === 'tps' || parts[1] == 'cups') ? parts[1] : '';
        nameProduct.textContent = parts.slice(2).join(' ');
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click' , () => li.remove());
        container.appendChild(quantityItem);
        container.appendChild(unit);
        li.appendChild(container);
        li.appendChild(nameProduct);
        li.appendChild(deleteBtn);
        shoppingList.appendChild(li);
    });
}

function savingARecipe(title, image , id){
    
    const containerSelectedRecipe = document.getElementById('recipe');
    const savedList = document.getElementById('saved-list');
    const existingRecipe = document.querySelector(`#saved-list li[id="${id}"]`);
    if (existingRecipe) {
        alert('This recipe is already saved!');
        return;
    }
    containerSelectedRecipe.innerHTML = '';

    const recipe = document.createElement('li');
    const imageRecipe = document.createElement('img');
    const titleRecipe = document.createElement('span');
    const deleteBtn = document.createElement('button');
    recipe.setAttribute('id',id);
    imageRecipe.src = image;
    imageRecipe.classList.add('style-photo');
    titleRecipe.textContent = title;
    deleteBtn.textContent = '🗑️';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', (event) =>{
        event.stopPropagation();
        deleteRecipe(recipe.id); 
    });
    recipe.appendChild(imageRecipe);
    recipe.appendChild(titleRecipe);
    recipe.addEventListener('click' ,() => getInfo(recipe.getAttribute('id')));
    recipe.appendChild(deleteBtn);
    savedList.appendChild(recipe);
    saveToLocalStorage({ id, title, image });
}
function deleteRecipe(id) {
    console.log('Deleting recipe with id:', id);
    let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || {};
    if (savedRecipes[id]) {
        delete savedRecipes[id]; 
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }
    const recipeElement = document.getElementById(id);
    if (recipeElement) {
        recipeElement.remove();
    }
}

function saveToLocalStorage(recipe) {
        let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || {};
        if(!savedRecipes[recipe.id]){
            savedRecipes[recipe.id] = recipe;
        }
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
}

function loadSavedRecipes() {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || {};
    const savedList = document.getElementById('saved-list');
    Object.keys(savedRecipes).forEach(id => {
        const recipe = savedRecipes[id];
        const listItem = document.createElement('li');
        const imageRecipe = document.createElement('img');
        const titleRecipe = document.createElement('span');
        const deleteBtn = document.createElement('button');
        listItem.setAttribute('id', recipe.id);
        imageRecipe.src = recipe.image;
        imageRecipe.classList.add('style-photo');
        titleRecipe.textContent = recipe.title;
        deleteBtn.textContent = '🗑️';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteRecipe(recipe.id); 
        });
        listItem.appendChild(imageRecipe);
        listItem.appendChild(titleRecipe);
        listItem.appendChild(deleteBtn); 
        listItem.addEventListener('click', () => getInfo(recipe.id));
        savedList.appendChild(listItem);
    });
}
window.onload = loadSavedRecipes;
