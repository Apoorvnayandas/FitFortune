import { useState } from "react"
import { useNavigate, NavLink } from "react-router-dom"

const Signup = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('') // Clear error when user types
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Please fill in all fields')
            return
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Store credentials (In a real app, this would be an API call)
        localStorage.setItem('username', formData.username)
        localStorage.setItem('password', formData.password)
        localStorage.setItem('email', formData.email)
        
        // Redirect to login
        navigate('/login')
    }

    const handleGetStarted = () => {
        localStorage.setItem('login', 'true')
        localStorage.setItem('id', 'guest')
        navigate('/meal-planner')
    }

    return (
        <div className="w-full min-h-[85vh] overflow-hidden grid place-content-center">
            <div className="login flex flex-col gap-5 bg-white rounded-2xl p-8 min-w-[400px] shadow-xl">
                <h1 className="text-center text-2xl lg:text-3xl font-semibold">
                    Create Your FitFortune Account
                </h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="form-group">
                        <label className="block text-gray-600 mb-2">Username</label>
                        <input 
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Choose a username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-600 mb-2">Email</label>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-600 mb-2">Password</label>
                        <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-gray-600 mb-2">Confirm Password</label>
                        <input 
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Confirm your password"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors mt-2"
                    >
                        Create Account
                    </button>
                </form>

                <div className="text-center text-gray-500">
                    or
                </div>

                <button 
                    onClick={handleGetStarted}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Continue as Guest
                </button>

                <div className="border-t pt-4 mt-2">
                    <div className="text-center text-gray-500">
                        Already have an account?
                        <NavLink to="/login" className="text-blue-500 ml-1 hover:underline">
                            Log in here
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup