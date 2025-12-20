FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY AureliaE-Commerce.sln ./
COPY  AureliaE-Commerce/AureliaE-Commerce.csproj ./AureliaE-Commerce/
RUN dotnet restore AureliaE-Commerce.sln 
COPY . . 
WORKDIR /src/AureliaE-Commerce

RUN dotnet publish -c Release -o /app/publish


FROM mcr.microsoft.com/dotnet/sdk:9.0 AS runtime
RUN apt-get update && \
    apt-get install -y libssl-dev ca-certificates && \
    update-ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENV DOTNET_SYSTEM_NET_SECURITY_ALLOWLEGACYTLS=false
ENTRYPOINT ["dotnet", "AureliaE-Commerce.dll"]


