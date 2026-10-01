<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Directorio de Beneficiarios — Fundación Gamboa</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            color: #1e293b;
            line-height: 1.4;
            margin: 20px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            border-bottom: 2px solid #be123c;
        }
        .header-logo {
            width: 230px;
            vertical-align: bottom;
            padding-bottom: 20px;
        }
        .header-logo img {
            max-height: 85px;
            width: auto;
            display: block;
        }
        .header-title {
            text-align: right;
            vertical-align: bottom;
            padding-bottom: 20px;
        }
        .header-title h1 {
            font-size: 13pt;
            color: #0b2545;
            margin: 0;
            text-transform: uppercase;
        }
        .header-title p {
            font-size: 8.5pt;
            color: #475569;
            margin: 2px 0 0 0;
            font-weight: bold;
        }
        .doc-title {
            text-align: center;
            background-color: #ffe4e6;
            border: 1px solid #fecdd3;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 6px;
        }
        .doc-title h2 {
            margin: 0;
            font-size: 12pt;
            color: #9f1239;
            text-transform: uppercase;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .data-table th {
            background-color: #be123c;
            color: #ffffff;
            font-size: 8.5pt;
            text-transform: uppercase;
            padding: 6px 8px;
            text-align: left;
        }
        .data-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 8px;
            font-size: 9pt;
        }
        .footer-note {
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 8pt;
            color: #64748b;
            text-align: center;
        }
    </style>
</head>
<body>

    <table class="header-table">
        <tr>
            <td class="header-logo">
                @if(file_exists(public_path('img/logo/logo-fundacion.svg')))
                    <img src="data:image/svg+xml;base64,{{ base64_encode(file_get_contents(public_path('img/logo/logo-fundacion.svg'))) }}" alt="Logo Fundación Gamboa" />
                @else
                    <div style="font-size: 15pt; font-weight: 900; color: #be123c;">
                        FUNDACIÓN<br>GAMBOA
                    </div>
                @endif
            </td>
            <td class="header-title">
                <h1>Fundación Miguel Ángel Gamboa</h1>
                <p>Directorio General de Beneficiarios Registrados</p>
                <p>Fecha de informe: {{ date('d/m/Y H:i') }} hrs</p>
            </td>
        </tr>
    </table>

    <div class="doc-title">
        <h2>Nómina de Personas y Familias Beneficiarias</h2>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th>Nombre Beneficiario (Paciente)</th>
                <th>RUT</th>
                <th>Comuna / Dirección</th>
                <th>Parentesco / Rol</th>
                <th>Representante Autorizado a Retirar</th>
                <th>RUT Representante</th>
                <th>Teléfono Contacto</th>
            </tr>
        </thead>
        <tbody>
            @foreach($beneficiarios as $b)
            <tr>
                <td><strong>{{ $b->nombre }}</strong></td>
                <td>{{ $b->rut ?? 'N/A' }}</td>
                <td>
                    <strong>{{ $b->comuna ?? 'N/A' }}</strong>
                    @if($b->sector)
                        <span style="font-size: 8pt; color: #be123c; font-weight: bold;">({{ $b->sector }})</span>
                    @endif
                    <br>
                    <span style="font-size: 8pt; color: #475569;">{{ $b->direccion ?? 'Sin dirección' }}</span>
                </td>
                <td>{{ $b->parentesco ?? 'Paciente Directo' }}</td>
                <td style="color: #4338ca; font-weight: bold;">{{ $b->representante_nombre ?? 'El mismo beneficiario' }}</td>
                <td>{{ $b->representante_rut ?? 'N/A' }}</td>
                <td>{{ $b->telefono ?? $b->representante_telefono ?? 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer-note">
        Documento confidencial generado por el Sistema de Gestión Interno — Fundación Miguel Ángel Gamboa.
    </div>

</body>
</html>
