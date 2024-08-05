import React, { useState, useEffect } from 'react';
import { EyeIcon, UserIcon, LockClosedIcon, ArrowPathIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isRotated, setIsRotated] = useState(false);
    const [isOtpRequested, setIsOtpRequested] = useState(false);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        captcha: ''
    });
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage('');
            }, 3000); // Clear the alert message after 3 seconds
            return () => clearTimeout(timer); // Clean up the timer if the component unmounts or alertMessage changes
        }
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

    const requestOtp = () => {
        if (!formData.username || !formData.password || !formData.captcha) {
            setAlertMessage('Please fill in all fields before requesting OTP.');
            return;
        }
        // Implement OTP request logic here
        console.log('Requesting OTP for', formData.username);
        setIsOtpRequested(true);
        setAlertMessage('OTP has been sent to your registered email.');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (isOtpRequested) {
            if (!otp) {
                setAlertMessage('Please enter OTP to proceed.');
                return;
            }
            // Implement OTP verification and login logic here
            console.log('Logging in with OTP:', otp);
            setAlertMessage('Login successful!');
        } else {
            // Implement initial login logic here
            console.log('Logging in with', formData);
            setAlertMessage('Login successful!');
        }
        // Clear the form
        setFormData({
            username: '',
            password: '',
            captcha: ''
        });
        setOtp('');
        setIsOtpRequested(false);
        navigate('/');
    };

    const handleClick = () => {
        setIsRotated(true);
        setTimeout(() => setIsRotated(false), 1000); // Reset the state after animation duration
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
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
                            {showPassword ? <EyeSlashIcon className='text-rose-900 h-5 w-5' /> : <EyeIcon className='text-rose-900 h-5 w-5' />} {/* Use EyeIcon for both states */}
                        </button>
                    </div>
                </div>

                {!isOtpRequested && (
                    <>
                        <div className="flex mb-4">
                            <div className="pl-10 px-4 py-2 mt-2 text-sm border rounded-md w-1/2 bg-gray-200">
                                Xdr56
                            </div>
                            <div className="flex mt-4 ml-5 w-1/2 items-center">
                                <ArrowPathIcon
                                    className={`w-5 h-5 mr-2 text-rose-900 transition-transform duration-1000 ${isRotated ? 'rotate-720' : ''}`}
                                    onClick={handleClick}
                                />
                                <div className="text-sm">Refresh</div>
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
    );
};

export default AdminLogin;
