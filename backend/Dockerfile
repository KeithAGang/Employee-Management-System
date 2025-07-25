# Stage 1: Build the ASP.NET Core application
# Use the SDK image for building the application.
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

# Set the working directory inside the container.
# This will be the root for your backend project files.
WORKDIR /src

# Copy the .csproj file and restore dependencies.
# Since the Dockerfile is in the 'backend' folder, 'backend.csproj' is in the current context.
COPY backend.csproj ./

# Restore project dependencies.
RUN dotnet restore backend.csproj

# Copy the rest of the application source code to the working directory.
# This copies all files from the 'backend' folder (where the Dockerfile is) into /src.
COPY . .

# Publish the application for production.
# This command compiles the application and publishes it to the 'out' directory.
# --no-restore ensures that restore is not run again (it was done in a previous layer).
# --no-build ensures that build is not run again (it was done implicitly by publish).
RUN dotnet publish backend.csproj -c Release -o /app/publish --no-restore

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
# Set the ASP.NET Core environment to Production. Set To Development If You Want Scalar.
ENV ASPNETCORE_ENVIRONMENT=Production

# Define the entry point for the container.
# This command runs your ASP.NET Core application.
ENTRYPOINT ["dotnet", "backend.dll"]
