import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/auth/AuthContext';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            await login(email, password);
            navigate('/')
        }
        catch (error) {
            setError('Login failed. Please check your credentials.')
            console.log(error);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>CodeClip</h1>
                </div>

                <div className="login-content">
                    <h2 className="login-title">Login</h2>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-message">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>

                        <button type="submit" className="login-button">
                            Login
                        </button>
                    </form>

                    <div className="divider"></div>

                    <div className="signup-link">
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;