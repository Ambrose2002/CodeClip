import react, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../shared/auth/AuthContext';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await signup(email, password);
            navigate('/')
        }
        catch (error) {
            setError('Signup failed')
            console.log(error);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <label >
                    Email:
                    <input type="email" value={email} onChange={handleEmailChange} />
                </label>

                <label >
                    Password:
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </label>

                <button type='submit'>Submit</button>
            </form>
            <Link to='/login'>Already have an account? Login</Link>
        </div>
    )
}

export default SignUp;