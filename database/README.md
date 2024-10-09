# Virkarekisteri-database

## Technologies

Azure SQL Database

### Prerequisites

- Azure Functions Core Tools
- Docker (for local database emulation)
- Azure Data Studio (for local database emulation/database overall)  
  <sup><sub>(VSCode works also, but not as well)</sub></sup>

### Running

Publishing the database locally is extremely complex,
so I didn't take the time to write a premade script for it. (At least yet)

Azure Data Studio (or VSCode if you really don't want to install Azure Data Studio)
has lengthy premade functionality for the job, so let's use it:

1. Install the "SQL Database Projects" extension in Azure Data Studio (or VSCode)
2. Open the "Database Projects" view from the sidebar
3. Click "Open Existing" and open the `database/virkaluettelo-database.sqlproj` file locally
4. Ensure Docker is running
5. In the "Database Projects" view, right-click the project "virkaluettelo-database" and select "Publish"
6. Choose to publish to a local development container
7. Enter the required settings
    - Keep port as 1433
    - Set the password to `MyLocalSqlP@ssw0rd`  
      <sup><sub>(or come up with your own and make it match the one found in `backend/local.settings.json`'s
      `SqlConnectionString`)</sub></sup>
    - Keep image tag as latest
    - Accept the EULA
    - Don't load a profile
    - Click "Publish"
8. Should be all done, wait for Docker to pull the required image and for the database to be deployed

For future reference, you can stop and start the database via Docker.  
To update the database with a new schema or table or whatever,
you can re-publish to the existing running database instance.
Or you can delete the current instance from Docker and create a new one.

To see the actual database while it's running, enter the "Connections" view from the sidebar

### Formatting

The SQL code is formatted by Prettier.

You can `npm i` in the `database/` directory to set up
the node environment for using Prettier.

And again, you of course want to make your IDE run prettier for you,
but you can also manually run it via CLI in the `database/` directory:

```sh
npx prettier --write .
```
