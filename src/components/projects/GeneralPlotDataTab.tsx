'use client';

import React from 'react';

export interface PlotData {
    sdNoSocial: number;
    socialFactor: number;
    plotArea: number;
}

interface GeneralPlotDataTabProps {
    plotData: PlotData & { sdFinal: number };
    onPlotDataChange: (newData: Partial<PlotData>) => void;
}

export function GeneralPlotDataTab({ plotData, onPlotDataChange }: GeneralPlotDataTabProps) {
    return (
        <div>
            <p>Όροι Δόμησης Οικοπέδου (Placeholder)</p>
        </div>
    );
}
