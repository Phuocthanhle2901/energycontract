FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["styx2-crs-send/styx2-crs-send.csproj", "styx2-crs-send/"]
COPY ["styx2-crs-send/Nuget.config", "styx2-crs-send/"]
COPY . .

RUN dotnet restore "styx2-crs-send/styx2-crs-send.csproj" --configfile styx2-crs-send/Nuget.config -nowarn:msb3202,nu1503 --verbosity diag

WORKDIR "/src/styx2-crs-send"
RUN dotnet build "styx2-crs-send.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "styx2-crs-send.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "styx2-crs-send.dll"]