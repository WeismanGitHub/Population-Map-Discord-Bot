import React from 'react'
import * as ChartGeo from "chartjs-chart-geo";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Title,
  Legend
} from "chart.js";
import Map from "./map";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature
);

export default function Guilds() {
    // const [geojson, setGeojson] = useState({})
    // const { guildID } = useParams()
    // guildID

    // useEffect(() => {
    //     (async () => {
    //         const res: JSON = await ky.get('https://cdn.jsdelivr.net/npm/us-atlas/states-10m.json').json()

    //         setGeojson(res)
    //     })()
    // }, [])
    
    return (
      <div>
        <Map chosenKey="china" />
      </div>
    );
}