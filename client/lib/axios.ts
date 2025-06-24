import axios from "axios";

export const client = axios.create({
  baseURL:
    typeof window === "undefined"
      ? process.env.NODE_ENV === "production"
        ? "http://www.refhired.com"
        : "http://ingress-nginx.ingress-nginx-controller.svc.cluster.local"
      : "/",
});
