-- TULOSALUE TASO
INSERT INTO
    OrganizationTree (Number, Name, ParentNumber, Alue)
VALUES
    ('100', 'VAALIT', '10', 'TULOSALUE'),
    ('120', 'TARKASTUSTOIMI', '10', 'TULOSALUE'),
    ('130', 'YLEISHALLINTO', '10', 'TULOSALUE'),
    ('140', 'HALLINTOPALVELUT', '10', 'TULOSALUE'),
    ('150', 'HENKILÖSTÖPALVELUT', '10', 'TULOSALUE'),
    ('160', 'TALOUSPALVELUT', '10', 'TULOSALUE'),
    ('890', 'RAHOITUS', '89', 'TULOSALUE'),
    (
        '400',
        'SIVISTYKSEN JA HYVINVOINNIN TOIMIALAN HALLINTO',
        '40',
        'TULOSALUE'
    ),
    ('410', 'PERUSOPETUS', '40', 'TULOSALUE'),
    ('420', 'ERITYISPALVELUT', '40', 'TULOSALUE'),
    ('430', 'VARHAISKASVATUS', '40', 'TULOSALUE'),
    ('480', 'LUKIOKOULUTUS', '40', 'TULOSALUE'),
    ('490', 'KANSALAISOPISTO', '40', 'TULOSALUE'),
    ('510', 'KIRJASTOPALVELUT', '40', 'TULOSALUE'),
    ('530', 'KULTTUURIPALVELUT', '40', 'TULOSALUE'),
    ('550', 'MUSEOPALVELUT', '40', 'TULOSALUE'),
    ('570', 'LIIKUNTAPALVELUT', '40', 'TULOSALUE'),
    ('590', 'NUORISOPALVELUT', '40', 'TULOSALUE'),
    (
        '600',
        'KAUPUNKIYMPÄRISTÖN TOIMIALAN HALLINTO',
        '60',
        'TULOSALUE'
    ),
    ('610', 'TOIMIALAT', '60', 'TULOSALUE'),
    (
        '620',
        'KIINTEISTÖ- JA PAIKKATIETOPALVELUT',
        '60',
        'TULOSALUE'
    ),
    ('630', 'YHDYSKUNTATEKNIIKKA', '60', 'TULOSALUE'),
    (
        '650',
        'KAUPUNKISUUNNITTELU JA KAAVOITUS',
        '60',
        'TULOSALUE'
    ),
    ('660', 'RAKENNUSVALVONTA', '60', 'TULOSALUE'),
    ('670', 'YMPÄRISTÖNSUOJELU', '60', 'TULOSALUE'),
    (
        '690',
        'YMPÄRISTÖTERVEYDENHUOLTO',
        '60',
        'TULOSALUE'
    ),
    ('700', 'ELINVOIMA', '70', 'TULOSALUE'),
    ('710', 'TYÖLLISYYS', '70', 'TULOSALUE');
