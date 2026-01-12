import react, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const login = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/login', {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json()

                console.log(data)
            } catch (error) {
                console.log(error)
            }
        }

        login();
    }

    return (
        <form onSubmit={handleSubmit}>
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
    )
}

export default Login;