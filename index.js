import React from 'react';
import { ModalProvider } from './context/ModalContext';
import DataFetcher from './components/DataFetcher';

const App = () => {
    return (
        <ModalProvider>
            <div className="container">
                <h1>My Front-End Application</h1>
                <DataFetcher />
            </div>
        </ModalProvider>
    );
};



const Button = ({ onClick, label }) => {
    return <button onClick={onClick}>{label}</button>;
};

export default Button;


import React from 'react';
import { useFormik } from 'formik';

const Form = () => {
    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validate: values => {
            const errors = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            return errors;
        },
        onSubmit: values => {
            // Handle form submission
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="form">
            <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                placeholder="Email"
            />
            {formik.errors.email && <div>{formik.errors.email}</div>}
            <input
                type="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Password"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

const fetchData = async () => {
    try {
        const response = await fetch('API_URL');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

import React, { useEffect, useState } from 'react';
import fetchData from '../api/api';

const DataFetcher = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await fetchData();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    return <div>{JSON.stringify(data)}</div>;
};

import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    return (
        <ModalContext.Provider value={{ isModalOpen, toggleModal }}>
            {children}
        </ModalContext.Provider>
    );
};



