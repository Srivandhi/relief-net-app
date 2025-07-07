import { useEffect, useState } from 'react';
import { MapContainer, Popup, TileLayer, Marker } from 'react-leaflet';
import { socket } from '../socket';
import axios from 'axios';
import L from 'leaflet';

const icons = {
    Flooding: L.icon({
        iconUrl: '/icons/flood.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    Fire: L.icon({
        iconUrl: '/icons/fire.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    "Road Blockage": L.icon({
        iconUrl: '/icons/roadblock.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    "Structural Damage": L.icon({
        iconUrl: '/icons/damage.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    Earthquake: L.icon({
        iconUrl: '/icons/earthquake.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    Landslide: L.icon({
        iconUrl: '/icons/landslide.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    Cyclone: L.icon({
        iconUrl: '/icons/cyclone.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    Accident: L.icon({
        iconUrl: '/icons/accident.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    Other: L.icon({
        iconUrl: '/icons/other.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
};

const resourceIcons = {
    Ambulance: L.icon({
        iconUrl: '/icons/ambulance.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    Food: L.icon({
        iconUrl: '/icons/food.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    Shelter: L.icon({
        iconUrl: '/icons/shelter.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    "Medical Aid": L.icon({
        iconUrl: '/icons/medical.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
    Other: L.icon({
        iconUrl: '/icons/resource.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
    }),
};


export const Map = ({ children }) => {

    const [incidents, setIncidents] = useState([])
    const [resources, setResources] = useState([])

    const mapCenter = [20.5937, 78.9629];

    useEffect(() => {
        function onIncidentVerified(verifiedIncident) {
            setIncidents(prevIncidents => [...prevIncidents, verifiedIncident]);
        }

        function onResourceVerified(verifiedResource) {
            setResources(prevResources => [...prevResources, verifiedResource]);
        }

        socket.on('incidentVerified', onIncidentVerified);
        socket.on('resourceVerified', onResourceVerified);

        return () => {
            socket.off('incidentVerified', onIncidentVerified);
            socket.off('resourceVerified', onResourceVerified);
        };
    }, []);

    useEffect(() => {


        const fetchIncidents = async () => {
            try {
                const response = await axios.get('https://relief-net-api.onrender.com/api/incidents');
                setIncidents(response.data);
                console.log('Fetched incidents:', response.data);
            } catch (error) {
                console.error('Error fetching incidents:', error);
            }
        };
        const fetchResources = async () => {
            try {
                const response = await axios.get('https://relief-net-api.onrender.com/api/resources');
                setResources(response.data);
                console.log('Fetched resources:', response.data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        };

        fetchResources();

        fetchIncidents();
    }, [])

    return <>
        <MapContainer center={mapCenter} zoom={5} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {
                incidents.map((incident) => {
                    const icon = icons[incident.incidentType] || icons.Other;
                    return (
                        <Marker
                            key={incident._id}
                            position={[incident.location.coordinates[1], incident.location.coordinates[0]]}
                            icon={icon}
                        >
                            <Popup>
                                <b>{incident.incidentType}</b>
                                <p>{incident.description}</p>
                            </Popup>
                        </Marker>
                    );
                })
            }
            {
                resources.map((resource) => {

                    const icon = resourceIcons[resource.resourceType?.trim()] || resourceIcons.Other;

                    return (
                        <Marker
                            key={resource._id}
                            position={[resource.location.coordinates[1], resource.location.coordinates[0]]}
                            icon={icon}
                        >
                            <Popup>
                                <b>{resource.resourceType}</b>
                                <p>{resource.description}</p>
                                <p><i>Contact:</i> {resource.contact || 'N/A'}</p>
                            </Popup>
                        </Marker>
                    );
                })
            }


        </MapContainer>
        {children}
    </>

}