# 1. `infra` folder

The `infra` folder contains the infrastructure YAML files for Kubernetes deployments, service, and ingress files. It is used to set up the necessary infrastructure for the microservices to run in a Kubernetes environment.

| Index No. | Folder Name | Info.                                             | Folder     | Info.                                      |
| --------- | ----------- | ------------------------------------------------- | ---------- | ------------------------------------------ |
| 1         | `k8s-gcp`   | K8 files for cloud ( GCP ) deployement            | `k8s`      | K8 deployement files for all services      |
|           |             |                                                   | `k8s-dev`  | File for ingress nginx for development env |
|           |             |                                                   | `k8s-prod` | File for ingress nginx for production env  |
| 2         | `k8s-local` | K8 files for local ( docker desktop ) deployement | `k8s`      | K8 deployement files for all services      |
|           |             |                                                   | `k8s-dev`  | File for ingress nginx for development env |
|           |             |                                                   | `k8s-prod` | File for ingress nginx for production env  |
