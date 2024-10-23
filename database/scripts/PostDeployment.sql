-- This file references to SQL statements that will be executed after the build script.

-- Insert data to Position table
PRINT 'INSERTING DATA TO Positions TABLE';
:r .\Inserts\Positions.sql

-- Insert data to OrganizationTree table
PRINT 'INSERTING DATA TO OrganizationTree TABLE';
:r .\Inserts\OrgTreePalvelukeskus.sql
:r .\Inserts\OrgTreeTulosalue.sql
:r .\Inserts\OrgTreeVastuualue.sql
:r .\Inserts\OrgTreeTulosyksikko.sql
:r .\Inserts\OrgTreeKustannuspaikka.sql