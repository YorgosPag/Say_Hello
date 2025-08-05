'use client';

import React from 'react';
import { StorageUnit } from '@/types/storage';

interface StorageCardProps {
    unit: StorageUnit;
}

export function StorageCard({ unit }: StorageCardProps) {
  return (
    <div className="p-4 border rounded-lg">
        <p>Κωδικός: {unit.code}</p>
        