import { useState } from 'react'

const NutritionTracker = () => {
    const [nutritionData, setNutritionData] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        water: 0
    })

    const [meals, setMeals] = useState([])
    const [newMeal, setNewMeal] = useState({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: ''
    })

    const handleAddMeal = (e) => {
        e.preventDefault()
        setMeals([...meals, newMeal])
        setNutritionData({
            calories: nutritionData.calories + Number(newMeal.calories),
            protein: nutritionData.protein + Number(newMeal.protein),
            carbs: nutritionData.carbs + Number(newMeal.carbs),
            fats: nutritionData.fats + Number(newMeal.fats),
            water: nutritionData.water
        })
        setNewMeal({
            name: '',
            calories: '',
            protein: '',
            carbs: '',
            fats: ''
        })
    }

    const handleWaterIntake = () => {
        setNutritionData({
            ...nutritionData,
            water: nutritionData.water + 250 // Add 250ml
        })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Nutrition Tracker</h1>
            
            {/* Daily Summary */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Calories</h3>
                    <p className="text-2xl text-green-500">{nutritionData.calories}</p>
                    <p className="text-sm text-gray-500">Goal: 2000</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Protein</h3>
                    <p className="text-2xl text-blue-500">{nutritionData.protein}g</p>
                    <p className="text-sm text-gray-500">Goal: 150g</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Carbs</h3>
                    <p className="text-2xl text-orange-500">{nutritionData.carbs}g</p>
                    <p className="text-sm text-gray-500">Goal: 250g</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Fats</h3>
                    <p className="text-2xl text-yellow-500">{nutritionData.fats}g</p>
                    <p className="text-sm text-gray-500">Goal: 65g</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-2">Water</h3>
                    <p className="text-2xl text-blue-400">{nutritionData.water}ml</p>
                    <button 
                        onClick={handleWaterIntake}
                        className="mt-2 bg-blue-100 text-blue-500 px-4 py-1 rounded-full text-sm"
                    >
                        + Glass
                    </button>
                </div>
            </div>

            {/* Add Meal Form */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Add Meal</h2>
                <form onSubmit={handleAddMeal} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <input
                        type="text"
                        placeholder="Meal name"
                        value={newMeal.name}
                        onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                        className="p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Calories"
                        value={newMeal.calories}
                        onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                        className="p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Protein (g)"
                        value={newMeal.protein}
                        onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                        className="p-2 border rounded"
                    />
                    <input
                        type="number"
                        placeholder="Carbs (g)"
                        value={newMeal.carbs}
                        onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                        className="p-2 border rounded"
                    />
                    <button 
                        type="submit"
                        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Add Meal
                    </button>
                </form>
            </div>

            {/* Meal List */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Today's Meals</h2>
                <div className="space-y-4">
                    {meals.map((meal, index) => (
                        <div key={index} className="border-b pb-4">
                            <h3 className="font-semibold">{meal.name}</h3>
                            <div className="grid grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                                <p>Calories: {meal.calories}</p>
                                <p>Protein: {meal.protein}g</p>
                                <p>Carbs: {meal.carbs}g</p>
                                <p>Fats: {meal.fats}g</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NutritionTracker 