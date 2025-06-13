import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Store, Phone, Plus, Edit2, Trash2, Save, X, MapPin, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useVendorContacts } from '@/hooks/useVendorContacts';

const VendorContactsManager: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newVendor, setNewVendor] = useState({
    shop_name: '',
    contact_person: '',
    phone_number: '',
    shop_type: '',
    address: ''
  });
  const [editForm, setEditForm] = useState({
    shop_name: '',
    contact_person: '',
    phone_number: '',
    shop_type: '',
    address: ''
  });
  
  const { toast } = useToast();
  const { vendors, loading, addVendor, updateVendor, deleteVendor } = useVendorContacts();

  const shopTypes = ['Grocery', 'Pharmacy', 'Restaurant', 'Hardware', 'Laundry', 'Other'];

  const handleAdd = async () => {
    if (!newVendor.shop_name.trim() || !newVendor.phone_number.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter at least shop name and phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      await addVendor(newVendor);
      setNewVendor({
        shop_name: '',
        contact_person: '',
        phone_number: '',
        shop_type: '',
        address: ''
      });
      setIsAdding(false);
      toast({
        title: "Vendor Added!",
        description: `${newVendor.shop_name} has been added to your contacts.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vendor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const startEdit = (vendor: any) => {
    setEditingId(vendor.id);
    setEditForm({
      shop_name: vendor.shop_name,
      contact_person: vendor.contact_person || '',
      phone_number: vendor.phone_number,
      shop_type: vendor.shop_type || '',
      address: vendor.address || ''
    });
  };

  const handleEdit = async (id: string) => {
    if (!editForm.shop_name.trim() || !editForm.phone_number.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter at least shop name and phone number",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateVendor(id, editForm);
      setEditingId(null);
      toast({
        title: "Vendor Updated!",
        description: "Vendor information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vendor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string, shopName: string) => {
    if (window.confirm(`Are you sure you want to delete ${shopName}?`)) {
      try {
        await deleteVendor(id);
        toast({
          title: "Vendor Deleted",
          description: `${shopName} has been removed from your contacts.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete vendor. Please try again.",
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
            <Store className="w-5 h-5" />
            Vendor Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading vendors...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          Vendor Contacts
        </CardTitle>
        <CardDescription>Manage your nearby shops and vendor contact information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Existing Vendors */}
        {vendors.length > 0 ? (
          <div className="space-y-3">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="p-3 border rounded-lg">
                {editingId === vendor.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editForm.shop_name}
                      onChange={(e) => setEditForm({ ...editForm, shop_name: e.target.value })}
                      placeholder="Shop name *"
                      className="h-8"
                    />
                    <Input
                      value={editForm.contact_person}
                      onChange={(e) => setEditForm({ ...editForm, contact_person: e.target.value })}
                      placeholder="Contact person"
                      className="h-8"
                    />
                    <Input
                      value={editForm.phone_number}
                      onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                      placeholder="Phone number *"
                      className="h-8"
                    />
                    <div className="flex gap-2">
                      {shopTypes.map((type) => (
                        <Button
                          key={type}
                          size="sm"
                          variant={editForm.shop_type === type ? 'default' : 'outline'}
                          onClick={() => setEditForm({ ...editForm, shop_type: type })}
                          className="text-xs"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                    <Input
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      placeholder="Address"
                      className="h-8"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(vendor.id)}
                        className="flex-1"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="flex-1"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{vendor.shop_name}</h4>
                          {vendor.shop_type && (
                            <Badge variant="outline" className="text-xs">
                              {vendor.shop_type}
                            </Badge>
                          )}
                        </div>
                        
                        {vendor.contact_person && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {vendor.contact_person}
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {vendor.phone_number}
                        </p>
                        
                        {vendor.address && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {vendor.address}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(vendor)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(vendor.id, vendor.shop_name)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No vendor contacts added yet</p>
        )}

        {/* Add New Vendor */}
        {isAdding ? (
          <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Input
                placeholder="Shop name *"
                value={newVendor.shop_name}
                onChange={(e) => setNewVendor({ ...newVendor, shop_name: e.target.value })}
              />
              <Input
                placeholder="Contact person"
                value={newVendor.contact_person}
                onChange={(e) => setNewVendor({ ...newVendor, contact_person: e.target.value })}
              />
              <Input
                placeholder="Phone number *"
                value={newVendor.phone_number}
                onChange={(e) => setNewVendor({ ...newVendor, phone_number: e.target.value })}
              />
              
              <Label className="text-sm">Shop Type (Optional)</Label>
              <div className="grid grid-cols-3 gap-1">
                {shopTypes.map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={newVendor.shop_type === type ? 'default' : 'outline'}
                    onClick={() => setNewVendor({ ...newVendor, shop_type: type })}
                    className="text-xs"
                  >
                    {type}
                  </Button>
                ))}
              </div>
              
              <Input
                placeholder="Address (optional)"
                value={newVendor.address}
                onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleAdd} size="sm" className="flex-1">
                <Save className="w-4 h-4 mr-1" />
                Add Vendor
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setNewVendor({
                    shop_name: '',
                    contact_person: '',
                    phone_number: '',
                    shop_type: '',
                    address: ''
                  });
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
            Add Vendor Contact
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorContactsManager;
