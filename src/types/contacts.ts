import { Timestamp } from 'firebase/firestore'

// Βασικοί τύποι επαφών
export type ContactType = 'individual' | 'company' | 'service'
export type ContactStatus = 'active' | 'inactive' | 'archived';

// Βασικό interface για όλες τις επαφές
export interface BaseContact {
  id?: string
  type: ContactType
  isFavorite: boolean
  status: ContactStatus;
  tags?: string[]
  notes?: string
  customFields?: Record<string, any>
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
  createdBy?: string
  lastModifiedBy?: string
}

// Interface για Φυσικά Πρόσωπα
export interface IndividualContact extends BaseContact {
  type: 'individual'
  // Βασικά στοιχεία
  firstName: string
  lastName: string
  middleName?: string
  nickname?: string
  
  // Προσωπικά στοιχεία
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  nationality?: string
  idNumber?: string // ΑΔΤ
  taxNumber?: string // ΑΦΜ
  socialSecurityNumber?: string // ΑΜΚΑ
  
  // Επαγγελματικά στοιχεία
  profession?: string
  jobTitle?: string
  company?: string
  department?: string
  
  // Στοιχεία επικοινωνίας
  emails?: EmailInfo[]
  phones?: PhoneInfo[]
  addresses?: AddressInfo[]
  websites?: WebsiteInfo[]
  socialMedia?: SocialMediaInfo[]
  
  // Οικογενειακή κατάσταση
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  spouse?: string
  children?: string[]
  
  // Φωτογραφία
  photoURL?: string
}

// Interface για Νομικά Πρόσωπα (Εταιρείες)
export interface CompanyContact extends BaseContact {
  type: 'company'
  // Βασικά στοιχεία εταιρείας
  companyName: string
  legalName?: string
  tradeName?: string
  
  // Νομικά στοιχεία
  legalForm?: 'ΑΕ' | 'ΕΠΕ' | 'ΟΕ' | 'ΕΕ' | 'ΙΚΕ' | 'ΚΟΙΝΣΕΠ' | 'OTHER'
  vatNumber: string // ΑΦΜ
  registrationNumber?: string // ΓΕΜΗ
  taxOffice?: string // ΔΟΥ
  
  // Πληροφορίες εταιρείας
  industry?: string
  sector?: string
  numberOfEmployees?: number
  annualRevenue?: number
  foundedDate?: Date
  
  // Στοιχεία επικοινωνίας
  emails?: EmailInfo[]
  phones?: PhoneInfo[]
  addresses?: AddressInfo[]
  websites?: WebsiteInfo[]
  socialMedia?: SocialMediaInfo[]
  
  // Υπεύθυνοι επικοινωνίας
  contactPersons?: ContactPerson[]
  
  // Λογότυπο
  logoURL?: string
}

// Interface για Δημόσιες Υπηρεσίες
export interface ServiceContact extends BaseContact {
  type: 'service'
  // Βασικά στοιχεία υπηρεσίας
  serviceName: string
  serviceType: 'ministry' | 'tax_office' | 'municipality' | 'public_organization' | 'other'
  parentOrganization?: string
  
  // Κωδικοί και μητρώα
  serviceCode?: string
  registryNumber?: string
  
  // Πληροφορίες υπηρεσίας
  department?: string
  division?: string
  responsibleMinistry?: string
  
  // Ωράριο λειτουργίας
  operatingHours?: OperatingHours
  
  // Στοιχεία επικοινωνίας
  emails?: EmailInfo[]
  phones?: PhoneInfo[]
  addresses?: AddressInfo[]
  websites?: WebsiteInfo[]
  
  // Αρμόδιοι
  responsiblePersons?: ResponsiblePerson[]
  
  // Παρεχόμενες υπηρεσίες
  servicesProvided?: string[]
  
  // Λογότυπο
  logoURL?: string
}

// Auxiliary Types
export interface EmailInfo {
  email: string
  type: 'personal' | 'work' | 'other'
  isPrimary: boolean
  label?: string
}

export interface PhoneInfo {
  number: string
  type: 'mobile' | 'home' | 'work' | 'fax' | 'other'
  isPrimary: boolean
  label?: string
  countryCode?: string
}

export interface AddressInfo {
  street: string
  number?: string
  city: string
  postalCode: string
  region?: string
  country: string
  type: 'home' | 'work' | 'billing' | 'shipping' | 'other'
  isPrimary: boolean
  label?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export interface WebsiteInfo {
  url: string
  type: 'personal' | 'company' | 'portfolio' | 'blog' | 'other'
  label?: string
}

export interface SocialMediaInfo {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'github' | 'other'
  username: string
  url?: string
  label?: string
}

export interface ContactPerson {
  name: string
  position?: string
  department?: string
  email?: string
  phone?: string
  isPrimary: boolean
}

export interface ResponsiblePerson extends ContactPerson {
  responsibilities?: string[]
  availableHours?: string
}

export interface OperatingHours {
  monday?: DayHours
  tuesday?: DayHours
  wednesday?: DayHours
  thursday?: DayHours
  friday?: DayHours
  saturday?: DayHours
  sunday?: DayHours
  exceptions?: string[] // Για αργίες κλπ
}

export interface DayHours {
  isOpen: boolean
  openTime?: string
  closeTime?: string
  breakStart?: string
  breakEnd?: string
}

// Union type για όλες τις επαφές
export type Contact = IndividualContact | CompanyContact | ServiceContact

// Type guards
export function isIndividualContact(contact: Contact): contact is IndividualContact {
  return contact.type === 'individual'
}

export function isCompanyContact(contact: Contact): contact is CompanyContact {
  return contact.type === 'company'
}

export function isServiceContact(contact: Contact): contact is ServiceContact {
  return contact.type === 'service'
}

// Validation schemas (για χρήση με zod αργότερα)
export const contactValidationRules = {
  individual: {
    firstName: { required: true, minLength: 2, maxLength: 50 },
    lastName: { required: true, minLength: 2, maxLength: 50 },
    email: { required: false, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: false, pattern: /^\+?[0-9\s-()]+$/ },
    taxNumber: { required: false, length: 9, pattern: /^[0-9]{9}$/ }
  },
  company: {
    companyName: { required: true, minLength: 2, maxLength: 100 },
    vatNumber: { required: true, length: 9, pattern: /^[0-9]{9}$/ },
    legalForm: { required: true }
  },
  service: {
    serviceName: { required: true, minLength: 2, maxLength: 100 },
    serviceType: { required: true }
  }
}

// Helper functions
export function getContactDisplayName(contact: Contact): string {
  if (isIndividualContact(contact)) {
    return `${contact.firstName} ${contact.lastName}`
  } else if (isCompanyContact(contact)) {
    return contact.companyName
  } else {
    return contact.serviceName
  }
}

export function getContactInitials(contact: Contact): string {
  const name = getContactDisplayName(contact)
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getPrimaryEmail(contact: Contact): string | undefined {
  const emails = contact.emails || []
  const primaryEmail = emails.find(e => e.isPrimary)
  return primaryEmail?.email || emails[0]?.email
}

export function getPrimaryPhone(contact: Contact): string | undefined {
  const phones = contact.phones || []
  const primaryPhone = phones.find(p => p.isPrimary)
  return primaryPhone?.number || phones[0]?.number
}

export function getPrimaryAddress(contact: Contact): AddressInfo | undefined {
  const addresses = contact.addresses || []
  const primaryAddress = addresses.find(a => a.isPrimary)
  return primaryAddress || addresses[0]
}
