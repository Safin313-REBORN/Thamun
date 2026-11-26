export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const UTM_STORAGE_KEY = "thamun_utm";

export function captureUtmParams(): UtmParams | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");

  if (source) utm.utm_source = source.slice(0, 64);
  if (medium) utm.utm_medium = medium.slice(0, 64);
  if (campaign) utm.utm_campaign = campaign.slice(0, 64);

  if (Object.keys(utm).length > 0) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    } catch {
      // Ignore storage quota errors
    }
    return utm;
  }
  return getStoredUtmParams();
}

export function getStoredUtmParams(): UtmParams | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UtmParams) : null;
  } catch {
    return null;
  }
}
