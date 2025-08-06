'use client';

import React, { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Contact } from '@/types/contacts';
import { ContactsHeader } from './page/ContactsHeader';
import { ContactsDashboard } from './page/ContactsDashboard';
import { ContactsList } from './list/ContactsList';
import { ContactDetails } from './details/ContactDetails';

const contactsData: Contact[] = [
  {
    id: '1',
    type: 'individual',
    firstName: 'Γιώργος',
    lastName: 'Παπαδόπουλος',
    emails: [{ email: 'g.papadopoulos@example.com', type: 'work', isPrimary: true }],
    phones: [{ number: '6971234567', type: 'mobile', isPrimary: true }],
    isFavorite: true,
    createdAt: new Date('2023-10-26'),
    updatedAt: new Date('2024-07-28'),
    status: 'active',
  },
  {
    id: '2',
    type: 'company',
    companyName: 'TechCorp Α.Ε.',
    emails: [{ email: 'info@techcorp.gr', type: 'work', isPrimary: true }],
    phones: [{ number: '2101234567', type: 'work', isPrimary: true }],
    isFavorite: false,
    createdAt: new Date('2023-10-25'),
    updatedAt: new Date('2024-07-27'),
    status: 'active',
    vatNumber: '123456789'
  },
  {
    id: '3',
    type: 'service',
    serviceName: "ΔΟΥ Α' Θεσσαλονίκης",
    emails: [{ email: 'doy.a.thess@aade.gr', type: 'work', isPrimary: true }],
    phones: [{ number: '2310555111', type: 'work', isPrimary: true }],
    isFavorite: false,
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2024-06-15'),
    status: 'active',
    serviceType: 'tax_office'
  },
    {
    id: '4',
    type: 'individual',
    firstName: 'Μαρία',
    lastName: 'Ιωάννου',
    emails: [{ email: 'm.ioannou@example.com', type: 'personal', isPrimary: true }],
    phones: [{ number: '6987654321', type: 'mobile', isPrimary: true }],
    isFavorite: false,
    createdAt: new Date('2023-10-22'),
    updatedAt: new Date('2024-05-20'),
    status: 'inactive',
  },
] as any;


export function ContactsPageContent() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contactsData[0]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showDashboard, setShowDashboard] = useState(true);

  const stats = {
    totalContacts: contactsData.length,
    individuals: contactsData.filter(c => c.type === 'individual').length,
    companies: contactsData.filter(c => c.type === 'company').length,
    services: contactsData.filter(c => c.type === 'service').length,
    active: contactsData.filter((c: any) => c.status === 'active').length,
    newThisMonth: contactsData.filter(c => c.createdAt > new Date(new Date().setMonth(new Date().getMonth() - 1))).length,
  };
  
  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-background">
        <ContactsHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          showDashboard={showDashboard}
          setShowDashboard={setShowDashboard}
        />

        {showDashboard && <ContactsDashboard stats={stats} />}

        <div className="flex-1 flex overflow-hidden p-4 gap-4">
          {viewMode === 'list' ? (
            <>
              <ContactsList
                contacts={contactsData}
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
              />
              <ContactDetails contact={selectedContact} />
            </>
          ) : (
            <div className="w-full text-center p-8 bg-card rounded-lg border">
                Προβολή πλέγματος (Grid View) θα υλοποιηθεί σύντομα.
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
