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
        Sijoituspaikka,
        PositionNameId,
        OrgTreeId,
        OnOpettaja
    )
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
        'Hervanta',
        (
            SELECT
                Id
            FROM
                [dbo].[PositionNames]
            WHERE
                [Name] = 'Perusopetuksen rehtori'
        ),
        (
            SELECT
                Id
            FROM
                [dbo].[OrganizationTree]
            WHERE
                [Number] = '1000'
                AND [Alue] = 'KUSTANNUSPAIKKA'
        ),
        0
    ),
    (
        '2022-05-12',
        NULL,
        0.0,
        0.0,
        '4 50 01 69',
        'Paatos-002',
        NULL,
        2,
        'Seinäjoki',
        (
            SELECT
                Id
            FROM
                [dbo].[PositionNames]
            WHERE
                [Name] = 'Lukion rehtori'
        ),
        (
            SELECT
                Id
            FROM
                [dbo].[OrganizationTree]
            WHERE
                [Number] = '1412'
                AND [Alue] = 'KUSTANNUSPAIKKA'
        ),
        1
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
        NULL,
        (
            SELECT
                Id
            FROM
                [dbo].[PositionNames]
            WHERE
                [Name] = 'Erityisopetuksen rehtori'
        ),
        (
            SELECT
                Id
            FROM
                [dbo].[OrganizationTree]
            WHERE
                [Number] = '4124'
                AND [Alue] = 'KUSTANNUSPAIKKA'
        ),
        0
    );

GO
