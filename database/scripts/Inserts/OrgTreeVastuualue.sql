-- VASTUUALUE TASO
INSERT INTO
    OrganizationTree (Number, Name, ParentNumber, Alue)
VALUES
    ('1000', 'VAALIT', '100', 'VASTUUALUE'),
    ('1200', 'TARKASTUSTOIMI', '120', 'VASTUUALUE'),
    ('1300', 'YLEISHALLINTO', '130', 'VASTUUALUE'),
    ('1400', 'HALLINTOPALVELU', '140', 'VASTUUALUE'),
    ('1500', 'HENKILÖSTÖPALVELUT', '150', 'VASTUUALUE'),
    ('1600', 'TALOUSPALVELUT', '160', 'VASTUUALUE'),
    ('8900', 'RAHOITUS', '890', 'VASTUUALUE'),
    (
        '4000',
        'SIVISTYKSEN JA HYVINVOINNIN TOIMIALAN HALLINTO',
        '400',
        'VASTUUALUE'
    ),
    ('4100', 'PERUSOPETUS', '410', 'VASTUUALUE'),
    ('4200', 'ERITYISPALVELUT', '420', 'VASTUUALUE'),
    ('4800', 'LUKIOKOULUTUS', '480', 'VASTUUALUE'),
    ('4900', 'KANSALAISOPISTO', '490', 'VASTUUALUE'),
    ('5100', 'KIRJASTOPALVELUT', '510', 'VASTUUALUE'),
    ('5300', 'KULTTUURIPALVELUT', '530', 'VASTUUALUE'),
    ('5500', 'MUSEOPALVELUT', '550', 'VASTUUALUE'),
    ('5700', 'LIIKUNTAPALVELUT', '570', 'VASTUUALUE'),
    ('5900', 'NUORISOPALVELUT', '590', 'VASTUUALUE'),
    (
        '4300',
        'VARHAISKASVATUKSEN HALLINTO',
        '430',
        'VASTUUALUE'
    ),
    ('4400', 'PÄIVÄKODIT', '430', 'VASTUUALUE'),
    ('4500', 'RYHMIKSET', '430', 'VASTUUALUE'),
    ('4600', 'VAKAKESKUKSET', '430', 'VASTUUALUE'),
    ('4700', 'PERHEPÄIVÄHOITO', '430', 'VASTUUALUE'),
    ('4710', 'MUU PÄIVÄHOITO', '430', 'VASTUUALUE'),
    (
        '4720',
        'AVOIN LEIKKITOIMINTA',
        '430',
        'VASTUUALUE'
    ),
    (
        '4770',
        'VARHAISERITYISKASVATUS',
        '430',
        'VASTUUALUE'
    ),
    ('6000', 'HALLINTO', '600', 'VASTUUALUE'),
    ('6100', 'TOIMITILAT', '610', 'VASTUUALUE'),
    (
        '6200',
        'KIINTEISTÖ- JA PAIKKATIETOPALVELUT',
        '620',
        'VASTUUALUE'
    ),
    (
        '6300',
        'YHDYSKUNTATEKNIIKKA',
        '630',
        'VASTUUALUE'
    ),
    (
        '6500',
        'KAUPUNKISUUNNITTELU JA KAAVOITUS',
        '650',
        'VASTUUALUE'
    ),
    ('6600', 'RAKENNUSVALVONTA', '660', 'VASTUUALUE'),
    ('6700', 'YMPÄRISTÖNSUOJELU', '670', 'VASTUUALUE'),
    (
        '6900',
        'YMPÄRISTÖTERVEYDENHUOLTO',
        '690',
        'VASTUUALUE'
    ),
    ('700', 'ELINVOIMA', '700', 'VASTUUALUE'),
    ('710', 'TYÖLLISYYS', '710', 'VASTUUALUE');
