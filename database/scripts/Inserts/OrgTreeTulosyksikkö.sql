-- TULOSYKSIKKÖ TASO
INSERT INTO
    OrganizationTree (Number, Name, ParentNumber, Alue)
VALUES
    ('1000', 'VAALIT', '1000', 'TULOSYKSIKKÖ'),
    ('1200', 'TARKASTUSTOIMI', '1000', 'TULOSYKSIKKÖ'),
    ('1300', 'YLEISHALLINTO', '1300', 'TULOSYKSIKKÖ'),
    (
        '1410',
        'PÄÄTÖSVALMISTELU',
        '1400',
        'TULOSYKSIKKÖ'
    ),
    (
        '1500',
        'HENKILÖSTÖPALVELUT',
        '1500',
        'TULOSYKSIKKÖ'
    ),
    ('1610', 'TALOUSHALLINTO', '1600', 'TULOSYKSIKKÖ'),
    ('1650', 'TIETOHALLINTO', '1600', 'TULOSYKSIKKÖ'),
    (
        '1680',
        'HANKINTA- JA VARASTOPALVELUT',
        '1600',
        'TULOSYKSIKKÖ'
    ),
    (
        '1480',
        'MAASEUTUPALVELUT',
        '1400',
        'TULOSYKSIKKÖ'
    ),
    ('8900', 'RAHOITUS', '8900', 'TULOSYKSIKKÖ'),
    (
        '4000',
        'SIVISTYKSEN JA HYVINVOINNIN TOIMIALAN HALLINTO',
        '4000',
        'TULOSYKSIKKÖ'
    ),
    ('4100', 'PERUSOPETUS', '4100', 'TULOSYKSIKKÖ'),
    ('4200', 'ERITYISOPETUS', '4200', 'TULOSYKSIKKÖ'),
    ('4250', 'APIP-TOIMINTA', '4200', 'TULOSYKSIKKÖ'),
    (
        '4300',
        'VARHAISKASVATUKSEN HALLINTO',
        '4300',
        'TULOSYKSIKKÖ'
    ),
    ('4400', 'PÄIVÄKODIT', '4400', 'TULOSYKSIKKÖ'),
    (
        '4420',
        'JOUPPI-KATAJALAAKSON ALUE',
        '4400',
        'TULOSYKSIKKÖ'
    ),
    ('4460', 'KESKUSTAN ALUE', '4400', 'TULOSYKSIKKÖ'),
    (
        '4490',
        'KASPERI-KIVISTÖN ALUE',
        '4400',
        'TULOSYKSIKKÖ'
    ),
    (
        '4540',
        'PERÄSEINÄJOEN-KÄRJEN ALUE',
        '4400',
        'TULOSYKSIKKÖ'
    ),
    ('4580', 'NURMON ALUE', '4400', 'TULOSYKSIKKÖ'),
    (
        '4640',
        'YLISTARO-NURMON ALUE',
        '4400',
        'TULOSYKSIKKÖ'
    ),
    (
        '4660',
        'YLISTARO-NURMON ALUE',
        '4500',
        'TULOSYKSIKKÖ'
    ),
    (
        '4570',
        'PERÄSEINÄJOEN-KÄRJEN ALUE',
        '4600',
        'TULOSYKSIKKÖ'
    ),
    ('4710', 'MUU PÄIVÄHOITO', '4710', 'TULOSYKSIKKÖ'),
    (
        '4770',
        'VARHAISERITYISKASVATUS',
        '4770',
        'TULOSYKSIKKÖ'
    ),
    ('4700', 'PERHEPÄIVÄHOITO', '4700', 'TULOSYKSIKKÖ'),
    (
        '4720',
        'AVOIN LEIKKITOIMINTA',
        '4720',
        'TULOSYKSIKKÖ'
    ),
    ('4800', 'LUKIOKOULUTUS', '4800', 'TULOSYKSIKKÖ'),
    ('4900', 'KANSALAISOPISTO', '4900', 'TULOSYKSIKKÖ'),
    (
        '5100',
        'KIRJASTOPALVELUT',
        '5100',
        'TULOSYKSIKKÖ'
    ),
    (
        '5300',
        'KULTTUURIPALVELUT',
        '5300',
        'TULOSYKSIKKÖ'
    ),
    ('5500', 'MUSEOPALVELUT', '5500', 'TULOSYKSIKKÖ'),
    (
        '5700',
        'LIIKUNTAPALVELUT',
        '5700',
        'TULOSYKSIKKÖ'
    ),
    ('5900', 'NUORISOPALVELUT', '5900', 'TULOSYKSIKKÖ'),
    (
        '6000',
        'KAUPUNKIYMPÄRISTÖLAUTAKUNTA',
        '6000',
        'TULOSYKSIKKÖ'
    ),
    (
        '6010',
        'KAUPUNKIYMPÄRISTÖ',
        '6000',
        'TULOSYKSIKKÖ'
    ),
    (
        '6020',
        'LUPA-ASIAINLAUTAKUNTA',
        '6000',
        'TULOSYKSIKKÖ'
    ),
    ('6100', 'TOIMITILAT', '6100', 'TULOSYKSIKKÖ'),
    (
        '6110',
        'YLLÄPITOPALVELUT',
        '6100',
        'TULOSYKSIKKÖ'
    ),
    (
        '6120',
        'RUOKA- JA SIIVOUSPALVELUT',
        '6100',
        'TULOSYKSIKKÖ'
    ),
    (
        '6200',
        'KIIINTEISTÖ- JA PAIKKATIETOPALVELUT',
        '6200',
        'TULOSYKSIKKÖ'
    ),
    ('6310', 'SUUNNITTELU', '6300', 'TULOSYKSIKKÖ'),
    ('6320', 'RAKENTAMINEN', '6300', 'TULOSYKSIKKÖ'),
    (
        '6340',
        'LASKUTETTAVAT TYÖT',
        '6300',
        'TULOSYKSIKKÖ'
    ),
    ('6360', 'JÄTEHUOLTO', '6300', 'TULOSYKSIKKÖ'),
    ('6380', 'LIIKENNEVÄYLÄT', '6300', 'TULOSYKSIKKÖ'),
    ('6390', 'KUNNOSSAPITO', '6300', 'TULOSYKSIKKÖ'),
    (
        '6420',
        'VARIKKOTOIMINNOT',
        '6300',
        'TULOSYKSIKKÖ'
    ),
    ('6440', 'KULJETUSKESKUS', '6300', 'TULOSYKSIKKÖ'),
    ('6460', 'PUISTOTOIMI', '6300', 'TULOSYKSIKKÖ'),
    (
        '6500',
        'KAUPUNKISUUNNITTELU JA KAAVOITUS',
        '6500',
        'TULOSYKSIKKÖ'
    ),
    (
        '6600',
        'RAKENNUSVALVONTA',
        '6600',
        'TULOSYKSIKKÖ'
    ),
    (
        '6700',
        'YMPÄRISTÖNSUOJELU',
        '6700',
        'TULOSYKSIKKÖ'
    ),
    (
        '6900',
        'YMPÄRISTÖTERVEYDENHUOLTO',
        '6900',
        'TULOSYKSIKKÖ'
    ),
    ('7100', 'STRATEGIATYÖ', '700', 'TULOSYKSIKKÖ'),
    (
        '7150',
        'ALUEKEHITYS JA KORKEAKOULUYHTEISTYÖ',
        '700',
        'TULOSYKSIKKÖ'
    ),
    ('7160', 'HANKEKEHITYS', '700', 'TULOSYKSIKKÖ'),
    ('7200', 'MARKKINOINTI', '700', 'TULOSYKSIKKÖ'),
    ('7250', 'VIESTINTÄ', '700', 'TULOSYKSIKKÖ'),
    (
        '7300',
        'KANSAINVÄLISET ASIAT',
        '700',
        'TULOSYKSIKKÖ'
    ),
    ('7350', 'PAKOLAISTYÖ', '700', 'TULOSYKSIKKÖ'),
    (
        '7400',
        'HYVINVOINTI JA OSALLISUUS',
        '700',
        'TULOSYKSIKKÖ'
    ),
    ('7450', 'TOIMINTOJEN TALO', '700', 'TULOSYKSIKKÖ'),
    ('7600', 'TAPAHTUMAT', '700', 'TULOSYKSIKKÖ'),
    (
        '7110',
        'TYÖLLISYYSPALVELUT',
        '710',
        'TULOSYKSIKKÖ'
    );
