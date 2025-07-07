import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import './AdminDashboard.css';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Effect for handling real-time socket events
    useEffect(() => {
        // HANDLERS FOR REAL-TIME UPDATES
        function onNewIncident(newIncident) {
            setIncidents(prevIncidents => {
                if (!prevIncidents.some(inc => inc._id === newIncident._id)) {
                    return [newIncident, ...prevIncidents];
                }
                return prevIncidents;
            });
        }

        function onNewResource(newResource) {
            setResources(prevResources => {
                if (!prevResources.some(res => res._id === newResource._id)) {
                    return [newResource, ...prevResources];
                }
                return prevResources;
            });
        }

        function onIncidentRemoved({ _id }) {
            setIncidents(prevIncidents => prevIncidents.filter(incident => incident._id !== _id));
        }

        function onResourceRemoved({ _id }) {
            setResources(prevResources => prevResources.filter(resource => resource._id !== _id));
        }

        // BINDING THE LISTENERS
        socket.on('newUnverifiedIncident', onNewIncident);
        socket.on('newUnverifiedResource', onNewResource);
        socket.on('incidentRemovedFromAdminList', onIncidentRemoved);
        socket.on('resourceRemovedFromAdminList', onResourceRemoved);

        // CLEANUP FUNCTION
        return () => {
            socket.off('newUnverifiedIncident', onNewIncident);
            socket.off('newUnverifiedResource', onNewResource);
            socket.off('incidentRemovedFromAdminList', onIncidentRemoved);
            socket.off('resourceRemovedFromAdminList', onResourceRemoved);
        };
    }, []);

    // Effect for fetching the initial data when the component loads
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                const [incidentsRes, resourcesRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/admin/incidents/unverified', config),
                    axios.get('http://localhost:3000/api/admin/resources/unverified', config),
                ]);
                setIncidents(incidentsRes.data);
                setResources(resourcesRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to fetch data. Your session may have expired.');
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('authToken');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    // --- ALL HANDLER FUNCTIONS ---

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const createAuthHeaders = () => ({
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });

    const handleVerifyIncident = async (id) => {
        try {
            await axios.put(`http://localhost:3000/api/admin/incidents/${id}/verify`, {}, createAuthHeaders());
            const promise = axios.put(`http://localhost:3000/api/admin/incidents/${id}/verify`, {}, createAuthHeaders());
            toast.promise(promise, {
                loading: 'Verifying...',
                success: 'Incident Verified!',
                error: 'Could not verify incident.',
            });
        } catch (err) {
            console.error('Error verifying incident:', err);
            setError('Could not verify incident.');
        }
    };

    const handleDismissIncident = async (id) => {
        try {
            await axios.put(`http://localhost:3000/api/admin/incidents/${id}/dismiss`, {}, createAuthHeaders());
            const promise = axios.put(`http://localhost:3000/api/admin/incidents/${id}/dismiss`, {}, createAuthHeaders());
            toast.promise(promise, {
                loading: 'Dismissing...',
                success: 'Incident Dismissed!',
                error: 'Could not dismiss incident.',
            });
        } catch (err) {
            console.error('Error dismissing incident:', err);
            setError('Could not dismiss incident.');
        }
    };

    const handleVerifyResource = async (id) => {
        try {
            await axios.put(`http://localhost:3000/api/admin/resources/${id}/verify`, {}, createAuthHeaders());
            const promise = axios.put(`http://localhost:3000/api/admin/resources/${id}/verify`, {}, createAuthHeaders());
            toast.promise(promise, {
                loading: 'Verifying Resource...',    // Message shown while the API call is in progress
                success: 'Resource Verified!',      // Message shown on successful completion
                error: 'Could not verify resource.', // Message shown if the API call fails
            });
        } catch (err) {
            console.error('Error verifying resource:', err);
            setError('Could not verify resource.');
        }
    };

    const handleDismissResource = async (id) => {
        try {
            await axios.put(`http://localhost:3000/api/admin/resources/${id}/dismiss`, {}, createAuthHeaders());
             const promise = axios.put(`http://localhost:3000/api/admin/resources/${id}/dismiss`, {}, createAuthHeaders());
            toast.promise(promise, {
                loading: 'Dismissing Resource...',
                success: 'Resource Dismissed!',
                error: 'Could not dismiss resource.',
            });
        } catch (err) {
            console.error('Error dismissing resource:', err);
            setError('Could not dismiss resource.');
        }
    };

    // --- RENDER LOGIC ---

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">Log Out</button>
            </header>

            <main className="dashboard-main">
                <section className="dashboard-section">
                    <h2>Pending Incident Reports</h2>
                    {incidents.length === 0 ? (
                        <p>No unverified incidents to review.</p>
                    ) : (
                        <ul className="item-list">
                            {incidents.map((incident) => (
                                <li key={incident._id} className="item-card">
                                    <div className="item-details">
                                        <strong>Type:</strong> {incident.incidentType} <br />
                                        <strong>Description:</strong> {incident.description} <br />
                                        <strong>Reported:</strong> {new Date(incident.createdAt).toLocaleString()}
                                    </div>
                                    <div className="item-actions">
                                        <button onClick={() => handleVerifyIncident(incident._id)} className="btn btn-verify">Verify</button>
                                        <button onClick={() => handleDismissIncident(incident._id)} className="btn btn-dismiss">Dismiss</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="dashboard-section">
                    <h2>Pending Resource Reports</h2>
                    {resources.length === 0 ? (
                        <p>No unverified resources to review.</p>
                    ) : (
                        <ul className="item-list">
                            {resources.map((resource) => (
                                <li key={resource._id} className="item-card">
                                    <div className="item-details">
                                        <strong>Type:</strong> {resource.resourceType} <br />
                                        <strong>Description:</strong> {resource.description} <br />
                                        <strong>Contact:</strong> {resource.contact || 'N/A'} <br />
                                        <strong>Reported:</strong> {new Date(resource.createdAt).toLocaleString()}
                                    </div>
                                    <div className="item-actions">
                                        <button onClick={() => handleVerifyResource(resource._id)} className="btn btn-verify">Verify</button>
                                        <button onClick={() => handleDismissResource(resource._id)} className="btn btn-dismiss">Dismiss</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
};