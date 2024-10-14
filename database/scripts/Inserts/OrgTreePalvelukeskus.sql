-- PALVELUKESKUS TASO
INSERT INTO
    OrganizationTree (Number, Name, ParentNumber, Alue)
VALUES
    ('10', 'KONSERNIPALVELUT', NULL, 'PALVELUKESKUS'),
    ('89', 'RAHOITUS', NULL, 'PALVELUKESKUS'),
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
        '70',
        'ELINVOIMAn JA TYÖLLISYYDEN TOIMIALA',
        NULL,
        'PALVELUKESKUS'
    );
