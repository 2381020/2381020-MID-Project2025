import { useState, useEffect } from "react";
import { fetchData, createData, deleteData, updateData } from "../services/apiService";

// Definisi Interface Recipe
interface Recipe {
  id: number;
  name: string;
  ingredients: string;
}

const Recipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [newName, setNewName] = useState("");
  const [newIngredients, setNewIngredients] = useState("");

  useEffect(() => {
    fetchData<{ recipes: Recipe[] }>("recipes").then((data) => setRecipes(data.recipes));
  }, []);

  const addRecipe = async () => {
    if (newName.trim() !== "" && newIngredients.trim() !== "") {
      const recipe = await createData<Recipe>("recipes/add", { name: newName, ingredients: newIngredients });
      if (recipe && recipe.id) {
        setRecipes([{ ...recipe }, ...recipes]);
      }
      setNewName("");
      setNewIngredients("");
    }
  };

  const updateRecipe = async (id: number, name: string, ingredients: string) => {
    const updatedName = prompt("Edit name:", name);
    const updatedIngredients = prompt("Edit ingredients:", ingredients);
    if (updatedName !== null && updatedIngredients !== null && updatedName.trim() !== "" && updatedIngredients.trim() !== "") {
      const updatedRecipe = await updateData<Recipe>("recipes", id, { name: updatedName, ingredients: updatedIngredients });
      setRecipes(recipes.map((recipe) => (recipe.id === id ? { ...recipe, name: updatedRecipe.name, ingredients: updatedRecipe.ingredients } : recipe)));
    }
  };

  const removeRecipe = async (id: number) => {
    await deleteData("recipes", id);
    setRecipes(recipes.filter((recipe) => recipe.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-center mb-4">Recipes</h2>
      <div className="mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter recipe name"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <textarea
          value={newIngredients}
          onChange={(e) => setNewIngredients(e.target.value)}
          placeholder="Enter ingredients"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button onClick={addRecipe} className="mt-2 w-full bg-blue-500 text-white py-2 rounded">
          Add Recipe
        </button>
      </div>

      <div className="space-y-3">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="flex flex-col bg-white p-3 rounded shadow">
            <h3 className="font-bold text-lg">{recipe.name}</h3>
            <p className="text-gray-700">{recipe.ingredients}</p>
            <div className="flex justify-end space-x-2 mt-2">
              <button onClick={() => updateRecipe(recipe.id, recipe.name, recipe.ingredients)} className="text-yellow-500">✎</button>
              <button onClick={() => removeRecipe(recipe.id)} className="text-red-500">✖</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
