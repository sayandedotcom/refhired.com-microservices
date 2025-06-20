# Deploy service to Local Environment ( Docker Desktop )

## Prerequisites

- Install Docker Desktop on your local machine.
- Enable Kubernetes in Docker Desktop settings if you plan to use Kubernetes for local deployment.

## Steps to deploy services

1. **Navigate to `infra/k8s-local` folder**:

   - It contains all necessary files to deploy your service locally using Docker.

2. **Replace < your-docker-username > with your docker username**:

   - Open the .yaml files in the `infra/k8s-local` directory.
   - Replace `<your-docker-username>` with your actual Docker Hub username or the username you use for Docker Desktop.

     ```yaml
     spec:
     containers:
       - name: client
         image: <your-docker-username>/auth
     ```

3. **Set domain and change the host file**

   - Go to the `ingress-srv.yaml` file in the `k8s-dev` folder.
   - If you want to access your service using a custom domain, you can set it in:

     ```yaml
     rules:
       - host: yourhostname.com
     ```

   - Update your local `hosts` file to map the domain to `yourhostname.com`
   - On Windows, the `hosts` file is located at `C:\Windows\System32\drivers\etc\hosts`.
   - On macOS or Linux, it is located at `/etc/hosts`.
   - Open your `hosts` file:

   ```bash
      # For Windows, macOS, or Linux
       code /etc/hosts
   ```

   - Add the following line to your `hosts` file:

   ```bash
      127.0.0.1 yourhostname.com
   ```

4. **Navigate to `skaffold` folder** (optional):

   - It contains the `skaffold-local.yaml` file for deploying your service using Skaffold.

5. **Replace < your-docker-username > with your docker username**:

   - Open `skaffold-local.yaml` file.
   - Replace `<your-docker-username>` with your actual Docker Hub username or the username you use for Docker Desktop.

     ```yaml
     artifacts:
       - image: <your-docker-username>/auth
         context: auth
     ```

6. **Navigate to root**:

   - Copy the `skaffold-local.yaml` file to the root directory of your project inside `skaffold.yaml` file.
   - This file is used to build and deploy your service locally.

7. **Run `skaffold dev` command**:

   - Run the following command in your terminal:

     ```bash
     skaffold dev -f skaffold-local.yaml
     ```

   - Open a web browser and navigate to `yourdomain.com` (or the domain you specified).

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

## Troubleshooting

- If you encounter issues with building the Docker image, check the Dockerfile for syntax errors or missing dependencies.
- If your service is not accessible, ensure that the port mapping in the `docker run` or `docker-compose.yml` file is correct.
- If you face issues with Docker Desktop, check the logs for any errors and ensure that Docker is running properly.

## Conclusion

Deploying services locally using Docker Desktop allows for quick development and testing. By following the steps outlined above, you can easily set up your service in a containerized environment, ensuring consistency across different development setups. Regularly update your Docker images and containers to keep your service secure and performant.
