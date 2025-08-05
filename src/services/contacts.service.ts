import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    DocumentSnapshot,
    QueryConstraint,
    Timestamp,
    writeBatch,
    serverTimestamp,
    onSnapshot,
    Unsubscribe,
  } from 'firebase/firestore'
  import { db } from '@/lib/firebase'
  import { 
    Contact, 
    ContactType, 
    IndividualContact, 
    CompanyContact, 
    ServiceContact,
    isIndividualContact,
    isCompanyContact,
    isServiceContact 
  } from '@/types/contacts'
  
  const CONTACTS_COLLECTION = 'contacts'
  const BATCH_SIZE = 20
  
  export class ContactsService {
    // Create operations
    static async createContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
      try {
        const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
          ...contactData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        return docRef.id
      } catch (error) {
        console.error('Error creating contact:', error)
        throw new Error('Failed to create contact')
      }
    }
  
    // Read operations
    static async getContact(id: string): Promise<Contact | null> {
      try {
        const docRef = doc(db, CONTACTS_COLLECTION, id)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          return {
            id: docSnap.id,
            ...docSnap.data()
          } as Contact
        }
        return null
      } catch (error) {
        console.error('Error getting contact:', error)
        throw new Error('Failed to get contact')
      }
    }
  
    static async getAllContacts(options?: {
      type?: ContactType
      onlyFavorites?: boolean
      searchTerm?: string
      orderByField?: string
      orderDirection?: 'asc' | 'desc'
      limitCount?: number
      lastDoc?: DocumentSnapshot
    }): Promise<{ contacts: Contact[], lastDoc: DocumentSnapshot | null }> {
      try {
        const constraints: QueryConstraint[] = []
  
        // Type filter
        if (options?.type) {
          constraints.push(where('type', '==', options.type))
        }
  
        // Favorites filter
        if (options?.onlyFavorites) {
          constraints.push(where('isFavorite', '==', true))
        }
  
        // Ordering
        const orderField = options?.orderByField || 'updatedAt'
        const orderDir = options?.orderDirection || 'desc'
        constraints.push(orderBy(orderField, orderDir))
  
        // Pagination
        if (options?.lastDoc) {
          constraints.push(startAfter(options.lastDoc))
        }
        if (options?.limitCount) {
          constraints.push(limit(options.limitCount))
        } else {
          constraints.push(limit(BATCH_SIZE))
        }
  
        const q = query(collection(db, CONTACTS_COLLECTION), ...constraints)
        const querySnapshot = await getDocs(q)
        
        const contacts: Contact[] = []
        querySnapshot.forEach((doc) => {
          contacts.push({
            id: doc.id,
            ...doc.data()
          } as Contact)
        })
  
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] || null
  
        // Client-side search filtering (for now)
        if (options?.searchTerm) {
          const searchLower = options.searchTerm.toLowerCase()
          return {
            contacts: contacts.filter(contact => {
              if (isIndividualContact(contact)) {
                return (
                  contact.firstName.toLowerCase().includes(searchLower) ||
                  contact.lastName.toLowerCase().includes(searchLower) ||
                  contact.emails?.some(e => e.email.toLowerCase().includes(searchLower)) ||
                  contact.phones?.some(p => p.number.includes(searchLower))
                )
              } else if (isCompanyContact(contact)) {
                return (
                  contact.companyName.toLowerCase().includes(searchLower) ||
                  contact.vatNumber?.includes(searchLower) ||
                  contact.emails?.some(e => e.email.toLowerCase().includes(searchLower))
                )
              } else {
                return (
                  contact.serviceName.toLowerCase().includes(searchLower) ||
                  contact.emails?.some(e => e.email.toLowerCase().includes(searchLower))
                )
              }
            }),
            lastDoc
          }
        }
  
        return { contacts, lastDoc }
      } catch (error) {
        console.error('Error getting contacts:', error)
        throw new Error('Failed to get contacts')
      }
    }
  
    // Update operations
    static async updateContact(id: string, updates: Partial<Contact>): Promise<void> {
      try {
        const docRef = doc(db, CONTACTS_COLLECTION, id)
        await updateDoc(docRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        })
      } catch (error) {
        console.error('Error updating contact:', error)
        throw new Error('Failed to update contact')
      }
    }
  
    static async toggleFavorite(id: string, currentStatus: boolean): Promise<void> {
      try {
        await this.updateContact(id, { isFavorite: !currentStatus })
      } catch (error) {
        console.error('Error toggling favorite:', error)
        throw new Error('Failed to toggle favorite')
      }
    }
  
    // Delete operations
    static async deleteContact(id: string): Promise<void> {
      try {
        await deleteDoc(doc(db, CONTACTS_COLLECTION, id))
      } catch (error) {
        console.error('Error deleting contact:', error)
        throw new Error('Failed to delete contact')
      }
    }
  
    static async deleteMultipleContacts(ids: string[]): Promise<void> {
      try {
        const batch = writeBatch(db)
        ids.forEach(id => {
          const docRef = doc(db, CONTACTS_COLLECTION, id)
          batch.delete(docRef)
        })
        await batch.commit()
      } catch (error) {
        console.error('Error deleting multiple contacts:', error)
        throw new Error('Failed to delete contacts')
      }
    }
  
    // Real-time listeners
    static subscribeToContacts(
      callback: (contacts: Contact[]) => void,
      options?: {
        type?: ContactType
        onlyFavorites?: boolean
      }
    ): Unsubscribe {
      const constraints: QueryConstraint[] = []
  
      if (options?.type) {
        constraints.push(where('type', '==', options.type))
      }
      if (options?.onlyFavorites) {
        constraints.push(where('isFavorite', '==', true))
      }
      constraints.push(orderBy('updatedAt', 'desc'))
  
      const q = query(collection(db, CONTACTS_COLLECTION), ...constraints)
  
      return onSnapshot(q, (snapshot) => {
        const contacts: Contact[] = []
        snapshot.forEach((doc) => {
          contacts.push({
            id: doc.id,
            ...doc.data()
          } as Contact)
        })
        callback(contacts)
      })
    }
  
    // Statistics
    static async getContactStatistics(): Promise<{
      total: number
      individuals: number
      companies: number
      services: number
      favorites: number
    }> {
      try {
        const allContactsSnap = await getDocs(collection(db, CONTACTS_COLLECTION))
        
        let individuals = 0
        let companies = 0
        let services = 0
        let favorites = 0
  
        allContactsSnap.forEach((doc) => {
          const data = doc.data()
          switch (data.type) {
            case 'individual':
              individuals++
              break
            case 'company':
              companies++
              break
            case 'service':
              services++
              break
          }
          if (data.isFavorite) {
            favorites++
          }
        })
  
        return {
          total: allContactsSnap.size,
          individuals,
          companies,
          services,
          favorites
        }
      } catch (error) {
        console.error('Error getting statistics:', error)
        throw new Error('Failed to get statistics')
      }
    }
  
    // Import/Export
    static async importContacts(contacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
      try {
        const batch = writeBatch(db)
        let count = 0
  
        for (const contact of contacts) {
          if (count >= 500) {
            // Firestore batch limit
            await batch.commit()
            count = 0
          }
          
          const docRef = doc(collection(db, CONTACTS_COLLECTION))
          batch.set(docRef, {
            ...contact,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
          count++
        }
  
        if (count > 0) {
          await batch.commit()
        }
  
        return contacts.length
      } catch (error) {
        console.error('Error importing contacts:', error)
        throw new Error('Failed to import contacts')
      }
    }
  
    static async exportContacts(type?: ContactType): Promise<Contact[]> {
      try {
        const constraints: QueryConstraint[] = []
        if (type) {
          constraints.push(where('type', '==', type))
        }
  
        const q = query(collection(db, CONTACTS_COLLECTION), ...constraints)
        const snapshot = await getDocs(q)
        
        const contacts: Contact[] = []
        snapshot.forEach((doc) => {
          contacts.push({
            id: doc.id,
            ...doc.data()
          } as Contact)
        })
  
        return contacts
      } catch (error) {
        console.error('Error exporting contacts:', error)
        throw new Error('Failed to export contacts')
      }
    }
  
    // Search with advanced filters
    static async searchContacts(searchOptions: {
      searchTerm?: string
      type?: ContactType
      tags?: string[]
      city?: string
      hasPhone?: boolean
      hasEmail?: boolean
      createdAfter?: Date
      createdBefore?: Date
    }): Promise<Contact[]> {
      try {
        const constraints: QueryConstraint[] = []
  
        // Basic filters that can be done server-side
        if (searchOptions.type) {
          constraints.push(where('type', '==', searchOptions.type))
        }
  
        const q = query(collection(db, CONTACTS_COLLECTION), ...constraints)
        const snapshot = await getDocs(q)
        
        let contacts: Contact[] = []
        snapshot.forEach((doc) => {
          contacts.push({
            id: doc.id,
            ...doc.data()
          } as Contact)
        })
  
        // Client-side filtering for complex queries
        if (searchOptions.searchTerm) {
          const term = searchOptions.searchTerm.toLowerCase()
          contacts = contacts.filter(contact => {
            const searchableText = JSON.stringify(contact).toLowerCase()
            return searchableText.includes(term)
          })
        }
  
        if (searchOptions.tags && searchOptions.tags.length > 0) {
          contacts = contacts.filter(contact => 
            contact.tags?.some(tag => searchOptions.tags?.includes(tag))
          )
        }
  
        if (searchOptions.city) {
          contacts = contacts.filter(contact =>
            contact.addresses?.some(addr => 
              addr.city.toLowerCase().includes(searchOptions.city!.toLowerCase())
            )
          )
        }
  
        if (searchOptions.hasPhone !== undefined) {
          contacts = contacts.filter(contact =>
            searchOptions.hasPhone ? contact.phones && contact.phones.length > 0 : !contact.phones || contact.phones.length === 0
          )
        }
  
        if (searchOptions.hasEmail !== undefined) {
          contacts = contacts.filter(contact =>
            searchOptions.hasEmail ? contact.emails && contact.emails.length > 0 : !contact.emails || contact.emails.length === 0
          )
        }
  
        if (searchOptions.createdAfter) {
          contacts = contacts.filter(contact => {
            const createdAt = contact.createdAt instanceof Timestamp 
              ? contact.createdAt.toDate() 
              : contact.createdAt
            return createdAt >= searchOptions.createdAfter!
          })
        }
  
        if (searchOptions.createdBefore) {
          contacts = contacts.filter(contact => {
            const createdAt = contact.createdAt instanceof Timestamp 
              ? contact.createdAt.toDate() 
              : contact.createdAt
            return createdAt <= searchOptions.createdBefore!
          })
        }
  
        return contacts
      } catch (error) {
        console.error('Error searching contacts:', error)
        throw new Error('Failed to search contacts')
      }
    }
  }