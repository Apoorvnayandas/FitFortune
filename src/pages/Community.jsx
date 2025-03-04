import { useState } from 'react'

const Community = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: "FitnessFanatic",
            content: "Just completed a 5k run in 25 minutes! Personal best! 🏃‍♂️",
            likes: 15,
            comments: 3,
            timestamp: "2 hours ago"
        },
        {
            id: 2,
            user: "HealthyEater",
            content: "Made this delicious high-protein smoothie bowl! Recipe in comments 🥝",
            likes: 24,
            comments: 8,
            timestamp: "4 hours ago"
        }
    ])

    const [challenges] = useState([
        {
            title: "30-Day Plank Challenge",
            participants: 156,
            daysLeft: 22,
            description: "Build core strength with daily planks"
        },
        {
            title: "Healthy Breakfast Club",
            participants: 89,
            daysLeft: 15,
            description: "Share your healthy breakfast ideas"
        },
        {
            title: "10k Steps Daily",
            participants: 234,
            daysLeft: 30,
            description: "Hit 10,000 steps every day"
        }
    ])

    const [newPost, setNewPost] = useState("")

    const handlePostSubmit = (e) => {
        e.preventDefault()
        if (newPost.trim()) {
            setPosts([{
                id: posts.length + 1,
                user: localStorage.getItem('username') || "Guest",
                content: newPost,
                likes: 0,
                comments: 0,
                timestamp: "Just now"
            }, ...posts])
            setNewPost("")
        }
    }

    const handleLike = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? {...post, likes: post.likes + 1}
                : post
        ))
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Feed */}
                <div className="md:col-span-2 space-y-6">
                    <h1 className="text-3xl font-bold mb-8">Community Feed</h1>
                    
                    {/* Create Post */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <form onSubmit={handlePostSubmit}>
                            <textarea
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                className="w-full p-4 border rounded-lg mb-4"
                                placeholder="Share your fitness journey..."
                                rows="3"
                            />
                            <button
                                type="submit"
                                className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
                            >
                                Post
                            </button>
                        </form>
                    </div>

                    {/* Posts Feed */}
                    {posts.map(post => (
                        <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div className="ml-4">
                                    <h3 className="font-semibold">{post.user}</h3>
                                    <p className="text-gray-500 text-sm">{post.timestamp}</p>
                                </div>
                            </div>
                            <p className="text-gray-800 mb-4">{post.content}</p>
                            <div className="flex items-center gap-6 text-gray-500">
                                <button 
                                    onClick={() => handleLike(post.id)}
                                    className="flex items-center gap-2 hover:text-green-500"
                                >
                                    <span>❤️</span> {post.likes}
                                </button>
                                <button className="flex items-center gap-2">
                                    <span>💬</span> {post.comments}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Challenges Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
                        <div className="space-y-4">
                            {challenges.map((challenge, index) => (
                                <div key={index} className="border-b pb-4">
                                    <h3 className="font-semibold">{challenge.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        {challenge.description}
                                    </p>
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <span>{challenge.participants} participants</span>
                                        <span>{challenge.daysLeft} days left</span>
                                    </div>
                                    <button className="mt-2 text-green-500 text-sm font-semibold">
                                        Join Challenge
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Top Contributors</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                    <span className="ml-3">FitnessFanatic</span>
                                </div>
                                <span className="text-green-500">2,450 pts</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                    <span className="ml-3">HealthyEater</span>
                                </div>
                                <span className="text-green-500">2,180 pts</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Community 