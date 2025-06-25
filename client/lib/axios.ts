import axios from "axios";

export const client = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.NODE_ENV === "production"
        ? "http://your-prod-domain.com"
        : "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local"
      : "/",
  withCredentials: true,
});

// Optional: dynamically inject host header in Node
if (typeof window === "undefined") {
  client.interceptors.request.use((config) => {
    config.headers?.set?.("Host", "refhired.dev");
    return config;
  });
}
