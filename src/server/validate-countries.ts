import iso31662 from './utils/iso31662';
import fs from 'fs';

Object.values(iso31662.countries).map((countries) =>
    countries.map((country) => {
        const topojson = JSON.parse(fs.readFileSync(`./topojson/${country.code}.json`, 'utf8'));
        const map = new Map<string, string>();

        Object.values(topojson.objects).forEach((obj: any) => {
            map.set(obj.properties.isoCode, obj.properties.name);
        });

        country.sub.forEach((sub) => {
            const item = map.get(sub.code);

            if (!item) {
                console.log(`${country.name} ${country.code} ${sub.code}`);
                throw new Error(`Missing`);
            } else if (item != sub.name) {
                console.log(country.name, item, sub);
                throw new Error(`Mismatch `);
            }
        });
    })
);
