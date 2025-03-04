import { useData } from '../context/DataContext';
import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import Badge from '../components/common/Badge';

const Recipes = () => {
    const { recipes, foods, searchRecipes } = useData();
    const [activeTab, setActiveTab] = useState('recipes');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        if (activeTab === 'recipes') {
            setSearchResults(searchRecipes(query));
        }
    };

    const renderRecipe = (recipe) => (
        <div key={recipe.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{recipe.name}</h3>
            <p className="text-gray-600 mt-2">{recipe.description}</p>
            <div className="mt-3">
                <Badge label={recipe.difficulty} variant={recipe.difficulty} />
                {recipe.dietaryInfo?.map(diet => (
                    <Badge key={diet} label={diet} className="ml-2" />
                ))}
            </div>
            <div className="mt-4">
                <h4 className="font-medium">Ingredients:</h4>
                <ul className="list-disc list-inside mt-2">
                    {recipe.ingredients?.slice(0, 5).map((ingredient, index) => (
                        <li key={index} className="text-sm">{ingredient}</li>
                    ))}
                </ul>
            </div>
            <div className="mt-4 text-sm">
                <p>⏱️ Prep Time: {recipe.prepTime} minutes</p>
                <p>🍽️ Servings: {recipe.servings}</p>
            </div>
        </div>
    );

    const renderFood = (food) => (
        <div key={food.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{food.name}</h3>
            <p className="text-gray-600 mt-2">Category: {food.category}</p>
            <div className="mt-4">
                <h4 className="font-medium">Nutritional Info:</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                        <p className="text-sm">Calories: {food.calories}</p>
                        <p className="text-sm">Serving: {food.servingSize}</p>
                    </div>
                    <div>
                        <p className="text-sm">Protein: {food.macros?.protein}g</p>
                        <p className="text-sm">Carbs: {food.macros?.carbs}g</p>
                        <p className="text-sm">Fats: {food.macros?.fats}g</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Nutrition Center</h1>

            {/* Navigation Tabs */}
            <div className="flex space-x-4 mb-6">
                {['recipes', 'foods'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === tab
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Search Bar for Recipes */}
            {activeTab === 'recipes' && (
                <div className="mb-6">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search recipes..."
                    />
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'recipes' && 
                    (searchResults.length > 0 ? searchResults : recipes).map(renderRecipe)}
                {activeTab === 'foods' && foods.map(renderFood)}
            </div>
        </div>
    );
};

export default Recipes;