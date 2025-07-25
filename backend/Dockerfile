FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY backend.csproj ./
RUN dotnet restore

COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS="https://+:7026"
ENV ASPNETCORE_Kestrel__Certificates__Default__Path="/https/localhost.crt"
ENV ASPNETCORE_Kestrel__Certificates__Default__KeyPath="/https/localhost.key"

EXPOSE 7026
ENTRYPOINT ["dotnet", "EmployeeManagement.API.dll"]