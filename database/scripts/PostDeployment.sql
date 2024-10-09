-- This file contains SQL statements that will be executed after the build script.
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


INSERT INTO 
    OrganizationTree (
        Number, 
        Name, 
        ParentId, 
        Alue
    )
VALUES 
    -- PALVELUKESKUS TASO
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
    ),
    
    
    -- TULOSALUE TASO
    (
        '100', 
        'VAALIT', 
        ParentId, -- ??? TODO: Tarkista
        'TULOSALUE'
    ),
    (
        '120', 
        'TARKASTUSTOIMI', 
        '8D5E957F-5E76-489A-8E78-2B5148A08BFC', -- Tän hetken ID
        'TULOSALUE'
    ),
    (
        '130', 
        'YLEISHALLINTO', 
        '', 
        'TULOSALUE'
    ),
    (
        '140', 
        'HALLINTOPALVELUT', 
        '', 
        'TULOSALUE'
    ),
    (
        '150', 
        'HENKILÖSTÖPALVELUT', 
        '', 
        'TULOSALUE'
    ),
    (
        '160', 
        'TALOUSPALVELUT', 
        '', 
        'TULOSALUE'
    ),
    (
        '890',
        'RAHOITUS',
        '',
        'TULOSALUE'
    )
    ;
