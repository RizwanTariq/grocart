import { EmitterEvent } from "@/types/generic";
import axios from "axios";

async function eventEmitter(
  event: EmitterEvent,
  data: unknown,
  socketId?: string
) {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/notify`,
      {
        socketId,
        event,
        data,
      },
      {
        headers: {
          "x-emitter-secret": process.env.EMITTER_SECRET,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
}

export default eventEmitter;
