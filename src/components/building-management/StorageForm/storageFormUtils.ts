import type { StorageUnit, StorageType } from '@/types/storage';

export const generateAutoCode = (type: StorageType, floor: string): string => {
  const typePrefix = type === 'storage' ? 'A' : 'P';
  const floorPrefix = floor === 'Υπόγειο' ? 'B' :
                    floor === 'Ισόγειο' ? 'G' : 'F';
  const randomNum = Math.floor(Math.random() * 99) + 1;
  return `${typePrefix}_${floorPrefix}${randomNum.toString().padStart(2, '0')}`;
};

export const calculatePrice = (area: number, floor: string, type: StorageType): number => {
  const basePricePerSqm = type === 'storage' ? 400 : 800;
  const floorMultiplier = floor === 'Υπόγειο' ? 1.0 :
                        floor === 'Ισόγειο' ? 1.2 : 1.1;
  return Math.round(area * basePricePerSqm * floorMultiplier);
};

export const validateForm = (formData: Partial<StorageUnit>): { isValid: boolean, errors: { [key: string]: string } } => {
  const newErrors: { [key: string]: string } = {};

  if (!formData.code?.trim()) {
    newErrors.code = 'Ο κωδικός είναι υποχρεωτικός';
  }
  if (!formData.area || formData.area <= 0) {
    newErrors.area = 'Η επιφάνεια πρέπει να είναι μεγαλύτερη από 0';
  }
  if (!formData.price || formData.price <= 0) {
    newErrors.price = 'Η τιμή πρέπει να είναι μεγαλύτερη από 0';
  }
  if (!formData.description?.trim()) {
    newErrors.description = 'Η περιγραφή είναι υποχρεωτική';
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
};
