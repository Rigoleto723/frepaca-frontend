import React from 'react';
import { cn } from '../../lib/utils';
import { Label } from './label';

interface Option {
    value: string | number | undefined;
    label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: Option[];
    label?: string;
    variant?: 'default' | 'outlined';
}

const Select: React.FC<SelectProps> = ({ options, label, variant = 'default', className, ...props }) => {
    return (
        <div className="flex flex-col mb-4">
            {label && <Label>{label}</Label>}
            <select
                className={cn(
                    "flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    variant === 'outlined' ? "border border-gray-300 bg-white" : "bg-gray-900 text-gray-200 border border-gray-300",
                    className
                )}
                {...props}
            >
                <option value="">Selecciona una opción</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export { Select }