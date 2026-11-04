// UNIT IV - using a node module (axios) and calling a REST endpoint
import axios from "axios";

export interface ApiArtist {
  _id: string;
  name: string;
  location: string;
  services: string[];
  pricePerHour: number;
}

// "/api" is forwarded to the Node server by webpack-dev-server (see devServer.proxy)
const client = axios.create({ baseURL: "/api", timeout: 5000 });

export async function fetchArtists(): Promise<ApiArtist[]> {
  const response = await client.get<{ artists: ApiArtist[] }>("/artist/approved");
  return response.data.artists;
}
