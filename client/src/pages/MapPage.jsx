
import { useState } from "react";
import {Map} from '../Components/Map';
import {ReportIncident} from '../Components/ReportIncident';
import {ReportIncidentModel} from '../Components/ReportIncidentModel';
import { ReportResourceButton } from "../Components/ReportResourceButton";
import { ReportResourceModel } from "../Components/ReportResourceModel";

export const MapPage = () => {

    const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);
    const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

    const handleOpenIncidentModal = () => {
        setIsIncidentModalOpen(true);
    };
    const handleCloseIncidentModal = () => {
        setIsIncidentModalOpen(false);
    };

    const handleOpenResourceModal = () => {
        setIsResourceModalOpen(true);
    };
    const handleCloseResourceModal = () => {
        setIsResourceModalOpen(false);
    };

    return (
        <div className="MapPage">
            <Map>

                <ReportIncident onClick={handleOpenIncidentModal} />
                <ReportIncidentModel show={isIncidentModalOpen} onClose={handleCloseIncidentModal} />
                <ReportResourceButton onClick={handleOpenResourceModal} />
                <ReportResourceModel show={isResourceModalOpen} onClose={handleCloseResourceModal} />
            </Map>


        </div>
    );
};