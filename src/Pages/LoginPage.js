import React, { useState, useEffect } from 'react';
import { EyeIcon, UserIcon, LockClosedIcon, ArrowPathIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LOGIN_API, LOGIN_API_verify } from '../API/apiConfig';


const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpRequested, setIsOtpRequested] = useState(false);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        captcha: ''
    });
    const [captcha, setCaptcha] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const [isRotated, setIsRotated] = useState(false);
    const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const LENGTH = 5;

    useEffect(() => {
        // Initialize captcha on component mount
        setCaptcha(generateCaptcha());
    }, []);

    const generateCaptcha = () => {
        let captcha = '';
        for (let i = 0; i < LENGTH; i++) {
            captcha += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
        }
        return captcha;
    };

    const handleRefresh = () => {
        setCaptcha(generateCaptcha());
        setIsRotated(true);
        setTimeout(() => setIsRotated(false), 1000); // Reset rotation state after animation
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setAlertMessage('');
        }, 3000);
        return () => clearTimeout(timer);
    }, [alertMessage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleCaptchaPaste = (e) => {
        e.preventDefault(); // Prevent paste action
    };

    const requestOtp = async () => {
        if (!formData.username || !formData.password || !formData.captcha) {
            setAlertMessage('Please fill in all fields before requesting OTP.');
            return;
        }

        if (formData.captcha !== captcha) {
            setAlertMessage('Invalid captcha. Please try again.');
            handleRefresh(); // Refresh the captcha automatically
            return;
        }

        try {
            const response = await axios.post(LOGIN_API, {
                email: formData.username,
                password: formData.password
            });

            if (response.status === 200) {
                setIsOtpRequested(true);
                setAlertMessage('OTP has been sent to your email.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setAlertMessage('Invalid username or password.');
            } else {
                setAlertMessage('An error occurred. Please try again.');
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isOtpRequested) {
            if (!otp) {
                setAlertMessage('Please enter OTP to proceed.');
                return;
            }

            try {
                const response = await axios.post(LOGIN_API_verify, {
                    email: formData.username,
                    otp: otp
                });

                if (response.status === 200) {
                    const tokenKey = 'tokenKey';

                    // Store token and email in local storage
                    localStorage.setItem(tokenKey, response.data.token);
                    localStorage.setItem('email', formData.username);

                    setAlertMessage('Login successful!');
                    navigate('/'); // Redirect to the home page or dashboard
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setAlertMessage('Invalid OTP.');
                } else {
                    setAlertMessage('An error occurred. Please try again.');
                }
            }
        } else {
            if (formData.captcha !== captcha) {
                setAlertMessage('Captcha did not match.');
                handleRefresh(); // Refresh the captcha in case of error
                return;
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-rose-800 shadow-lg rounded-xl p-5 w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-4 text-center text-rose-900">Log in to your account</h2>
                <div className="max-w-md mx-auto p-4">
                    <form onSubmit={handleLogin}>
                        {alertMessage && <div className="mb-4 text-red-600">{alertMessage}</div>}

                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm text-rose-800">Email I'D *</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-4 text-rose-900 h-5 w-5" />
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                                    placeholder="Email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm text-rose-800">Password *</label>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-4 text-rose-900 h-5 w-5" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                                    placeholder="Password"
                                    required
                                />
                                <button type="button" className="absolute right-3 top-4" onClick={togglePasswordVisibility}>
                                    {showPassword ? <EyeSlashIcon className='text-rose-900 h-5 w-5' /> : <EyeIcon className='text-rose-900 h-5 w-5' />}
                                </button>
                            </div>
                        </div>

                        {!isOtpRequested && (
                            <>
                                <div className='flex w-full mb-4'>
                                    <div className="w-1/2 flex items-center justify-center px-4 py-2 mt-2 text-lg border rounded-md bg-gray-200 select-none">
                                        {captcha}
                                    </div>
                                    <div className="w-1/2 flex items-center px-4 py-3">
                                        <ArrowPathIcon
                                            className={`w-5 h-5 mr-2 text-rose-900 transition-transform duration-1000 ${isRotated ? 'rotate-360' : ''}`}
                                            onClick={handleRefresh}
                                        />
                                        <button type="button" onClick={handleRefresh}>Refresh</button>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="captcha" className="block text-sm text-rose-800">Captcha *</label>
                                    <input
                                        id="captcha"
                                        type="text"
                                        name="captcha"
                                        value={formData.captcha}
                                        onChange={handleInputChange}
                                        onPaste={handleCaptchaPaste} // Prevent paste
                                        className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                                        placeholder="Captcha"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        {isOtpRequested && (
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                className="w-full p-3 border rounded mb-3"
                                value={otp}
                                onChange={handleOtpChange}
                                required
                            />
                        )}

                        {!isOtpRequested ? (
                            <button
                                type="button"
                                className="w-full bg-rose-800 hover:bg-rose-900 text-white p-3 rounded mb-3"
                                onClick={requestOtp}
                            >
                                Request OTP
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full font-bold bg-rose-900 text-white py-2 rounded-md hover:bg-rose-950"
                            >
                                Login
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
