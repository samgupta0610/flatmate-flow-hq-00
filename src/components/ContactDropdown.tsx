
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Store } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone_number: string;
}

interface ContactDropdownProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
  placeholder: string;
  type: 'household' | 'vendor';
}

const ContactDropdown: React.FC<ContactDropdownProps> = ({
  contacts,
  selectedContact,
  onSelectContact,
  placeholder,
  type
}) => {
  const Icon = type === 'household' ? User : Store;

  if (contacts.length === 0) {
    return (
      <Button variant="outline" disabled className="w-full justify-start">
        <Icon className="w-4 h-4 mr-2" />
        No contacts available
      </Button>
    );
  }

  if (contacts.length === 1) {
    return (
      <Button 
        variant="outline" 
        onClick={() => onSelectContact(contacts[0])}
        className="w-full justify-start"
      >
        <Icon className="w-4 h-4 mr-2" />
        {contacts[0].name}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between bg-white">
          <div className="flex items-center">
            <Icon className="w-4 h-4 mr-2" />
            {selectedContact ? selectedContact.name : placeholder}
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full bg-white border shadow-lg z-50">
        {contacts.map((contact) => (
          <DropdownMenuItem
            key={contact.id}
            onClick={() => onSelectContact(contact)}
            className="hover:bg-gray-100 cursor-pointer"
          >
            <div className="flex flex-col">
              <span className="font-medium">{contact.name}</span>
              <span className="text-sm text-gray-500">{contact.phone_number}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ContactDropdown;
