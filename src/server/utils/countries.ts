import { InternalServerError } from '../errors';
import iso from 'iso-3166-2';

class ISO31662 {
    public readonly countries: Record<CountryLetter, Country[]>;

    constructor() {
        const map: Record<string, Country[]> = {};

        Object.entries(iso.data).map((data) => {
            const subdivisions = Object.entries(data[1].sub)
                .map((sub) => {
                    return { code: sub[0], ...sub[1] };
                })
                .sort((a, b) => a.name.localeCompare(b.name));

            const letter = data[1].name.slice(0, 1);
            const country = { name: data[1].name, sub: subdivisions, code: data[0] };

            if (!map[letter]) {
                map[letter] = [country];
            } else {
                map[letter].push(country);
            }
        });

        const countries: Record<string, Country[]> = {};

        Object.entries(map).forEach((data) => {
            countries[data[0]] = data[1].sort((a, b) => a.name.localeCompare(b.name));
        });

        this.countries = countries as Record<CountryLetter, Country[]>;
    }

    public getCountry(code: string) {
        // Sometimes codes don't start with the same letter as the country.
        const countries: Country[] | undefined = this.countries[code.slice(0, 1) as CountryLetter];
        let country: Country | undefined;

        if (countries) {
            countries.forEach((c) => {
                if (c.code === code) {
                    country = c;
                }
            });
        }

        if (country) {
            return country;
        }

        Object.entries(this.countries).forEach(([letter, countries]) => {
            if (letter == code.slice(0, 1)) {
                return; // Return because we've already checked this earlier.
            }

            countries.forEach((c) => {
                if (c.code === code) {
                    country = c;
                }
            }); 
        });

        if (!country) {
            throw new InternalServerError('Could not find country.');
        }

        return country;
    }
}

const iso31662 = new ISO31662();
export default iso31662;
