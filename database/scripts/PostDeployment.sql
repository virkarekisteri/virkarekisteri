-- This file references to SQL statements that will be executed after the build script.
-- POPULATE POSITION TABLE
INSERT INTO
    Positions (
        LuontiPvm,
        PaattymisPvm,
        VakanssiKoko,
        VakanssinTaytto,
        LuontiPaatosNumero,
        LopetusPaatosNumero,
        Laji
    )
VALUES
    (
        '2023-01-15',
        '2024-01-15',
        0.95,
        0.85,
        'Paatos-001',
        'Lopetus-001',
        1
    ),
    (
        '2022-05-12',
        NULL,
        0.75,
        0.50,
        'Paatos-002',
        NULL,
        2
    ),
    (
        '2021-09-10',
        '2023-09-10',
        0.60,
        0.60,
        'Paatos-003',
        'Lopetus-003',
        1
    );

-- POPULATE PALVELUKESKUS LEVEL
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
        'ELINVOIMAN JA TYÖLLISYYDEN TOIMIALA',
        NULL,
        'PALVELUKESKUS'
    );

-- POPULATE TULOSALUE LEVEL
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

-- POPULATE VASTUUALUE LEVEL
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

-- POPULATE TULOSYKSIKKÖ LEVEL
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

-- POPULATE KUSTANNUSPAIKKA LEVEL
INSERT INTO
    OrganizationTree (Number, Name, ParentNumber, Alue)
VALUES
    ('1010', 'VAALIT', '1000', 'KUSTANNUSPAIKKA'),
    (
        '1201',
        'TARKASTUSTOIMI',
        '1200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1301',
        'KAUPUNGINVALTUUSTO',
        '1300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1302',
        'KAUPUNGINHALLITUS',
        '1300',
        'KUSTANNUSPAIKKA'
    ),
    ('1303', 'TOIMIKUNNAT', '1300', 'KUSTANNUSPAIKKA'),
    (
        '1304',
        'MUU YLEISHALLINTO',
        '1300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1305',
        'YHTEISHANKKEET',
        '1300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1308',
        'TÖRNÄVÄN KARTANO',
        '1300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1309',
        'VIERAANVARAISUUS',
        '1300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1310',
        'SOTEN PASSIVOINTI',
        '1300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1411',
        'PÄÄTÖSVALMISTELU',
        '1410',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1412',
        'PUHELINPALVELUT',
        '1410',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1413',
        'MONISTUSPALVELUT',
        '1410',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1481',
        'MAASEUTUTOIMI',
        '1480',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1501',
        'HENKILÖSTÖHALLINTO',
        '1500',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1502',
        'TYÖHYVINVOINTIPALVELUT',
        '1500',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1611',
        'TALOUSHALLINTO',
        '1610',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1651',
        'TIETOHALLINTO',
        '1650',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1681',
        'HANKINTAPALVELUT',
        '1680',
        'KUSTANNUSPAIKKA'
    ),
    (
        '1682',
        'VARASTOPALVELUT',
        '1680',
        'KUSTANNUSPAIKKA'
    ),
    ('1000', 'TASETILIT', '8900', 'KUSTANNUSPAIKKA'),
    ('8901', 'RAHOITUS', '8900', 'KUSTANNUSPAIKKA'),
    (
        '4801',
        'SEINÄJOEN LUKIO',
        '4800',
        'KUSTANNUSPAIKKA'
    ),
    ('4802', 'NURMON LUKIO', '4800', 'KUSTANNUSPAIKKA'),
    (
        '4803',
        'YLISTARON LUKIO',
        '4800',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4804',
        'LUKIOIDEN YHTEISET MENOT',
        '4800',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4901',
        'KANSALAISOPISTO',
        '4900',
        'KUSTANNUSPAIKKA'
    ),
    (
        '5301',
        'KULTTUURIPALVELUIDEN HALLINTO',
        '5300',
        'KUSTANNUSPAIKKA'
    ),
    ('5302', 'TAIDEHALLI', '5300', 'KUSTANNUSPAIKKA'),
    (
        '5304',
        'TÖRNÄVÄNSAARI',
        '5300',
        'KUSTANNUSPAIKKA'
    ),
    ('5305', 'LOUHIMO', '5300', 'KUSTANNUSPAIKKA'),
    ('5306', 'AVUSTUKSET', '5300', 'KUSTANNUSPAIKKA'),
    ('5307', 'YHTEISÖ', '5300', 'KUSTANNUSPAIKKA'),
    (
        '5501',
        'HALLINTO JA TUKIPALVELU',
        '5500',
        'KUSTANNUSPAIKKA'
    ),
    (
        '5502',
        'MUSEOKAUPPA JA KAHVIO',
        '5500',
        'KUSTANNUSPAIKKA'
    ),
    ('5503', 'YLEISÖTYÖ', '5500', 'KUSTANNUSPAIKKA'),
    ('5504', 'KOKOELMAT', '5500', 'KUSTANNUSPAIKKA'),
    (
        '5505',
        'MAAKUNNALLINEN TOIMINTA',
        '5500',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4001',
        'HALLINTO, SIVISTYS JA HYVINVOINTI',
        '4000',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4002',
        'KOULUTOIMEN HANKKEET',
        '4000',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4721',
        'LEIKKIKENTTÄTOIMINTA',
        '4720',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4723',
        'RAVISKA, AVOIN LEIKKITOIMINTA',
        '4720',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4771',
        'VARHAISERITYISKASVATUS',
        '4770',
        'KUSTANNUSPAIKKA'
    ),
    ('5101', 'PÄÄKIRJASTO', '5100', 'KUSTANNUSPAIKKA'),
    (
        '5102',
        'KIRJASTOAUTOPALVELUT',
        '5100',
        'KUSTANNUSPAIKKA'
    ),
    ('5103', 'LÄHIPALVELUT', '5100', 'KUSTANNUSPAIKKA'),
    (
        '5104',
        'YHTEISET PALVELUT',
        '5100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '5109',
        'KIRJASTON PROJEKTIT',
        '5100',
        'KUSTANNUSPAIKKA'
    ),
    ('5110', 'EEPOS', '5100', 'KUSTANNUSPAIKKA'),
    (
        '5111',
        'VALTAKUNNALLINEN ERITYISTEHTÄVÄ',
        '5100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4101',
        'ALAKYLÄN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    ('4102', 'JOUPIN KOULU', '4100', 'KUSTANNUSPAIKKA'),
    (
        '4103',
        'KIVISTÖN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4104',
        'MARTTILAN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4105',
        'NIEMISTÖN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    ('4106', 'POHJAN KOULU', '4100', 'KUSTANNUSPAIKKA'),
    (
        '4107',
        'TOUKOLANPUISTON KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4108',
        'LINTUVIIDAN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4109',
        'TÖRNÄVÄN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    ('4110', 'KÄRJEN KOULU', '4100', 'KUSTANNUSPAIKKA'),
    (
        '4111',
        'PAJULUOMAN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4112',
        'ALAVIITALAN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4116',
        'HYLLYKALLION KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4117',
        'VALKIAVUOREN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4118',
        'KESKI-NURMON KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    ('4119', 'KOURAN KOULU', '4100', 'KUSTANNUSPAIKKA'),
    (
        '4120',
        'TANELINRANNAN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    ('4121', 'ASEMAN KOULU', '4100', 'KUSTANNUSPAIKKA'),
    (
        '4122',
        'HALKOSAAREN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4124',
        'KIRJA-MATIN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4126',
        'TOPPARLAN KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4127',
        'TOIVOLANRANNAN YHTENÄISKOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4128',
        'SEINÄJOEN LYSEO',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4129',
        'SEINÄJOEN YHTEISKOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4130',
        'NURMON YLÄASTE',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4131',
        'YLISTARON YLÄKOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4132',
        'PERUSKOULUJEN YHTEISET MENOT',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4133',
        'PRUUKIN YHTENÄISKOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4134',
        'KERTUNLAAKSON KOULU',
        '4100',
        'KUSTANNUSPAIKKA'
    ),
    (
        '5901',
        'NUORISOPALVELUIDEN HALLINTO',
        '5900',
        'KUSTANNUSPAIKKA'
    ),
    (
        '5902',
        'NUORISOTILAT JA -TOIMINTA',
        '5900',
        'KUSTANNUSPAIKKA'
    ),
    (
        '5904',
        'LEIRIKESKUKSET',
        '5900',
        'KUSTANNUSPAIKKA'
    ),
    (
        '5905',
        'ETSIVÄ NUORISOTYÖ',
        '5900',
        'KUSTANNUSPAIKKA'
    ),
    (
        '5906',
        'NUORISOPALVELUIDEN HANKKEET',
        '5900',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4201',
        'RUUTIPUISTON KOULU',
        '4200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4202',
        'NIITTYVILLAN KOULU',
        '4200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4203',
        'OSA-AIKAINEN ERITYISOPETUS',
        '4200',
        'KUSTANNUSPAIKKA'
    ),
    ('4208', 'S-LUOKAT', '4200', 'KUSTANNUSPAIKKA'),
    (
        '4210',
        'KOULUVALMENTAJAT',
        '4200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4206',
        'KOULULAISTEN AAMU- JA ILTAPÄIVÄTOIMINTA',
        '4250',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4301',
        'VARHAISKASVATUKSEN HALLINTO',
        '4300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4302',
        'VARHAISKASVATUKSEN HANKKEET',
        '4300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4622',
        'KOURAN RYHMÄPERHEPÄIVÄKOTI',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4624',
        'NALLELAN RYHMÄPERHEPÄIVÄKOTI',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4661',
        'HANHIKOSKEN RYHMÄPERHEPÄIVÄKOTI',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4701',
        'PERHEPÄIVÄHOITO',
        '4700',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4711',
        'LASTEN KOTIHOIDONTUKI',
        '4710',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4712',
        'LASTEN YKSITYISEN HOIDON TUKI',
        '4710',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4713',
        'MUUT PÄIVÄHOITOPALVELUT',
        '4710',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4714',
        'PALVELUSETELIT/PÄIVÄHOITO',
        '4710',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4716',
        'LAPSIPERHEIDEN KOTIPALVELUT',
        '4710',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4423',
        'JOUPIN PÄIVÄKOTI',
        '4420',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4424',
        'KATAJALAAKSON PÄIVÄKOTI',
        '4420',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4425',
        'KULTAVUOREN PÄIVÄKOTI',
        '4420',
        'KUSTANNUSPAIKKA'
    ),
    ('4426', 'TENAVAKOTI', '4420', 'KUSTANNUSPAIKKA'),
    (
        '4427',
        'KAPERNAUMIN PÄIVÄKOTI',
        '4420',
        'KUSTANNUSPAIKKA'
    ),
    ('4428', 'SIJAISPOOLI', '4420', 'KUSTANNUSPAIKKA'),
    (
        '4462',
        'MARTTILAN PÄIVÄKOTI',
        '4460',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4463',
        'TIKKUVUOREN PÄIVÄKOTI',
        '4460',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4464',
        'TAIDE- JA KULTTUURIPVKOTI SAIMA',
        '4460',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4466',
        'NIEMISTÖN PÄIVÄKOTI',
        '4460',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4493',
        'PAPPILANTIEN PÄIVÄKOTI',
        '4490',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4494',
        'LINNUNRADAN PÄIVÄKOTI',
        '4490',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4496',
        'PAJULUOMAN PÄIVÄKOTI',
        '4490',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4544',
        'ONNIMANNIN PÄIVÄKOTI',
        '4540',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4545',
        'SIMUNAN PÄIVÄKOTI',
        '4540',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4546',
        'PEUKALOPOTIN PÄIVÄKOTI',
        '4540',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4573',
        'TÄHTI PÄIVÄKOTI',
        '4540',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4572',
        'HONKAKYLÄN PÄIVÄKOTI',
        '4540',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4422',
        'HYLLYKALLION PÄIVÄKOTI',
        '4580',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4583',
        'TANELINRANNAN PÄIVÄKOTI',
        '4580',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4585',
        'VÄINÖLÄN PÄIVÄKOTI',
        '4580',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4586',
        'TAIKA PÄIVÄKOTI',
        '4580',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4587',
        'OTSONTÄHTI PÄIVÄKOTI',
        '4580',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4581',
        'KERTUNLAAKSON PÄIVÄKOTI',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4641',
        'KESKI-NURMON PÄIVÄKOTI',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4642',
        'KESKUSPUISTON PÄIVÄKOTI',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4644',
        'PIKKUMETSÄN PÄIVÄKOTI',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4646',
        'REKITIEN PÄIVÄKOTI',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4647',
        'SATULINNAN PÄIVÄKOTI',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '4651',
        'PIKKUMETSÄN ESKARIVISKARIT',
        '4640',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6001',
        'KAUPUNKIYMPÄRISTÖLAUTAKUNTA',
        '6000',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6011',
        'HALLINTO, KAUPUNKIYMPÄRISTÖ',
        '6010',
        'KUSTANNUSPAIKKA'
    ),
    ('6012', 'ASUNTOTOIMI', '6010', 'KUSTANNUSPAIKKA'),
    (
        '6013',
        'PYSÄKÖINNINVALVONTA',
        '6010',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6015',
        'LÖYTÖELÄINPALVELU',
        '6010',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6021',
        'LUPA-ASIAINLAUTAKUNTA',
        '6020',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6601',
        'RAKENNUSVALVONTA',
        '6600',
        'KUSTANNUSPAIKKA'
    ),
    ('6101', 'SUUNNITTELU', '6100', 'KUSTANNUSPAIKKA'),
    (
        '6102',
        'RAKENNUTTAMINEN',
        '6100',
        'KUSTANNUSPAIKKA'
    ),
    ('6103', 'ISÄNNÖINTI', '6100', 'KUSTANNUSPAIKKA'),
    (
        '6111',
        'YLLÄPITOPALVELUT',
        '6110',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6112',
        'TEKNINEN VALVONTA',
        '6110',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6113',
        'KIINTEISTÖNHOITO',
        '6110',
        'KUSTANNUSPAIKKA'
    ),
    ('6114', 'KUNNOSSAPITO', '6110', 'KUSTANNUSPAIKKA'),
    (
        '6121',
        'SIIVOUSPALVELUT',
        '6120',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6122',
        'RUOKAPALVELUT',
        '6120',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6123',
        'HALLINTO RUOKA-SIIVOUS',
        '6120',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6201',
        'KIINTEISTÖHALLINTO',
        '6200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6202',
        'MAA- JA METSÄTILAT',
        '6200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6203',
        'TONTTIEN MYYNTI JA VUOKRAUS',
        '6200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6204',
        'MITTAUSPALVELUT',
        '6200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6205',
        'KIINTEISTÖINSINÖÖRIN PALVELUT',
        '6200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6206',
        'PAIKKATIETOPALVELUT',
        '6200',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6701',
        'YMPÄRISTÖNSUOJELU',
        '6700',
        'KUSTANNUSPAIKKA'
    ),
    ('6311', 'SUUNNITTELU', '6310', 'KUSTANNUSPAIKKA'),
    ('6321', 'RAKENTAMINEN', '6320', 'KUSTANNUSPAIKKA'),
    (
        '6341',
        'LASKUTETTAVAT TYÖT, KUNNALISTEKNIIKKA',
        '6340',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6342',
        'LASKUTETTAVAT TYÖT, SEINÄJOEN VESI',
        '6340',
        'KUSTANNUSPAIKKA'
    ),
    ('6361', 'JÄTEHUOLTO', '6360', 'KUSTANNUSPAIKKA'),
    (
        '6362',
        'MAA-AINESTEN LÄJITYS',
        '6360',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6363',
        'LELLUNNEVAN KAATOPAIKAN JÄLKIHOITO',
        '6360',
        'KUSTANNUSPAIKKA'
    ),
    ('6381', 'KADUT', '6380', 'KUSTANNUSPAIKKA'),
    (
        '6382',
        'YKSITYISTEN TEIDEN HOITO',
        '6380',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6901',
        'YLEINEN TERVEYSVALVONTA',
        '6900',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6902',
        'ELÄINLÄÄKINTÄHUOLTO',
        '6900',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6903',
        'YMPÄRISTÖPALVELUJEN HALLINTO',
        '6900',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6391',
        'KUNNOSSAPIDON HALLINTO',
        '6390',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6392',
        'HULEVESIVERKOSTO',
        '6390',
        'KUSTANNUSPAIKKA'
    ),
    ('6393', 'PUHTAANAPITO', '6390', 'KUSTANNUSPAIKKA'),
    ('6394', 'KUNNOSTUS', '6390', 'KUSTANNUSPAIKKA'),
    (
        '6395',
        'ULKOVALAISTUS',
        '6390',
        'KUSTANNUSPAIKKA'
    ),
    ('6396', 'MUU TOIMINTA', '6390', 'KUSTANNUSPAIKKA'),
    (
        '6397',
        'LASKUTETTAVAT TYÖT, KUNNOSSAPITO',
        '6390',
        'KUSTANNUSPAIKKA'
    ),
    ('6421', 'KONEKESKUS', '6420', 'KUSTANNUSPAIKKA'),
    ('6422', 'PIENKALUSTO', '6420', 'KUSTANNUSPAIKKA'),
    ('6423', 'KORJAUSPAJA', '6420', 'KUSTANNUSPAIKKA'),
    (
        '6424',
        'HUOLTOKORJAAMO',
        '6420',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6441',
        'KULJEUTSKESKUS',
        '6440',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6442',
        'PALVELULIIKENNE',
        '6440',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6443',
        'PAIKALLISLIIKENNE',
        '6440',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6461',
        'PUISTOTOIMEN HALLINTO',
        '6460',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6462',
        'PUISTOJEN KUNNOSSA- JA PUHTAANAPITO',
        '6460',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6463',
        'RETKEILYALUEET JA UIMARANNAT',
        '6460',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6464',
        'LIIKENNEVÄYLIEN ISTUTUSTEN KUNNOSSAPITO',
        '6460',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6465',
        'LASKUTETTAVAT TYÖT, PUISTOTOIMI',
        '6460',
        'KUSTANNUSPAIKKA'
    ),
    (
        '6501',
        'KAUPUNKISUUNNITTELU JA KAAVOITUS',
        '6500',
        'KUSTANNUSPAIKKA'
    ),
    ('7101', 'STRATEGIATYÖ', '7100', 'KUSTANNUSPAIKKA'),
    (
        '7151',
        'ALUEKEHITYS JA KORKEAKOULUYHTEISTYÖ',
        '7150',
        'KUSTANNUSPAIKKA'
    ),
    ('7161', 'HANKEKEHITYS', '7160', 'KUSTANNUSPAIKKA'),
    ('7201', 'MARKKINOINTI', '7200', 'KUSTANNUSPAIKKA'),
    ('7251', 'VIESTINTÄ', '7250', 'KUSTANNUSPAIKKA'),
    (
        '7301',
        'KANSAINVÄLISET ASIAT',
        '7300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '7302',
        'KANSAINVÄLINEN KAUPUNKIYHTEISTYÖ',
        '7300',
        'KUSTANNUSPAIKKA'
    ),
    (
        '7303',
        'MAAHANMUUTTOPALVELUT',
        '7300',
        'KUSTANNUSPAIKKA'
    ),
    ('7304', 'PAKOLAISTYÖ', '7350', 'KUSTANNUSPAIKKA'),
    (
        '7401',
        'HYVINVOINNIN JA TERVEYDEN EDISTÄMINEN',
        '7400',
        'KUSTANNUSPAIKKA'
    ),
    ('7402', 'OSALLISUUS', '7400', 'KUSTANNUSPAIKKA'),
    (
        '7403',
        'TOIMINTOJEN TALO',
        '7450',
        'KUSTANNUSPAIKKA'
    ),
    ('7601', 'TAPAHTUMAT', '7600', 'KUSTANNUSPAIKKA'),
    (
        '7701',
        'TYÖLLISYYSPALVELUT',
        '7110',
        'KUSTANNUSPAIKKA'
    ),
    (
        '7702',
        'TYÖPAJATOIMINTA',
        '7110',
        'KUSTANNUSPAIKKA'
    );
