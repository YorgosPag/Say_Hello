
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  TrendingUp,
  Plus,
  Star,
  Sparkles,
  Activity,
  Clock,
} from "lucide-react";
import type { QuickStats } from "@/types/dashboard";

interface StatsCardsProps {
  stats: QuickStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="card-hover border-l-4 border-l-blue-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Σύνολο Επαφών</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalContacts.toLocaleString("el-GR")}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
            <span className="text-green-600 font-medium">+12.5%</span>
            <span className="ml-1">από τον προηγούμενο μήνα</span>
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover border-l-4 border-l-green-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Νέες Επαφές</CardTitle>
          <Plus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newThisMonth}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <span>Αυτόν τον μήνα</span>
          </div>
          <Progress value={65} className="mt-2 h-1" />
        </CardContent>
      </Card>

      <Card className="card-hover border-l-4 border-l-yellow-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Αγαπημένα</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.favorites}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="mr-1 h-3 w-3" />
              Γρήγορη πρόσβαση
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover border-l-4 border-l-purple-600">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ενεργές Σήμερα</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeToday}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Clock className="mr-1 h-3 w-3" />
            <span>Τελευταία 24 ώρες</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
