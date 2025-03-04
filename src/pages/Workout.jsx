import { useData } from '../context/DataContext';
import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import Badge from '../components/common/Badge';

const Workout = () => {
    const {
        exercises,
        workoutPlans,
        challenges,
        achievements,
        searchExercises,
    } = useData();

    const [activeTab, setActiveTab] = useState('workoutPlans');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (query) => {
        if (activeTab === 'exercises') {
            setSearchResults(searchExercises(query));
        }
    };

    const renderWorkoutPlan = (plan) => (
        <div key={plan.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-gray-600 mt-2">{plan.description}</p>
            <div className="mt-4">
                <h4 className="font-medium">Weekly Schedule:</h4>
                {Object.entries(plan.schedule).map(([day, workout]) => (
                    <div key={day} className="mt-2">
                        <span className="font-medium">{day}: </span>
                        <span>{workout.focus}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderExercise = (exercise) => (
        <div key={exercise.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{exercise.name}</h3>
            <p className="text-gray-600 mt-2">{exercise.description}</p>
            <div className="mt-3">
                <Badge label={exercise.difficulty} variant={exercise.difficulty} />
                {exercise.muscleGroups?.map(muscle => (
                    <Badge key={muscle} label={muscle} className="ml-2" />
                ))}
            </div>
            <div className="mt-4 text-sm">
                <p>🔥 Calories: {exercise.estimatedCaloriesBurn}</p>
                <p>⚡ Equipment: {exercise.equipment?.join(', ')}</p>
            </div>
        </div>
    );

    const renderChallenge = (challenge) => (
        <div key={challenge.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{challenge.name}</h3>
            <p className="text-gray-600 mt-2">{challenge.description}</p>
            <div className="mt-3">
                <Badge label={challenge.difficulty} variant={challenge.difficulty} />
                <Badge label={`${challenge.duration} days`} className="ml-2" />
            </div>
            <div className="mt-4">
                <h4 className="font-medium">Daily Tasks:</h4>
                <ul className="list-disc list-inside mt-2">
                    {challenge.dailyTasks?.slice(0, 3).map(task => (
                        <li key={task.day} className="text-sm">
                            Day {task.day}: {task.task}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    const renderAchievement = (achievement) => (
        <div key={achievement.id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold">{achievement.name}</h3>
            <p className="text-gray-600 mt-2">{achievement.description}</p>
            <div className="mt-3">
                <Badge label={achievement.rarity} variant={achievement.rarity} />
                <Badge label={`${achievement.points} points`} className="ml-2" />
            </div>
            <p className="mt-4 text-sm">
                🎯 Requirement: {achievement.requirement}
            </p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Workout Center</h1>

            {/* Navigation Tabs */}
            <div className="flex space-x-4 mb-6">
                {['workoutPlans', 'exercises', 'challenges', 'achievements'].map(tab => (
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

            {/* Search Bar for Exercises */}
            {activeTab === 'exercises' && (
                <div className="mb-6">
                    <SearchBar
                        onSearch={handleSearch}
                        placeholder="Search exercises..."
                    />
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'workoutPlans' && workoutPlans.map(renderWorkoutPlan)}
                {activeTab === 'exercises' && 
                    (searchResults.length > 0 ? searchResults : exercises).map(renderExercise)}
                {activeTab === 'challenges' && challenges.map(renderChallenge)}
                {activeTab === 'achievements' && achievements.map(renderAchievement)}
            </div>
        </div>
    );
};

export default Workout; 