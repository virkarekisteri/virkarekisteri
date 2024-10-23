INSERT INTO
    Positions (
        LuontiPvm,
        PaattymisPvm,
        VakanssiKoko,
        VakanssinTaytto,
        Hinnoittelutunnus,
        LuontiPaatosNumero,
        LopetusPaatosNumero,
        Laji,
        PositionNameId
    )
VALUES
    VALUES
    (
        '2023-01-15',
        '2024-01-15',
        0.95,
        0.85,
        '4 50 01 04',
        'Paatos-001',
        'Lopetus-001',
        1,
        (SELECT Id FROM [dbo].[PositionNames] WHERE [Name] = 'Perusopetuksen rehtori')
    ),
    (
        '2022-05-12',
        NULL,
        0.75,
        0.50,
        '4 50 01 69',
        'Paatos-002',
        NULL,
        2,
        (SELECT Id FROM [dbo].[PositionNames] WHERE [Name] = 'Lukion rehtori')
    ),
    (
        '2021-09-10',
        '2023-09-10',
        0.60,
        0.60,
        NULL,
        'Paatos-003',
        'Lopetus-003',
        1,
        (SELECT Id FROM [dbo].[PositionNames] WHERE [Name] = 'Erityisopetuksen rehtori')
    );

GO
