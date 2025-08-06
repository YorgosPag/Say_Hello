import { Timestamp } from 'firebase/firestore';

// Main Opportunity/Lead type
export interface Opportunity {
  id?: string;
  title: string;
  contactId: string; // Ref to contacts collection
  interestedIn: {
    projectIds?: string[];
    buildingIds?: string[];
    unitIds?: string[];
    propertyType?: 'apartment' | 'maisonette' | 'store' | 'office' | 'parking' | 'storage';
    budget?: {
      min?: number;
      max?: number;
    };
    desiredArea?: {
      min?: number;
      max?: number;
    };
    locations?: string[];
  };
  stage: 'initial_contact' | 'qualification' | 'viewing' | 'proposal' | 'negotiation' | 'contract' | 'closed_won' | 'closed_lost';
  probability?: number;
  estimatedValue?: number;
  expectedCloseDate?: Timestamp | Date;
  assignedTo: string; // User ID
  team?: string[]; // Array of User IDs
  lastActivity?: Timestamp | Date;
  nextAction?: string;
  nextActionDate?: Timestamp | Date;
  source: 'website' | 'referral' | 'agent' | 'social' | 'phone' | 'walkin';
  campaign?: string;
  referredBy?: string; // Contact ID
  status: 'active' | 'on_hold' | 'lost' | 'won';
  lostReason?: 'price' | 'location' | 'specifications' | 'competition' | 'other';
  wonDate?: Timestamp | Date;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// Communications
export interface Communication {
  id?: string;
  contactId: string;
  projectId?: string;
  unitId?: string;
  opportunityId?: string;
  type: 'email' | 'phone' | 'sms' | 'whatsapp' | 'telegram' | 'meeting' | 'note';
  direction: 'inbound' | 'outbound';
  subject?: string;
  content: string;
  attachments?: string[];
  duration?: number; // for phone calls in seconds
  meetingDate?: Timestamp | Date;
  location?: string;
  attendees?: string[];
  createdBy: string; // User ID
  createdAt: Timestamp | Date;
  status: 'completed' | 'scheduled' | 'cancelled';
  requiresFollowUp?: boolean;
  followUpDate?: Timestamp | Date;
}

// Tasks
export interface CrmTask {
  id?: string;
  title: string;
  description?: string;
  type: 'call' | 'email' | 'meeting' | 'viewing' | 'document' | 'follow_up' | 'other';
  contactId?: string;
  opportunityId?: string;
  projectId?: string;
  unitId?: string;
  assignedTo: string; // User ID
  assignedBy?: string; // User ID
  dueDate: Timestamp | Date;
  reminderDate?: Timestamp | Date;
  completedDate?: Timestamp | Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  viewingDetails?: {
    location: string;
    units: string[];
    attendees: string[];
    notes: string;
  };
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}
