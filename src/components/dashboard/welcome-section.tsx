"use client";

import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface WelcomeSectionProps {
  activeToday: number;
}

export function WelcomeSection({ activeToday }: WelcomeSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-2">Καλώς ήρθατε πίσω! 👋</h1>
        <p className="text-blue-100 mb-6 max-w-2xl">
          Διαχειριστείτε τις επαφές σας με τον πιο αποτελεσματικό τρόπο. Έχετε{" "}
          {activeToday} ενεργές επαφές σήμερα.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Plus className="mr-2 h-5 w-5" />
            Νέα Επαφή
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white/20"
          >
            <Search className="mr-2 h-5 w-5" />
            Αναζήτηση
          </Button>
        </div>
      </div>
      <div className="absolute right-0 top-0 -mt-4 -mr-4 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute left-1/2 bottom-0 -mb-4 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl" />
    </div>
  );
}
