interface IMapJson {
    [key: string]: {
      url: string;
      objectsKey: string;
      propertiesKey: string;
    };
  }
  
  const WORLD_JSON: IMapJson = {
    world: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json",
      objectsKey: "countries1",
      propertiesKey: "name"
    },
    world_continents: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json",
      objectsKey: "continent",
      propertiesKey: "continent"
    }
  };
  
  const CONTINENTS_JSON: IMapJson = {
    africa: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/africa.json",
      objectsKey: "continent_Africa_subunits",
      propertiesKey: "geounit"
    },
    asia: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/asia.json",
      objectsKey: "continent_Asia_subunits",
      propertiesKey: "geounit"
    },
    europe: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/europe.json",
      objectsKey: "continent_Europe_subunits",
      propertiesKey: "geounit"
    },
    north_america: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/north-america.json",
      objectsKey: "continent_North_America_subunits",
      propertiesKey: "geounit"
    },
    south_america: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/south-america.json",
      objectsKey: "continent_South_America_subunits",
      propertiesKey: "geounit"
    },
    oceania: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/oceania.json",
      objectsKey: "continent_Oceania_subunits",
      propertiesKey: "geounit"
    }
  };
  
  const COUNTRIES_JSON: IMapJson = {
    algeria: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/algeria/algeria-provinces.json",
      objectsKey: "DZA_adm1",
      propertiesKey: "NAME_1"
    },
    argentina: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/argentina/argentina-provinces.json",
      objectsKey: "ARG_adm1",
      propertiesKey: "NAME_1"
    },
    azerbaijan: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/azerbaijan/azerbaijan-districts.json",
      objectsKey: "AZE_adm2",
      propertiesKey: "NAME_1"
    },
    belgium: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/belgium/belgium-provinces.json",
      objectsKey: "BEL_adm1",
      propertiesKey: "NAME_1"
    },
    chile: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/chile/chile-regions.json",
      objectsKey: "Regiones_Clean",
      propertiesKey: "Region"
    },
    china: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/china/china-provinces.json",
      objectsKey: "CHN_adm1",
      propertiesKey: "NAME_1"
    },
    colombia: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/colombia/colombia-departments.json",
      objectsKey: "COL_adm1",
      propertiesKey: "NAME_1"
    },
    czech_republic: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/czech-republic/czech-republic-regions.json",
      objectsKey: "CZE_adm1",
      propertiesKey: "NAME_1"
    },
    denmark: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/denmark/denmark-counties.json",
      objectsKey: "DNK_adm1",
      propertiesKey: "NAME_1"
    },
    finland: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/finland/finland-provinces.json",
      objectsKey: "FIN_adm1",
      propertiesKey: "NAME_1"
    },
    france: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/france/fr-departments.json",
      objectsKey: "FRA_adm2",
      propertiesKey: "NAME_1"
    },
    germany: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/germany/germany-regions.json",
      objectsKey: "DEU_adm2",
      propertiesKey: "NAME_1"
    },
    india: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json",
      objectsKey: "IND_adm1",
      propertiesKey: "NAME_1"
    },
    ireland: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/ireland/ireland-counties.json",
      objectsKey: "IRL_adm1",
      propertiesKey: "NAME_1"
    },
    italy: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/italy/italy-provinces.json",
      objectsKey: "ITA_adm2",
      propertiesKey: "NAME_1"
    },
    japan: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/japan/jp-prefectures.json",
      objectsKey: "JPN_adm1",
      propertiesKey: "NAME_1"
    },
    liberia: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/liberia/liberia-counties.json",
      objectsKey: "LBR_adm1",
      propertiesKey: "NAME_1"
    },
    nepal: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/nepal/nepal-districts.json",
      objectsKey: "NPL_adm3",
      propertiesKey: "NAME_1"
    },
    netherlands: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/netherlands/nl-gemeentegrenzen-2016.json",
      objectsKey: "Gemeentegrenzen",
      propertiesKey: "GM_NAAM"
    },
    new_zealand: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/new-zealand/new-zealand-districts.json",
      objectsKey: "NZL_adm2",
      propertiesKey: "NAME_1"
    },
    nigeria: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/nigeria/nigeria-states.json",
      objectsKey: "NGA_adm1",
      propertiesKey: "NAME_1"
    },
    norway: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/norway/norway-counties.json",
      objectsKey: "NOR_adm1",
      propertiesKey: "NAME_1"
    },
    pakistan: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/pakistan/pakistan-districts.json",
      objectsKey: "PAK_adm3",
      propertiesKey: "NAME_1"
    },
    peru: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/peru/peru-departments.json",
      objectsKey: "peru-departments'",
      propertiesKey: "NOMBDEP"
    },
    philippines: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/philippines/philippines-provinces.json",
      objectsKey: "PHL_adm1",
      propertiesKey: "NAME_1"
    },
    poland: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/poland/poland-provinces.json",
      objectsKey: "POL_adm1",
      propertiesKey: "NAME_1"
    },
    portugal: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/portugal/portugal-districts.json",
      objectsKey: "PRT_adm1",
      propertiesKey: "NAME_1"
    },
    romania: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/romania/romania-counties.json",
      objectsKey: "ROU_adm1",
      propertiesKey: "NAME_1"
    },
    south_africa: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/south-africa/south-africa-provinces.json",
      objectsKey: "ZAF_adm1",
      propertiesKey: "NAME_1"
    },
    spain: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/spain/spain-province-with-canary-islands.json",
      objectsKey: "ESP_adm2",
      propertiesKey: "NAME_1"
    },
    sweden: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/sweden/sweden-counties.json",
      objectsKey: "SWE_adm1",
      propertiesKey: "NAME_1"
    },
    turkey: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/turkey/turkiye.json",
      objectsKey: "collection",
      propertiesKey: "NAME1_"
    },
    united_arab_emirates: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-arab-emirates/united-arab-emirates.json",
      objectsKey: "ARE_adm1",
      propertiesKey: "NAME_1"
    },
    united_kingdom: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/united-states/us-albers.json",
      objectsKey: "GBR_adm2",
      propertiesKey: "NAME_1"
    },
    united_states: {
      url: "https://unpkg.com/us-atlas/states-10m.json",
      objectsKey: "states",
      propertiesKey: "name"
    },
    venezuela: {
      url:
        "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/venezuela/venezuela-estados.json",
      objectsKey: "VEN_adm1",
      propertiesKey: "NAME_1"
    }
  };
  
  const MAP_JSON = { ...WORLD_JSON, ...CONTINENTS_JSON, ...COUNTRIES_JSON };
  
  export default MAP_JSON;
  