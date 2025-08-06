'use client';

import React from 'react';

export interface ActualData {
    construction: number;
    plotCoverage: number;
    semiOutdoorArea: number;
    balconyArea: number;
    height: number;
}

export interface CalculatedActualData {
    coveragePercentage: number;
    semiOutdoorPercentage: number;
    balconyPercentage: number;
    combinedArea: number;
    combinedPercentage: number;
    volumeExploitation: number;
    volumeCoefficient: number;
}

interface ActualBuildingDataTabProps {
    actualData: ActualData;
    calculatedData: CalculatedActualData;
    onActualDataChange: (newData: Partial<ActualData>) => void;
}

export function ActualBuildingDataTab({ actualData, calculatedData, onActualDataChange }: ActualBuildingDataTabProps) {
    return (
        <div>
            <p>Πραγματοποιούμενα (Placeholder)</p>
        </div>
    );
}
