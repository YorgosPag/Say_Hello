'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    id: string;
    label: string;
    value: number | string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEnterPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    labelPosition: 'left' | 'right';
    inputClassName?: string;
    labelClassName?: string;
    unit?: string;
    unitPosition?: 'left' | 'right';
    useGrouping?: boolean;
}

export function FormField({
    id,
    label,
    value,
    onChange,
    onEnterPress,
    readOnly,
    labelPosition,
    inputClassName,
    labelClassName,
    unit,
    unitPosition = 'right',
    useGrouping = false,
}: FormFieldProps) {

    const inputElement = (
        <div className="relative flex items-center">
             {unit && unitPosition === 'left' && <span className="absolute left-3 text-sm text-muted-foreground">{unit}</span>}
            <Input
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                onKeyDown={(e) => { if (e.key === 'Enter') onEnterPress(e); }}
                readOnly={readOnly}
                className={cn('h-8 text-right', inputClassName, unit && unitPosition === 'left' && "pl-8", unit && unitPosition === 'right' && "pr-8")}
                type="text"
            />
            {unit && unitPosition === 'right' && <span className="absolute right-3 text-sm text-muted-foreground">{unit}</span>}
        </div>
    );

    return (
        <div className={cn('grid items-center', labelPosition === 'left' ? 'grid-cols-[1fr_auto]' : 'grid-cols-[auto_1fr] text-right')}>
            {labelPosition === 'left' ? (
                <>
                    <Label htmlFor={id} className={cn('text-sm font-medium text-left', labelClassName)}>{label}</Label>
                    {inputElement}
                </>
            ) : (
                <>
                    {inputElement}
                    <Label htmlFor={id} className={cn('text-sm font-medium pl-2', labelClassName)}>{label}</Label>
                </>
            )}
        </div>
    );
}
