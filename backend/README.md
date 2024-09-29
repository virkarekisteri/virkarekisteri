# Virkarekisteri-backend

## Technologies

.NET 8 Azure Functions App & Azure SQL database

## Development

### Prerequisites

- .NET SDK 8
- Azure Functions Core Tools
- Docker (for local database emulation)
- Azure Data Studio (for local database emulation/database overall)  
  <sup><sub>(VSCode also works also, but not as well)</sub></sup>
- Copy `default.local.settings.json` to a new file `local.settings.json`

### Running

#### Functions

Realistically, you want to run with your IDEs built in functionality, but CLI works as well:

```sh
func start
```

#### Database

Setting up the database emulation is extremely complex,
so I didn't take the time to write a premade script for it. (At least yet)

Quick rundown:  
Open the `database/` folder in Azure Data Studio as a project,
and from there publish the database to a local server.  
Make note of the password you choose and enter the password to your SQL connection string in `local.settings.json`.

### Formatting

Code format is enforced by CSharpier.  
Install CSharpier:

```sh
dotnet tool install csharpier
```

And you should set your IDE to automatically run CSharpier on save.

CLI usage is also available, of course:

```sh
dotnet csharpier .
```
