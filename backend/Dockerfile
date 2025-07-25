# -------- Stage 1: Build ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy entire source into build context
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# -------- Stage 2: Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Install OpenSSL for cert generation
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# 📦 Copy published output
COPY --from=build /app/publish .

# 🔐 ENTRYPOINT: Generate cert + run app (migrations run via Program.cs)
ENTRYPOINT ["bash", "-c", "\
  echo '🔒 Generating self-signed HTTPS certificate...'; \
  mkdir -p /https && \
  openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /https/devcert.key \
    -out /https/devcert.crt \
    -subj '/CN=localhost'; \
  export ASPNETCORE_Kestrel__Certificates__Default__Path=/https/devcert.crt && \
  export ASPNETCORE_Kestrel__Certificates__Default__KeyPath=/https/devcert.key; \
  echo '🚀 Starting backend...'; \
  dotnet EmployeeManagement.API.dll"]
