'use client';

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building2, Landmark, Info, FileText, History, Edit } from 'lucide-react';
import type { Contact } from '@/types/contacts';
import { getContactDisplayName } from '@/types/contacts';

function ContactDetailsHeader({ contact }: { contact: Contact }) {
  const typeInfoMap = {
    individual: { icon: Users, color: 'bg-blue-500', name: 'Φυσικό Πρόσωπο' },
    company: { icon: Building2, color: 'bg-purple-500', name: 'Νομικό Πρόσωπο' },
    service: { icon: Landmark, color: 'bg-green-500', name: 'Δημόσια Υπηρεσία' }
  };
  const { icon: Icon, color, name: typeName } = typeInfoMap[contact.type];

  return (
    <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} shadow-sm`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground line-clamp-1">
              {getContactDisplayName(contact)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="text-xs bg-white/90 text-gray-700">{typeName}</Badge>
              <Badge variant={(contact as any).status === 'active' ? 'default' : 'outline'}>
                {(contact as any).status === 'active' ? 'Ενεργή' : 'Ανενεργή'}
              </Badge>
            </div>
          </div>
        </div>
        <Button>
            <Edit className="w-4 h-4 mr-2"/>
            Επεξεργασία
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-card border rounded-lg min-w-0 shadow-sm text-center p-8">
            <Users className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground">Επιλέξτε μια επαφή</h2>
            <p className="text-muted-foreground">Επιλέξτε μια επαφή από τη λίστα για να δείτε τις λεπτομέρειές της.</p>
        </div>
    );
}

interface ContactDetailsProps {
  contact: Contact | null;
}

export function ContactDetails({ contact }: ContactDetailsProps) {
  if (!contact) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col bg-card border rounded-lg min-w-0 shadow-sm">
      <ContactDetailsHeader contact={contact} />
      <ScrollArea className="flex-1">
        <div className="p-4">
            <Tabs defaultValue="info">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info"><Info className="w-4 h-4 mr-2"/>Πληροφορίες</TabsTrigger>
                    <TabsTrigger value="files"><FileText className="w-4 h-4 mr-2"/>Σχετικά Έγγραφα</TabsTrigger>
                    <TabsTrigger value="history"><History className="w-4 h-4 mr-2"/>Ιστορικό</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-4">
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Στοιχεία</h4>
                        <p className="text-sm">Περιεχόμενο πληροφοριών επαφής...</p>
                    </div>
                </TabsContent>
                 <TabsContent value="files" className="mt-4">
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Έγγραφα</h4>
                        <p className="text-sm">Λίστα εγγράφων...</p>
                    </div>
                </TabsContent>
                 <TabsContent value="history" className="mt-4">
                    <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Ιστορικό</h4>
                        <p className="text-sm">Ιστορικό αλλαγών και ενεργειών...</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
