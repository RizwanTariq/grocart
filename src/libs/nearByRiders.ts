import axios from "axios";

export type LocationEntry = {
  userId: string;
  latitude: string;
  longitude: string;
  socketId: string;
  lastActiveAt: string;
};

export type LocationsMap = {
  [userId: string]: LocationEntry;
};

export type ActiveRidersPayload = {
  locations: LocationsMap;
  userIds: string[];
};

async function nearByRiders(
  coordinates: { longitude: number; latitude: number },
  userId: string,
  radius = 20,
  limit = 20
): Promise<ActiveRidersPayload> {
  const defaultRes = {
    locations: {},
    userIds: [],
  };
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/nearby-riders`,
      {
        coordinates,
        userId,
        radius,
        limit,
      },
      {
        headers: {
          "x-emitter-secret": process.env.EMITTER_SECRET,
        },
      }
    );

    if (res.status === 200) {
      return res.data;
    } else {
      return defaultRes;
    }
  } catch (error) {
    console.error(error);
    return defaultRes;
  }
}

export default nearByRiders;
