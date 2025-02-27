-- This file references to SQL statements that will be executed after the build script.

-- Insert data to PositionNames table
PRINT 'INSERTING DATA TO PositionNames TABLE';
:r .\Inserts\PositionNames.sql

-- Insert data to OrganizationTree table
PRINT 'INSERTING DATA TO OrganizationTree TABLE';
:r .\Inserts\OrgTreePalvelukeskus.sql
:r .\Inserts\OrgTreeTulosalue.sql
:r .\Inserts\OrgTreeVastuualue.sql
:r .\Inserts\OrgTreeTulosyksikko.sql
:r .\Inserts\OrgTreeKustannuspaikka.sql

-- Insert data to Subjects table
PRINT 'INSERTING DATA TO Subjects TABLE';
:r .\Inserts\Subjects.sql

-- Insert test data to Position table
--PRINT 'INSERTING DATA TO Positions TABLE';
--:r .\Inserts\Positions.sql