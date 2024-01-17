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

type Subdivision = {
    code: string;
    name: string;
    sub: (
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
          }
    )[];
};

type CountryLetters =
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
