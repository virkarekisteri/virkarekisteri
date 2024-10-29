# Virkarekisteri-backend

## Technologies

.NET 8 C# Azure Functions, Entity Framework, XUnit

## Folder/Project Structure

- `Virkarekisteri/` - The main Azure Functions App project
- `Virkarekisteri.Tests/` - The XUnit test project

## Development

### Prerequisites

- .NET SDK 8
- Azure Functions Core Tools
- Docker (for local database emulation)
- Azure Data Studio (for local database emulation/database overall)  
  <sup><sub>(VSCode works also, but not as well)</sub></sup>
- Within the `Virkarekisteri` folder, copy `default.local.settings.json` to a new file `local.settings.json`

### Running

Realistically, you want to run with your IDEs built in functionality, but CLI works as well:

```sh
func start
```

### Testing

Again, you realistically, of course, want to use your IDE's test runner, but CLI works as well:

```sh
dotnet test
```

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
