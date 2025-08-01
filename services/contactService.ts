/**
 * Contact Service
 *
 * API service for resident contact information
 */

import type { ContactPerson } from '@/mocks/care-board-data';
import type { ContactFormData } from '@/validations/contact-validation';

class ContactService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Create new contact for a resident
   */
  async createContact(residentId: number, contactData: ContactFormData): Promise<ContactPerson> {
    try {
      // For development, use mock creation
      if (process.env.NODE_ENV === 'development') {
        return this.mockCreateContact(residentId, contactData);
      }

      const response = await fetch(`${this.baseUrl}/api/residents/${residentId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create contact error:', error);
      throw new Error('連絡先の登録に失敗しました。');
    }
  }

  /**
   * Mock contact creation for development
   */
  private async mockCreateContact(
    residentId: number,
    contactData: ContactFormData
  ): Promise<ContactPerson> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.1) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // Generate new contact
    const newContact: ContactPerson = {
      id: `contact-${Date.now()}`,
      type: contactData.type,
      name: contactData.name,
      furigana: contactData.furigana,
      relationship: contactData.relationship,
      phone1: contactData.phone1,
      phone2: contactData.phone2 || undefined,
      email: contactData.email || undefined,
      address: contactData.address || '',
      notes: contactData.notes || undefined,
    };

    // console.log('Mock created contact:', newContact);
    return newContact;
  }

  /**
   * Update existing contact
   */
  async updateContact(
    residentId: number,
    contactId: string,
    contactData: ContactFormData
  ): Promise<ContactPerson> {
    try {
      // For development, use mock update
      if (process.env.NODE_ENV === 'development') {
        return this.mockUpdateContact(residentId, contactId, contactData);
      }

      const response = await fetch(
        `${this.baseUrl}/api/residents/${residentId}/contacts/${contactId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contactData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update contact error:', error);
      throw new Error('連絡先の更新に失敗しました。');
    }
  }

  /**
   * Mock contact update for development
   */
  private async mockUpdateContact(
    residentId: number,
    contactId: string,
    contactData: ContactFormData
  ): Promise<ContactPerson> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // Update contact
    const updatedContact: ContactPerson = {
      id: contactId,
      type: contactData.type,
      name: contactData.name,
      furigana: contactData.furigana,
      relationship: contactData.relationship,
      phone1: contactData.phone1,
      phone2: contactData.phone2 || undefined,
      email: contactData.email || undefined,
      address: contactData.address || '',
      notes: contactData.notes || undefined,
    };

    // console.log('Mock updated contact:', updatedContact);
    return updatedContact;
  }

  /**
   * Delete contact
   */
  async deleteContact(residentId: number, contactId: string): Promise<void> {
    try {
      // For development, use mock deletion
      if (process.env.NODE_ENV === 'development') {
        return this.mockDeleteContact(residentId, contactId);
      }

      const response = await fetch(
        `${this.baseUrl}/api/residents/${residentId}/contacts/${contactId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete contact error:', error);
      throw new Error('連絡先の削除に失敗しました。');
    }
  }

  /**
   * Mock contact deletion for development
   */
  private async mockDeleteContact(residentId: number, contactId: string): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate occasional network errors for testing
    if (Math.random() < 0.05) {
      throw new Error('ネットワークエラーが発生しました。');
    }

    // console.log('Mock deleted contact:', { residentId, contactId });
  }
}

export const contactService = new ContactService();
