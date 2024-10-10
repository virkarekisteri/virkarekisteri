-- PALVELUKESKUS TASO
INSERT INTO 
    OrganizationTree (
        Number, 
        Name, 
        ParentNumber, 
        Alue
    )
VALUES 
    (
        '10', 
        'KONSERNIPALVELUT', 
        NULL, 
        'PALVELUKESKUS'
    ),
    (
        '80', 
        'RAHOITUS', 
        NULL, 
        'PALVELUKESKUS'
    ),
    (
        '40', 
        'SIVISTYKSEN JA HYVINVOINNIN TOIMIALA', 
        NULL, 
        'PALVELUKESKUS'
    ),
    (
        '60', 
        'KAUPUNKIYMPÄRISTÖN TOIMIALA', 
        NULL, 
        'PALVELUKESKUS'
    ),
    (
        '80', 
        'RAHOITUS', 
        NULL, 
        'PALVELUKESKUS'
    );
