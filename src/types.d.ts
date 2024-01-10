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
