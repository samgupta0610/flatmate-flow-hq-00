import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Phone, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useHouseholdContacts } from '@/hooks/useHouseholdContacts';

const HouseholdContactsManager: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    contact_type: 'cook' as 'cook' | 'maid',
    name: '',
    phone_number: ''
  });
  const [editForm, setEditForm] = useState({
    name: '',
    phone_number: ''
  });
  
  const { toast } = useToast();
  const { contacts, loading, addContact, updateContact, deleteContact } = useHouseholdContacts();

  const handleAdd = async () => {
    if (!newContact.name.trim() || !newContact.phone_number.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      await addContact(newContact);
      setNewContact({ contact_type: 'cook', name: '', phone_number: '' });
      setIsAdding(false);
      toast({
        title: "Contact Added!",
        description: `${newContact.name} has been added to your contacts.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive"
      });
    }
  };

  const startEdit = (contact: any) => {
    setEditingId(contact.id);
    setEditForm({
      name: contact.name,
      phone_number: contact.phone_number
    });
  };

  const handleEdit = async (id: string) => {
    if (!editForm.name.trim() || !editForm.phone_number.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateContact(id, editForm);
      setEditingId(null);
      toast({
        title: "Contact Updated!",
        description: "Contact has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteContact(id);
        toast({
          title: "Contact Deleted",
          description: `${name} has been removed from your contacts.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete contact. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Household Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading contacts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
          Household Contacts
        </CardTitle>
        <CardDescription>Manage your cook and maid contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Contacts */}
        {contacts.length > 0 ? (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  {editingId === contact.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Name"
                        className="h-8"
                      />
                      <Input
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                        placeholder="Phone number"
                        className="h-8"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{contact.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {contact.contact_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {contact.phone_number}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-1">
                  {editingId === contact.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(contact.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(contact)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(contact.id, contact.name)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No household contacts added yet</p>
        )}

        {/* Add New Contact */}
        {isAdding ? (
          <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label>Contact Type</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={newContact.contact_type === 'cook' ? 'default' : 'outline'}
                  onClick={() => setNewContact({ ...newContact, contact_type: 'cook' })}
                >
                  Cook
                </Button>
                <Button
                  size="sm"
                  variant={newContact.contact_type === 'maid' ? 'default' : 'outline'}
                  onClick={() => setNewContact({ ...newContact, contact_type: 'maid' })}
                >
                  Maid
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Input
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              />
              <Input
                placeholder="Phone number"
                value={newContact.phone_number}
                onChange={(e) => setNewContact({ ...newContact, phone_number: e.target.value })}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAdd} size="sm" className="flex-1">
                <Save className="w-4 h-4 mr-1" />
                Add Contact
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewContact({ contact_type: 'cook', name: '', phone_number: '' });
                }}
                size="sm"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Household Contact
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default HouseholdContactsManager;
