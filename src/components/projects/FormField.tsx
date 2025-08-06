'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface FormFieldProps {
    id: string;
    label: string;
    value: number | string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEnterPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    labelPosition?: 'left' | 'right';
    inputClassName?: string;
    labelClassName?: string;
    unit?: string;
    unitPosition?: 'left' | 'right';
    useGrouping?: boolean;
    isPercentage?: boolean;
    tooltipText?: string;
}

export function FormField({
    id,
    label,
    value,
    onChange,
    onEnterPress = () => {},
    readOnly = false,
    labelPosition = 'right',
    inputClassName,
    labelClassName,
    unit,
    unitPosition = 'right',
    useGrouping = false,
    isPercentage = false,
    tooltipText,
}: FormFieldProps) {

    const formatValue = (val: number | string) => {
        if (typeof val === 'number') {
            if (isPercentage) {
                return val.toFixed(2);
            }
            if (useGrouping) {
                return val.toLocaleString('el-GR', { maximumFractionDigits: 2 });
            }
        }
        return val;
    };

    const inputElement = (
        <div className="relative flex items-center">
             {unit && unitPosition === 'left' && <span className="absolute left-3 text-sm text-muted-foreground">{unit}</span>}
            <Input
                id={id}
                name={id}
                value={formatValue(value)}
                onChange={onChange}
                onKeyDown={(e) => { if (e.key === 'Enter') onEnterPress(e); }}
                readOnly={readOnly}
                className={cn(
                    'h-8 text-right', 
                    inputClassName, 
                    unit && unitPosition === 'left' && "pl-8", 
                    unit && unitPosition === 'right' && "pr-8",
                    readOnly && "bg-muted/50 border-transparent"
                )}
                type="text"
            />
            {unit && unitPosition === 'right' && <span className="absolute right-3 text-sm text-muted-foreground">{unit}</span>}
        </div>
    );

    const labelElement = (
        <div className="flex items-center gap-1">
            <Label htmlFor={id} className={cn('text-sm font-medium text-left', labelClassName)}>{label}</Label>
            {tooltipText && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs">{tooltipText}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );

    return (
        <div className={cn('grid items-center gap-2', labelPosition === 'left' ? 'grid-cols-[1fr_auto]' : 'grid-cols-1')}>
            {labelElement}
            {inputElement}
        </div>
    );
}
