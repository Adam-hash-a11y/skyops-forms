export interface Passenger {
  firstName: string;
  lastName: string;
  passportNumber: string;
  nationality: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
}

export const passengers: Passenger[] = [
  {
    firstName: "Lena",
    lastName: "Fischer",
    passportNumber: "PA284719",
    nationality: "German",
    dateOfBirth: "1994-03-12",
    email: "lena.fischer@example.com",
    phoneNumber: "+4915123456",
  },
  {
    firstName: "Omar",
    lastName: "Ben Salah",
    passportNumber: "TN901823",
    nationality: "Tunisian",
    dateOfBirth: "1998-07-25",
    email: "omar.bensalah@example.com",
    phoneNumber: "+21620123456",
  },
  {
    firstName: "Sofia",
    lastName: "Martinez",
    passportNumber: "ES558214",
    nationality: "Spanish",
    dateOfBirth: "1990-11-02",
    email: "sofia.martinez@example.com",
    phoneNumber: "+34612345678",
  },
];
