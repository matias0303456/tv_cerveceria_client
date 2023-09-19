const API_URL = process.env.API_URL

export const urls = {
    units: `${API_URL}/units`,
    types: `${API_URL}/types`,
    ingredients: `${API_URL}/ingredients`,
    recipes: `${API_URL}/recipes`,
    records: `${API_URL}/records`,
    alarms: `${API_URL}/alarms`,
    ingredientsOnRecipes: `${API_URL}/ingredients-on-recipes`
}