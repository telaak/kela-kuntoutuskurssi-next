import type { NextApiResponse } from "next";
import pDebounce from "p-debounce";

export const debouncedRevalidate = pDebounce(async (res: NextApiResponse<any>) => {
  await res.revalidate("/");
  // await purgeCloudflare();
}, 1000 * 10);

export const debouncedPurge = pDebounce(purgeCloudflare, 1000 * 10);

export async function purgeCloudflare() {
  try {
    await fetch(
      `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONE}/purge_cache`,
      {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
        },
        body: JSON.stringify({
          purge_everything: true,
        }),
      }
    )
      .then((res) => res.json())
      .then(console.log);
  } catch (error) {
    console.error(error);
  }
}
