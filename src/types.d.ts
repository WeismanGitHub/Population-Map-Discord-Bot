interface CustomID<data> {
    type: string;
    data: data;
}

declare global {
    declare module 'express-session' {
        interface SessionData {
            userID?: string;
            accessToken?: string;
        }
    }
}

type Country = {
    name: string;
    sub: Subdivision[];
    code: string;
};

type Subdivision =
    | {
          countryName: string;
          countryCode: string;
          code: string;
          regionCode: string;
          type: string;
          name: string;
      }
    | {
          type: string;
          name: string;
          code: string;
      };

type CountryLetter =
    | 'A'
    | 'Å'
    | 'B'
    | 'C'
    | 'D'
    | 'E'
    | 'F'
    | 'G'
    | 'H'
    | 'I'
    | 'J'
    | 'K'
    | 'L'
    | 'M'
    | 'N'
    | 'O'
    | 'P'
    | 'Q'
    | 'R'
    | 'S'
    | 'T'
    | 'U'
    | 'V'
    | 'W'
    | 'Y'
    | 'Z';
