<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Inventario de Stock — Fundación Miguel Ángel Gamboa</title>
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
        .kpi-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .kpi-cell {
            width: 25%;
            padding: 8px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            text-align: center;
            border-radius: 6px;
        }
        .kpi-label {
            font-size: 7.5pt;
            font-weight: bold;
            color: #64748b;
            text-transform: uppercase;
        }
        .kpi-value {
            font-size: 14pt;
            font-weight: 900;
            color: #0f172a;
            margin-top: 2px;
        }
        .table-section {
            margin-bottom: 25px;
        }
        .section-heading {
            font-size: 10pt;
            font-weight: bold;
            color: #be123c;
            text-transform: uppercase;
            margin-bottom: 8px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
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

    <!-- Header -->
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
                <p>Sistema de Gestión Interno — Informe Oficial de Stock</p>
                <p>Fecha de informe: {{ date('d/m/Y H:i') }} hrs</p>
            </td>
        </tr>
    </table>

    <!-- Title -->
    <div class="doc-title">
        <h2>Reporte General de Existencias de Inventario y Ayudas Técnicas</h2>
    </div>

    <!-- Summary KPIs -->
    <table class="kpi-table">
        <tr>
            <td class="kpi-cell" style="width: 20%;">
                <div class="kpi-label">Catálogos</div>
                <div class="kpi-value">{{ $totalProductos }}</div>
            </td>
            <td class="kpi-cell" style="width: 20%;">
                <div class="kpi-label">Disponibles</div>
                <div class="kpi-value" style="color: #059669;">{{ $unidadesDisponibles }}</div>
            </td>
            <td class="kpi-cell" style="width: 20%;">
                <div class="kpi-label">En Préstamo</div>
                <div class="kpi-value" style="color: #be123c;">{{ $unidadesPrestadas }}</div>
            </td>
            <td class="kpi-cell" style="width: 20%;">
                <div class="kpi-label">En Mantención</div>
                <div class="kpi-value" style="color: #d97706;">{{ $unidadesMantencion }}</div>
            </td>
            <td class="kpi-cell" style="width: 20%;">
                <div class="kpi-label">De Baja</div>
                <div class="kpi-value" style="color: #64748b;">{{ $unidadesBaja ?? 0 }}</div>
            </td>
        </tr>
    </table>

    <!-- Detail Table -->
    <div class="table-section">
        <div class="section-heading">Detalle General de Productos e Insumos</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre del Equipo / Insumo</th>
                    <th>Categoría</th>
                    <th>Tipo Control</th>
                    <th>Disp.</th>
                    <th>Prest.</th>
                    <th>Mant.</th>
                    <th>Baja</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($productos as $prod)
                @php
                    if ($prod->tipo === 'serializado') {
                        $disp = $prod->unidades->where('estado', 'disponible')->count();
                        $prest = $prod->unidades->where('estado', 'prestado')->count();
                        $mant = $prod->unidades->where('estado', 'mantencion')->count();
                        $baja = $prod->unidades->where('estado', 'baja')->count();
                        $tot = $prod->unidades->count();
                    } else {
                        $disp = $prod->stock_generico_disponible;
                        $prest = max(0, $prod->stock_generico_total - $prod->stock_generico_disponible);
                        $mant = 0;
                        $baja = 0;
                        $tot = $prod->stock_generico_total;
                    }
                @endphp
                <tr>
                    <td><strong>{{ $prod->codigo }}</strong></td>
                    <td>{{ $prod->nombre }}</td>
                    <td>{{ $prod->categoria }}</td>
                    <td>{{ $prod->tipo === 'serializado' ? 'N° Serie' : 'Stock Genérico' }}</td>
                    <td style="text-align: center; color: #059669; font-weight: bold;">{{ $disp }}</td>
                    <td style="text-align: center; color: #be123c;">{{ $prest }}</td>
                    <td style="text-align: center; color: #d97706;">{{ $mant }}</td>
                    <td style="text-align: center; color: #64748b;">{{ $baja }}</td>
                    <td style="text-align: center; font-weight: bold;">{{ $tot }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer-note">
        Documento generado automáticamente por el Sistema Interno de Gestión de Inventario — Fundación Miguel Ángel Gamboa.
    </div>

</body>
</html>
