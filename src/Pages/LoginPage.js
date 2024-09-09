import React, { useState, useEffect } from 'react';
import { EyeIcon, UserIcon, LockClosedIcon, ArrowPathIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LOGIN_API, LOGIN_API_verify } from '../API/apiConfig';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const LENGTH = 5;

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isOtpRequested, setIsOtpRequested] = useState(false);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        captcha: ''
    });
    const [captcha, setCaptcha] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const [isRotated, setIsRotated] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // New state for button disable

    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    const generateCaptcha = () => {
        let captchaArray = [];
        let previousOffsetX = 0;

        for (let i = 0; i < LENGTH; i++) {
            const character = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
            const rotation = Math.floor(Math.random() * 20) - 10;
            const offsetX = previousOffsetX + 15;
            const offsetY = Math.floor(Math.random() * 10) - 5;

            captchaArray.push({ character, rotation, offsetX, offsetY });
            previousOffsetX = offsetX;
        }

        return captchaArray;
    };

    const handleRefresh = () => {
        setCaptcha(generateCaptcha());
        setIsRotated(true);
        setTimeout(() => setIsRotated(false), 1000);
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
        e.preventDefault();
    };

    const requestOtp = async () => {
        if (!formData.username || !formData.password || !formData.captcha) {
            setAlertMessage('Please fill in all fields before requesting OTP.');
            return;
        }

        if (formData.captcha !== captcha.map(item => item.character).join('')) {
            setAlertMessage('Invalid captcha. Please try again.');
            handleRefresh();
            return;
        }

        setIsButtonDisabled(true); // Disable button when requesting OTP

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
        } finally {
            setIsButtonDisabled(false); // Enable button after request
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isOtpRequested) {
            if (!otp) {
                setAlertMessage('Please enter OTP to proceed.');
                return;
            }

            setIsButtonDisabled(true);

            try {
                const response = await axios.post(LOGIN_API_verify, {
                    email: formData.username,
                    otp: otp,
                });

                if (response.status === 200) {
                    const tokenKey = 'tokenKey';
                    localStorage.setItem(tokenKey, response.data.token);
                    localStorage.setItem('email', formData.username);
                    localStorage.setItem('UserName', response.data.name);
                    localStorage.setItem('employeeType', response.data.employeeType);

                    setAlertMessage('Login successful!');

                    navigate(response.data.employeeType === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard');
                }
            } catch (error) {
                const message = error.response?.data?.message || 'An error occurred. Please try again.';
                setAlertMessage(message);
            } finally {
                setIsButtonDisabled(false);
            }
        } else {
            if (formData.captcha !== captcha.map(item => item.character).join('')) {
                setAlertMessage('Captcha did not match.');
                handleRefresh();
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
                                <div className="grid grid-cols-2 w-full mb-4">
                                    <div className="flex items-start justify-start px-1 py-2 mt-2 text-lg border rounded-md bg-gray-200 select-none">
                                        <div className="grid grid-cols-5">
                                            {captcha.map((item, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        transform: `rotate(${item.rotation}deg) translate(${item.offsetX}px, ${item.offsetY}px)`,
                                                        display: 'inline-block'
                                                    }}
                                                    className="text-gray-800"
                                                >
                                                    {item.character}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center px-4 py-3">
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
                                        onPaste={handleCaptchaPaste}
                                        className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                                        placeholder="Enter captcha"
                                        required
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={requestOtp}
                                    disabled={isButtonDisabled}
                                    className={`w-full mt-4 py-2 px-4 bg-rose-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isButtonDisabled ? 'Requesting OTP...' : 'Request OTP'}
                                </button>
                            </>
                        )}

                        {isOtpRequested && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="otp" className="block text-sm text-rose-800">Enter OTP *</label>
                                    <input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        className="w-full px-4 py-2 mt-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                                        placeholder="Enter OTP"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isButtonDisabled}
                                    className={`w-full mt-4 py-2 px-4 bg-rose-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isButtonDisabled ? 'Logging in...' : 'Login'}
                                </button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
