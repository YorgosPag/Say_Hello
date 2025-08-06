
'use client';

import React from 'react';
import { Plus, Filter } from 'lucide-react';

export function TasksTab() {
  const tasks = [
    { id: 1, title: "Follow-up με Γ. Παπαδόπουλο", due: "Σήμερα", priority: "high", status: "pending" },
    { id: 2, title: "Προετοιμασία πρότασης για TechCorp", due: "Αύριο", priority: "high", status: "in_progress" },
    { id: 3, title: "Ξενάγηση στο έργο 'Κέντρο'", due: "25/07/2024", priority: "medium", status: "pending" },
    { id: 4, title: "Κλήση σε Μαρία Ιωάννου", due: "26/07/2024", priority: "low", status: "pending" }
  ];

  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'bg-red-100 text-red-700';
    if (p === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Εργασίες & Ραντεβού</h2>
          <div className="flex items-center gap-3">
            <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Φίλτρα
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Νέα Εργασία
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Τίτλος</th>
              <th className="p-3">Προθεσμία</th>
              <th className="p-3">Προτεραιότητα</th>
              <th className="p-3">Κατάσταση</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{task.title}</td>
                <td className="p-3 text-gray-600">{task.due}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? 'Υψηλή' : task.priority === 'medium' ? 'Μεσαία' : 'Χαμηλή'}
                  </span>
                </td>
                <td className="p-3 text-gray-600 capitalize">
                  {task.status === 'pending' ? 'Εκκρεμεί' : 'Σε εξέλιξη'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
