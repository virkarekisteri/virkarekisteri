-- PALVELUKESKUS TASO
INSERT INTO
    OrganizationTree (Number, Name, ParentNumber, Alue, ParentAlue)
VALUES
    (
        '10',
        'KONSERNIPALVELUT',
        NULL,
        'PALVELUKESKUS',
        NULL
    ),
    ('89', 'RAHOITUS', NULL, 'PALVELUKESKUS', NULL),
    (
        '40',
        'SIVISTYKSEN JA HYVINVOINNIN TOIMIALA',
        NULL,
        'PALVELUKESKUS',
        NULL
    ),
    (
        '60',
        'KAUPUNKIYMPÄRISTÖN TOIMIALA',
        NULL,
        'PALVELUKESKUS',
        NULL
    ),
    (
        '70',
        'ELINVOIMAN JA TYÖLLISYYDEN TOIMIALA',
        NULL,
        'PALVELUKESKUS',
        NULL
    );

GO
