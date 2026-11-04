
// TYPESCRIPT INTERFACE


export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  isActive: boolean;
}

// Object implementing interface

export const sampleCustomer: Customer = {
  id: "CUS001",

  name: "Bhavadharini",

  email: "customer@example.com",

  phone: "9876543210",

  city: "Coimbatore",

  isActive: true,
};

// Function using interface

export function getCustomerDetails(customer: Customer): string {
  return `
Customer: ${customer.name}
Email: ${customer.email}
Phone: ${customer.phone}
City: ${customer.city}
Active: ${customer.isActive}
`;
}
