'use client';

import React, { useState, useEffect } from 'react';
import type { StorageUnit, StorageType, StorageStatus } from '@/types/storage';
import { calculatePrice, generateAutoCode, validateForm } from './StorageForm/storageFormUtils';

import { StorageFormHeader } from './StorageForm/StorageFormHeader';
import { StorageFormBasicInfo } from './StorageForm/StorageFormBasicInfo';
import { StorageFormSpecs } from './StorageForm/StorageFormSpecs';
import { StorageFormFeatures } from './StorageForm/StorageFormFeatures';
import { StorageFormFooter } from './StorageForm/StorageFormFooter';

interface StorageFormProps {
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

export function StorageForm({ unit, building, onSave, onCancel, formType }: StorageFormProps) {
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

  // Available floors (could come from building data)
  const availableFloors = [
    'Υπόγειο 2',
    'Υπόγειο 1',
    'Υπόγειο',
    'Ισόγειο',
    '1ος Όροφος',
    '2ος Όροφος',
    '3ος Όροφος',
    '4ος Όροφος',
    '5ος Όροφος',
    '6ος Όροφος',
    '7ος Όροφος'
  ];

  // Common features for different types
  const commonFeatures = {
    storage: [
      'Ηλεκτρικό ρεύμα',
      'Φυσικός φωτισμός',
      'Τεχνητός φωτισμός',
      'Αεροθαλάμος',
      'Ασφάλεια',
      'Πρόσβαση ανελκυστήρα',
      'Υδραυλικές εγκαταστάσεις'
    ],
    parking: [
      'Πρίζα φόρτισης EV',
      'Κλειστό',
      'Φωτισμός',
      'Ασφάλεια',
      'Εύκολη πρόσβαση'
    ]
  };

  useEffect(() => {
    if (unit) {
      setFormData(unit);
    } else {
      setFormData(prev => ({ ...prev, type: formType }));
    }
  }, [unit, formType]);

  useEffect(() => {
    if (formData.area && formData.area > 0 && !unit) { // Auto-calculate only for new units
      setIsCalculatingPrice(true);
      const timeout = setTimeout(() => {
        const calculatedPrice = calculatePrice(formData.area!, formData.floor!, formData.type!);
        setFormData(prev => ({ ...prev, price: calculatedPrice }));
        setIsCalculatingPrice(false);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [formData.area, formData.floor, formData.type, unit]);

  const handleGenerateAutoCode = () => {
    const autoCode = generateAutoCode(formData.type!, formData.floor!);
    updateField('code', autoCode);
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

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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


  const formTitle = unit
    ? (formType === 'storage' ? 'Επεξεργασία Αποθήκης' : 'Επεξεργασία Θέσης Στάθμευσης')
    : (formType === 'storage' ? 'Νέα Αποθήκη' : 'Νέα Θέση Στάθμευσης');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <StorageFormHeader
          formType={formType}
          building={{ name: building.name, project: building.project }}
          formTitle={formTitle}
          onCancel={onCancel}
        />
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <StorageFormBasicInfo
              formData={formData}
              errors={errors}
              updateField={updateField}
              generateAutoCode={handleGenerateAutoCode}
              formType={formType}
            />
            <StorageFormSpecs
              formData={formData}
              errors={errors}
              updateField={updateField}
              isCalculatingPrice={isCalculatingPrice}
              availableFloors={availableFloors}
            />
            <StorageFormFeatures
              features={formData.features || []}
              newFeature={newFeature}
              setNewFeature={setNewFeature}
              addFeature={addFeature}
              removeFeature={removeFeature}
              addCommonFeature={addCommonFeature}
              commonFeaturesForType={commonFeatures[formType] || []}
            />
          </div>
          <StorageFormFooter onCancel={onCancel} unit={unit} />
        </form>
      </div>
    </div>
  );
}
