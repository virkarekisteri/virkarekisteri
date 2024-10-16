-- This file references to SQL statements that will be executed after the build script.

-- Insert data to Position table
PRINT 'INSERTING DATA TO Positions TABLE';
:r \virkarekisteri\database\scripts\Inserts\Positions.sql

-- Insert data to OrganizationTree table
PRINT 'INSERTING DATA TO OrganizationTree TABLE';
:r \virkarekisteri\database\scripts\Inserts\OrgTreePalvelukeskus.sql
:r \virkarekisteri\database\scripts\Inserts\OrgTreeTulosalue.sql
:r \virkarekisteri\database\scripts\Inserts\OrgTreeVastuualue.sql
:r \virkarekisteri\database\scripts\Inserts\OrgTreeTulosyksikko.sql
:r \virkarekisteri\database\scripts\Inserts\OrgTreeKustannuspaikka.sql
