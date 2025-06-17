# Info

This github reopository is minimal (not all features) mictoservice implementation of [this project](https://github.com/sayandedotcom/refhired.com).
You can read more about this in [this blog](https://github.com/sayandedotcom/refhired.com)

## Tech Stack List

| Tech Stack                      | Info.                                                                                         |
| ------------------------------- | --------------------------------------------------------------------------------------------- |
| **Next.js 15**                  | A React framework for building server-side rendered applications.                             |
| **TailwindCSS**                 | A utility-first CSS framework for styling the front-end.                                      |
| **Shadcn**                      | A component library for building user interfaces with React.                                  |
| **Node.js**                     | A JavaScript runtime for building server-side applications.                                   |
| **Express.js**                  | A web application framework for Node.js, used for building APIs.                              |
| **NATS Streaming**              | A lightweight messaging system for microservices communication.                               |
| **Prisma**                      | An ORM (Object-Relational Mapping) tool for Node.js, used for database interactions.          |
| **PostgreSQL**                  | A relational database management system used for storing data.                                |
| **Mongoose**                    | An ODM (Object Data Modeling) library for MongoDB, used for database interactions.            |
| **MongoDB**                     | A NoSQL database used for storing data in a flexible, JSON-like format.                       |
| **Stripe**                      | A payment processing platform for handling payments and subscriptions.                        |
| **Kubernetes**                  | A container orchestration platform for deploying and managing microservices.                  |
| **Docker**                      | A platform for developing, shipping, and running applications in containers.                  |
| **Skaffold**                    | A tool for continuous development and deployment of Kubernetes applications.                  |
| **GitHub Actions**              | A CI/CD tool for automating workflows, such as building, testing, and deploying applications. |
| **Google Cloud Platform (GCP)** | A cloud computing platform for hosting and managing applications and services.                |

## Services List

These folder contains the individual services for microservices for the project. Each service is a separate package that can be developed, tested, scales and deployed independently.

| Index No. | Folder     | Services                            | Tech Stack                                                      |
| --------- | ---------- | ----------------------------------- | --------------------------------------------------------------- |
| 1         | `apply`    | Feature to apply for referrals      | Node.js, Express.js, NATS Streaming, Prisma, PostgreSQL         |
| 2         | `auth`     | Centeralised authentication service | Node.js, Express.js, NATS Streaming, Mongoose, MongoDB          |
| 3         | `client`   | Front-end                           | Next.js 15, TailwindCSS, Shadcn, React Query                    |
| 4         | `payments` | Payment Service                     | Stripe, Node.js, Express.js, NATS Streaming, Prisma, PostgreSQL |
| 5         | `posts`    | To create or update posts           | Node.js, Express.js, NATS Streaming, Prisma, PostgreSQL         |

## Important Folders

### 1. `infra` folder

The `infra` folder contains the infrastructure YAML files for Kubernetes deployments, service, and ingress files. It is used to set up the necessary infrastructure for the microservices to run in a Kubernetes environment.

| Index No. | Folder Name       | Info.                                             | Folder     | Info.                                      |
| --------- | ----------------- | ------------------------------------------------- | ---------- | ------------------------------------------ |
| 1         | `infra/k8s-gcp`   | K8 files for cloud ( GCP ) deployement            | `k8s`      | K8 deployement files for all services      |
|           |                   |                                                   | `k8s-dev`  | File for ingress nginx for development env |
|           |                   |                                                   | `k8s-prod` | File for ingress nginx for production env  |
| 2         | `infra/k8s-local` | K8 files for local ( docker desktop ) deployement | `k8s`      | K8 deployement files for all services      |
|           |                   |                                                   | `k8s-dev`  | File for ingress nginx for development env |
|           |                   |                                                   | `k8s-prod` | File for ingress nginx for production env  |

### 2. `packages`\*\* folder

The `packages` folder contains the common packages to be used by each services in microservices for the project.

| Index No. | Folder Name                       | Info.                                                                 |
| --------- | --------------------------------- | --------------------------------------------------------------------- |
| 1         | `packages/common`                 | For shared nats events, route middlewares (error, authentication) etc |
| 2         | `packages/eslint-config-custom`   | For shared eslint config                                              |
| 3         | `packages/prettier-config-custom` | For shared prettier config                                            |

### 3. `skaffold` folder

The `skaffold` folder contains the Skaffold configuration files for the project. Skaffold is a tool that facilitates continuous development for Kubernetes applications.

| Index No. | Folder Name                    | Info.                                    |
| --------- | ------------------------------ | ---------------------------------------- |
| 1         | `skaffold/skaffold-gcp.yaml`   | For loud ( GCP ) deployement             |
| 2         | `skaffold/skaffold-local.yaml` | For local ( docker desktop ) deployement |

### 4. `.github` folder

The `.github` folder contains the GitHub Actions workflows for the project. These workflows automate various tasks such as building, testing, and deploying the microservices.

| Index No. | Folder Name                       | Info.                  |
| --------- | --------------------------------- | ---------------------- |
| 1         | `.github/workflows/test-*.yaml`   | For testing services   |
| 2         | `.github/workflows/deploy-*.yaml` | For deploying services |

## Important Files

| Index No. | File Name     | Info.                                                                             |
| --------- | ------------- | --------------------------------------------------------------------------------- |
| 1         | skaffold.yaml | This is the main skaffold.yaml file copy and pasy any file from `skaffold` folder |

## How to run

1. Clone the repository

   ```bash
   git clone https://github.com/sayandedotcom/refhired.com-microservices
   ```

2. Copy and paste one file contents from `skaffold` folder to the root of the project basded on which environment you want to run the project in cloud or locally.

   ```bash
    skaffold dev
   ```
