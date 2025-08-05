"use client"

import * as React from "react"
import {
  Users,
  Building2,
  Landmark,
  Plus,
  FileText,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

// Mock data for contacts
const contacts = [
  {
    id: 1,
    name: "Γιώργος Παπαδόπουλος",
    type: "individual",
    email: "g.papadopoulos@example.com",
    phone: "6971234567",
    added: "2023-10-26",
    status: "active",
  },
  {
    id: 2,
    name: "TechCorp Α.Ε.",
    type: "company",
    email: "info@techcorp.gr",
    phone: "2101234567",
    added: "2023-10-25",
    status: "active",
  },
  {
    id: 3,
    name: "ΔΟΥ Α' Θεσσαλονίκης",
    type: "service",
    email: "doy.a.thess@aade.gr",
    phone: "2310555111",
    added: "2023-09-15",
    status: "active",
  },
    {
    id: 4,
    name: "Μαρία Ιωάννου",
    type: "individual",
    email: "m.ioannou@example.com",
    phone: "6987654321",
    added: "2023-10-22",
    status: "inactive",
  },
]

export default function ContactsPage() {
  const getAvatarFallback = (name: string) => {
    const parts = name.split(" ")
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }
  
  const getTypeInfo = (type: string) => {
      switch (type) {
        case 'individual':
          return { label: 'Φυσικό Πρόσωπο', icon: Users, color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' };
        case 'company':
          return { label: 'Νομικό Πρόσωπο', icon: Building2, color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400' };
        case 'service':
          return { label: 'Δημόσια Υπηρεσία', icon: Landmark, color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' };
        default:
          return { label: 'Άγνωστο', icon: Users, color: 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400' };
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Επαφές</h1>
          <p className="text-muted-foreground">
            Διαχειριστείτε όλες τις επαφές σας σε ένα μέρος.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Εξαγωγή
            </Button>
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Νέα Επαφή
            </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Αναζήτηση επαφών..."
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            <Filter className="mr-2 h-4 w-4" />
                            Φίλτρα
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Φίλτρο ανά τύπο</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Όλα</DropdownMenuItem>
                        <DropdownMenuItem>Φυσικό Πρόσωπο</DropdownMenuItem>
                        <DropdownMenuItem>Νομικό Πρόσωπο</DropdownMenuItem>
                        <DropdownMenuItem>Δημόσια Υπηρεσία</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Όνομα</TableHead>
                <TableHead className="hidden sm:table-cell">Τύπος</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Τηλέφωνο</TableHead>
                <TableHead className="hidden sm:table-cell">Ημ/νία Προσθήκης</TableHead>
                <TableHead>Κατάσταση</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => {
                  const typeInfo = getTypeInfo(contact.type);
                  return (
                    <TableRow key={contact.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`https://placehold.co/40x40.png?text=${getAvatarFallback(contact.name)}`} alt={contact.name} />
                                    <AvatarFallback>{getAvatarFallback(contact.name)}</AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{contact.name}</div>
                            </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                           <Badge variant="secondary" className={typeInfo.color}>
                                <typeInfo.icon className="mr-1 h-3 w-3" />
                                {typeInfo.label}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{contact.email}</TableCell>
                        <TableCell className="hidden lg:table-cell">{contact.phone}</TableCell>
                        <TableCell className="hidden sm:table-cell">{contact.added}</TableCell>
                        <TableCell>
                            <Badge variant={contact.status === 'active' ? 'default' : 'outline'}>
                                {contact.status === 'active' ? 'Ενεργή' : 'Ανενεργή'}
                            </Badge>
                        </TableCell>
                    </TableRow>
                  );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
