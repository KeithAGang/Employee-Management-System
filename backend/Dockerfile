# Stage 1: Build the ASP.NET Core application
# Use the SDK image for building the application.
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Set the working directory inside the container.
# This will be the root for your backend project files.
WORKDIR /src

# Copy the .csproj file and restore dependencies.
# Since the Dockerfile is in the 'backend' folder, 'backend.csproj' is in the current context.
COPY backend.csproj ./

# Copy the rest of the application source code to the working directory.
# This copies all files from the 'backend' folder (where the Dockerfile is) into /src.
COPY . .

# Restore project dependencies.
RUN dotnet restore backend.csproj

# Build the project first to ensure all dependencies are resolved and compiled.
# This step helps to catch any compilation issues before publishing.
RUN dotnet build backend.csproj -c Release --no-restore

# Publish the application for production.
# Removed --no-restore here to ensure a full restore happens during publish,
# which often resolves NETSDK1064 errors related to missing packages.
RUN dotnet publish backend.csproj -c Release -o /app/publish

# Stage 2: Run the ASP.NET Core application
# Use the ASP.NET runtime image, which is smaller and more secure for production.
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

# Set the working directory inside the container.
WORKDIR /app

# Copy the published application from the 'build' stage.
COPY --from=build /app/publish .

# Expose port 7026 for HTTPS traffic.
EXPOSE 7026

# Set environment variables for ASP.NET Core.
# This tells ASP.NET Core to listen on all available network interfaces for HTTPS.
ENV ASPNETCORE_URLS="https://+*:7026"
# Set the ASP.NET Core environment to Production.
ENV ASPNETCORE_ENVIRONMENT=Production

# Define the entry point for the container.
# This command runs your ASP.NET Core application.
ENTRYPOINT ["dotnet", "backend.dll"]

# Instructions to build and run:
# 1. Ensure this Dockerfile is located directly inside your 'backend' project folder.
# 2. Build the Docker image from the 'backend' folder:
#    docker build -t my-aspnet-webapi .
# 3. Run the Docker container, mapping port 7026 from the container to port 7026 on your host:
#    docker run -p 7026:7026 -e ASPNETCORE_Kestrel__Certificates__Default__Password="YourCertPassword" -e ASPNETCORE_Kestrel__Certificates__Default__Path="/path/to/your/certificate.pfx" my-aspnet-webapi
#    (Note: For HTTPS, you'll need to provide a certificate. The example above shows how to pass certificate path and password via environment variables.
#    For development, you might temporarily disable HTTPS or use self-signed certs configured in your app.)
# 4. Access your API in a browser or API client at https://localhost:7026/your-api-endpoint
