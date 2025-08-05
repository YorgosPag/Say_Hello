'use client';

import { useState, useEffect, useMemo } from 'react';
import type { StorageUnit, StorageType, StorageStatus } from '@/types/storage';
import { calculatePrice, generateAutoCode, validateForm } from './storageFormUtils';

interface UseStorageFormProps {
  unit: StorageUnit | null;
  building: {
    id: number;
    name: string;
    project: string;
    company: string;
  };
  onSave: (unit: StorageUnit) => void;
  onCancel: () => void;
  formType: StorageType;
}

export function useStorageForm({ unit, building, onSave, formType }: UseStorageFormProps) {
  const [formData, setFormData] = useState<Partial<StorageUnit>>({
    code: '',
    type: formType,
    floor: 'Υπόγειο',
    area: 0,
    price: 0,
    status: 'available',
    description: '',
    building: building.name,
    project: building.project,
    company: building.company,
    linkedProperty: null,
    coordinates: { x: 0, y: 0 },
    features: []
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [newFeature, setNewFeature] = useState('');
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false);

  const availableFloors = useMemo(() => [
    'Υπόγειο 2', 'Υπόγειο 1', 'Υπόγειο', 'Ισόγειο', '1ος Όροφος', '2ος Όροφος',
    '3ος Όροφος', '4ος Όροφος', '5ος Όροφος', '6ος Όροφος', '7ος Όροφος'
  ], []);

  const commonFeaturesForType = useMemo(() => ({
    storage: [
      'Ηλεκτρικό ρεύμα', 'Φυσικός φωτισμός', 'Τεχνητός φωτισμός', 'Αεροθαλάμος',
      'Ασφάλεια', 'Πρόσβαση ανελκυστήρα', 'Υδραυλικές εγκαταστάσεις'
    ],
    parking: [
      'Πρίζα φόρτισης EV', 'Κλειστό', 'Φωτισμός', 'Ασφάλεια', 'Εύκολη πρόσβαση'
    ]
  })[formType] || [], [formType]);

  useEffect(() => {
    if (unit) {
      setFormData(unit);
    } else {
      // Reset form for new entry, keeping formType
      setFormData(prev => ({
        ...prev,
        code: '', type: formType, floor: 'Υπόγειο', area: 0, price: 0,
        status: 'available', description: '', linkedProperty: null,
        coordinates: { x: 0, y: 0 }, features: []
      }));
    }
  }, [unit, formType]);

  useEffect(() => {
    if (formData.area && formData.area > 0 && !unit) {
      setIsCalculatingPrice(true);
      const timeout = setTimeout(() => {
        const calculatedPrice = calculatePrice(formData.area!, formData.floor!, formData.type!);
        setFormData(prev => ({ ...prev, price: calculatedPrice }));
        setIsCalculatingPrice(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [formData.area, formData.floor, formData.type, unit]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleGenerateAutoCode = () => {
    const autoCode = generateAutoCode(formData.type!, formData.floor!);
    updateField('code', autoCode);
  };
  
  const addFeature = () => {
    if (newFeature.trim() && !formData.features?.includes(newFeature.trim())) {
      updateField('features', [...(formData.features || []), newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    updateField('features', formData.features?.filter(f => f !== featureToRemove) || []);
  };
  
  const addCommonFeature = (feature: string) => {
    if (!formData.features?.includes(feature)) {
      updateField('features', [...(formData.features || []), feature]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: newErrors } = validateForm(formData);
    setErrors(newErrors);

    if (isValid) {
      const unitToSave: StorageUnit = {
        id: unit?.id || `${formData.type}_${Date.now()}`,
        code: formData.code!,
        type: formData.type!,
        floor: formData.floor!,
        area: formData.area!,
        price: formData.price!,
        status: formData.status as StorageStatus,
        description: formData.description!,
        building: formData.building!,
        project: formData.project!,
        company: formData.company!,
        linkedProperty: formData.linkedProperty,
        coordinates: formData.coordinates!,
        features: formData.features!
      };
      onSave(unitToSave);
    }
  };
  
  const formTitle = useMemo(() => (
    unit
      ? (formType === 'storage' ? 'Επεξεργασία Αποθήκης' : 'Επεξεργασία Θέσης Στάθμευσης')
      : (formType === 'storage' ? 'Νέα Αποθήκη' : 'Νέα Θέση Στάθμευσης')
  ), [unit, formType]);

  return {
    formData,
    errors,
    newFeature,
    isCalculatingPrice,
    formTitle,
    availableFloors,
    commonFeaturesForType,
    setNewFeature,
    handleSubmit,
    updateField,
    handleGenerateAutoCode,
    addFeature,
    removeFeature,
    addCommonFeature,
  };
}
