<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Entregas y Ayudas Técnicas — Fundación Gamboa</title>
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
            margin-bottom: 0px;
        }
        .header-logo {
            width: 230px;
            vertical-align: middle;
            padding-bottom: 15px;
        }
        .header-logo img {
            max-height: 75px;
            width: auto;
            display: block;
        }
        .header-title {
            text-align: right;
            vertical-align: middle;
            padding-bottom: 15px;
        }
        .header-divider-line {
            width: 100%;
            height: 2px;
            background-color: #be123c;
            margin-top: 10px;
            margin-bottom: 20px;
            clear: both;
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
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 6px;
        }
        .doc-title h2 {
            margin: 0;
            font-size: 12pt;
            color: #9f1239;
            text-transform: uppercase;
        }
        .doc-title p {
            margin: 3px 0 0 0;
            font-size: 9pt;
            color: #be123c;
            font-weight: bold;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
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
                <p>Banco de Ayudas Técnicas & Registro de Entregas</p>
                <p>Fecha de emisión: {{ date('d/m/Y H:i') }} hrs</p>
            </td>
        </tr>
    </table>
    <div class="header-divider-line"></div>

    <div class="doc-title">
        <h2>Reporte Oficial de Ayudas Técnicas Entregadas</h2>
        <p>Período Evaluado: {{ $nombrePeriodo ?? 'General Histórico' }}</p>
    </div>

    <table class="data-table">
        <thead>
            <tr>
                <th>Código</th>
                <th>Beneficiario</th>
                <th>RUT</th>
                <th>Comuna</th>
                <th>Equipos Entregados</th>
                <th>Fecha Entrega</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @forelse($comodatos as $c)
            <tr>
                <td><strong>{{ $c->codigo }}</strong></td>
                <td>{{ $c->beneficiario->nombre }}</td>
                <td>{{ $c->beneficiario->rut ?? 'N/A' }}</td>
                <td>{{ $c->beneficiario->comuna ?? 'N/A' }}</td>
                <td>
                    @foreach($c->items as $item)
                        • {{ $item->producto->nombre }} {{ $item->unidad ? '('.$item->unidad->codigo_unidad.')' : '' }}<br>
                    @endforeach
                </td>
                <td>{{ date('d/m/Y', strtotime($c->fecha_entrega)) }}</td>
                <td style="text-align: center; font-weight: bold;">
                    {{ $c->estado === 'activo' ? 'En Uso' : ($c->estado === 'devuelto' ? 'Devuelto' : $c->estado) }}
                </td>
            </tr>
            @empty
            <tr>
                <td colSpan="7" style="text-align: center; color: #94a3b8; padding: 15px;">
                    No se registraron entregas en el período seleccionado.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer-note">
        Informe generado automáticamente por el Sistema Interno de Gestión — Fundación Miguel Ángel Gamboa.
    </div>

</body>
</html>
