import json
import os

class ContactManager:
    def __init__(self, filename='contacts.json'):
        self.filename = filename
        self.contacts = self.load_contacts()

    def load_contacts(self):
        if os.path.exists(self.filename):
            with open(self.filename, 'r') as file:
                return json.load(file)
        return []

    def save_contacts(self):
        with open(self.filename, 'w') as file:
            json.dump(self.contacts, file)

    def add_contact(self, name, phone):
        contact = {"name": name, "phone": phone}
        self.contacts.append(contact)
        self.save_contacts()
        print(f'Contact "{name}" added.')

    def view_contacts(self):
        if not self.contacts:
            print("No contacts found.")
        else:
            print("Contacts List:")
            for idx, contact in enumerate(self.contacts, 1):
                print(f"{idx}. Name: {contact['name']}, Phone: {contact['phone']}")

    def remove_contact(self, contact_number):
        if 0 < contact_number <= len(self.contacts):
            removed_contact = self.contacts.pop(contact_number - 1)
            self.save_contacts()
            print(f'Contact "{removed_contact["name"]}" removed.')
        else:
            print("Invalid contact number.")

def main():
    contact_manager = ContactManager()

    while True:
        print("\nContact Manager Menu:")
        print("1. Add Contact")
        print("2. View Contacts")
        print("3. Remove Contact")
        print("4. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            name = input("Enter contact name: ")
            phone = input("Enter contact phone number: ")
            contact_manager.add_contact(name, phone)
        elif choice == '2':
            contact_manager.view_contacts()
        elif choice == '3':
            contact_manager.view_contacts()
            contact_number = int(input("Enter the contact number to remove: "))
            contact_manager.remove_contact(contact_number)
        elif choice == '4':
            print("Exiting the Contact Manager.")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
