# Base SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

# Copy everything into the container
COPY . ./

# Restore dependencies
RUN dotnet restore

# Expose your HTTPS port
EXPOSE 7026

# Run using dev HTTPS profile
CMD ["dotnet", "run", "--launch-profile", "https"]
