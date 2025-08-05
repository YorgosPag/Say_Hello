'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library } from "lucide-react";

export default function PropertiesPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <Card className="w-full max-w-md">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Library className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Ευρετήριο Ακινήτων</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    Αυτή η λειτουργία θα υλοποιηθεί σύντομα.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
