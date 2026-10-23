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
    nationality: "DE",
    dateOfBirth: "1994-03-12",
    email: "lena.fischer@example.com",
    phoneNumber: "+4915123456",
  },
  {
    firstName: "Omar",
    lastName: "Ben Salah",
    passportNumber: "TN901823",
    nationality: "TN",
    dateOfBirth: "1998-07-25",
    email: "omar.bensalah@example.com",
    phoneNumber: "+21620123456",
  },
  {
    firstName: "Sofia",
    lastName: "Martinez",
    passportNumber: "ES558214",
    nationality: "ES",
    dateOfBirth: "1990-11-02",
    email: "sofia.martinez@example.com",
    phoneNumber: "+34612345678",
  },
  {
    firstName: "Camille",
    lastName: "Dubois",
    passportNumber: "FR730461",
    nationality: "FR",
    dateOfBirth: "1992-05-19",
    email: "camille.dubois@example.com",
    phoneNumber: "+33612345678",
  },
  {
    firstName: "Marco",
    lastName: "Rossi",
    passportNumber: "IT615937",
    nationality: "IT",
    dateOfBirth: "1987-09-08",
    email: "marco.rossi@example.com",
    phoneNumber: "+393331234567",
  },
  {
    firstName: "Elif",
    lastName: "Yilmaz",
    passportNumber: "TR482056",
    nationality: "TR",
    dateOfBirth: "1996-01-30",
    email: "elif.yilmaz@example.com",
    phoneNumber: "+905321234567",
  },
  {
    firstName: "Jakub",
    lastName: "Nowak",
    passportNumber: "PL397142",
    nationality: "PL",
    dateOfBirth: "1989-12-14",
    email: "jakub.nowak@example.com",
    phoneNumber: "+48512345678",
  },
];
