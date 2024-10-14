-- KUSTANNUSPAIKKA TASO
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
