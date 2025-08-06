
'use client';

import React from 'react';

export function ContactsList() {
    const contacts = [
        { name: 'Γιώργος Παπαδόπουλος', company: 'Tech Solutions' },
        { name: 'Μαρία Ιωάννου', company: 'Creative Designs' },
        { name: 'Κώστας Βασιλείου', company: 'BuildCo' },
        { name: 'Ελένη Δημητρίου', company: 'Real Estate Experts' }
    ];
    return (
        <div className="p-6">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-3">Όνομα</th>
                        <th className="p-3">Εταιρεία</th>
                        <th className="p-3">Ενέργειες</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map(contact => (
                        <tr key={contact.name} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{contact.name}</td>
                            <td className="p-3 text-gray-600">{contact.company}</td>
                            <td className="p-3">
                                <button className="text-blue-600 hover:underline text-sm">Προβολή</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
