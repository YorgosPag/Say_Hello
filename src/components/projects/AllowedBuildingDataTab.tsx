'use client';

import React from 'react';

export interface AllowedDataInput {
    maxCoveragePercentage: number;
    maxSemiOutdoorPercentage: number;
    maxBalconyPercentage: number;
    maxCombinedPercentage: number;
    maxVolumeCoefficient: number;
    maxAllowedHeight: number;
}

export interface AllowedDataCalculated {
    maxAllowedConstruction: number;
    maxPlotCoverage: number;
    maxAllowedSemiOutdoorArea: number;
    maxBalconyArea: number;
    maxCombinedArea: number;
    maxVolumeExploitation: number;
}

interface AllowedBuildingDataTabProps {
    allowedDataInput: AllowedDataInput;
    calculatedData: AllowedDataCalculated;
    onInputChange: (newData: Partial<AllowedDataInput>) => void;
}

export function AllowedBuildingDataTab({ allowedDataInput, calculatedData, onInputChange }: AllowedBuildingDataTabProps) {
    return (
        <div>
            <p>Επιτρεπόμενα (Placeholder)</p>
        </div>
    );
}
