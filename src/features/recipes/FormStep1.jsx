export function FormStep1({ recipe, handleChangeRecipe }) {
    return (
        <div style={{ width: '50%', margin: '0 auto', marginTop: 10 }}>
            <form onChange={handleChangeRecipe}>
                <label htmlFor="name">Nombre</label>
                <input type="text" name="name" value={recipe.name} />

                <label htmlFor="style">Estilo</label>
                <input type="text" name="style" value={recipe.style} />

                <label htmlFor="initial_density">Densidad inicial</label>
                <input type="number" name="initial_density" step="0.1" value={recipe.initial_density} />

                <label htmlFor="final_density">Densidad final</label>
                <input type="number" name="final_density" step="0.1" value={recipe.final_density} />

                <label htmlFor="alcohol_content">% Alcohol</label>
                <input type="number" name="alcohol_content" step="0.1" value={recipe.alcohol_content} />

                <label htmlFor="ibu">IBU</label>
                <input type="number" name="ibu" step="0.1" value={recipe.ibu} />

                <label htmlFor="time">Tiempo</label>
                <input type="number" name="time" step="1" value={recipe.time} />
            </form>
        </div>
    )
}