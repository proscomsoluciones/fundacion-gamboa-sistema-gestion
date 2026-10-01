<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Libro de Respaldo Financiero — Fundación Gamboa</title>
    <style>
        @page {
            margin: 25px 30px;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            color: #1e293b;
            line-height: 1.4;
        }
        
        /* Header styling matching corporate standards */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0px;
        }
        .header-logo {
            width: 220px;
            vertical-align: middle;
            padding-bottom: 15px;
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
            letter-spacing: 0.5px;
        }
        .header-title p {
            font-size: 8.5pt;
            color: #be123c;
            margin: 2px 0 0 0;
            font-weight: bold;
            text-transform: uppercase;
        }

        /* Document Sub-Header Banner */
        .doc-banner {
            text-align: center;
            background-color: #fff1f2;
            border: 1px solid #fecdd3;
            padding: 10px 15px;
            margin-bottom: 20px;
            border-radius: 6px;
        }
        .doc-banner h2 {
            margin: 0;
            font-size: 12pt;
            color: #9f1239;
            text-transform: uppercase;
        }
        .doc-banner p {
            margin: 3px 0 0 0;
            font-size: 8.5pt;
            color: #be123c;
            font-weight: bold;
        }

        /* Section Banner (Corporate Red/Rose Header) */
        .section-banner {
            background-color: #be123c;
            color: #ffffff;
            font-size: 10pt;
            font-weight: bold;
            padding: 8px 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-radius: 4px 4px 0 0;
            margin-top: 15px;
        }

        /* Table Styling */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .data-table th {
            background-color: #be123c;
            color: #ffffff;
            font-size: 8.5pt;
            font-weight: bold;
            text-transform: uppercase;
            padding: 7px 10px;
            text-align: left;
            border: 1px solid #be123c;
        }
        .data-table th.text-right {
            text-align: right;
        }
        .data-table td {
            padding: 7px 10px;
            border: 1px solid #cbd5e1;
            font-size: 9pt;
        }
        .data-table tr:nth-child(even) td {
            background-color: #f8fafc;
        }
        .data-table td.monto {
            font-weight: bold;
            text-align: right;
            white-space: nowrap;
        }
        .data-table td.fecha {
            white-space: nowrap;
            font-weight: bold;
            color: #1e293b;
        }

        /* Summary Totals Box */
        .totals-box {
            width: 100%;
            margin-top: 10px;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .totals-box td {
            padding: 6px 8px;
        }
        .totals-card {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            text-align: center;
            padding: 8px;
        }
        .totals-label {
            font-size: 8.5pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #475569;
            display: block;
        }
        .totals-val {
            font-size: 13pt;
            font-weight: bold;
            margin-top: 2px;
            display: block;
        }

        /* Page Break for Voucher Annex */
        .page-break {
            page-break-before: always;
        }

        /* Annex Voucher Styling */
        .annex-header {
            text-align: center;
            margin-bottom: 20px;
            background-color: #fff1f2;
            border: 1px solid #fecdd3;
            padding: 12px;
            border-radius: 6px;
        }
        .annex-title {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #9f1239;
            letter-spacing: 0.5px;
        }
        .annex-sub {
            font-size: 9pt;
            color: #be123c;
            font-weight: bold;
            margin-top: 2px;
        }

        .voucher-card {
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            margin-bottom: 20px;
            overflow: hidden;
            background-color: #ffffff;
        }
        .voucher-header {
            background-color: #f8fafc;
            border-bottom: 1px solid #cbd5e1;
            padding: 8px 12px;
            font-size: 9.5pt;
            font-weight: bold;
            color: #0f172a;
            border-left: 4px solid #be123c;
        }
        .voucher-body {
            padding: 15px;
            text-align: center;
        }
        .voucher-img {
            max-width: 88%;
            max-height: 460px;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
        }
        
        .footer-note {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            font-size: 8pt;
            color: #64748b;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 6px;
        }
    </style>
</head>
<body>

    <!-- Header matching corporate standard -->
    <table class="header-table">
        <tr>
            <td class="header-logo">
                @if(file_exists(public_path('img/logo/logo-fundacion.svg')))
                    <img src="data:image/svg+xml;base64,{{ base64_encode(file_get_contents(public_path('img/logo/logo-fundacion.svg'))) }}" alt="Logo Fundación Gamboa" style="max-height: 75px; width: auto; display: block;" />
                @else
                    <div style="font-size: 15pt; font-weight: 900; color: #be123c;">
                        FUNDACIÓN<br>GAMBOA
                    </div>
                @endif
            </td>
            <td class="header-title">
                <h1>Fundación Miguel Ángel Gamboa</h1>
                <p>Libro de Respaldo Financiero & Control Contable</p>
                <div style="font-size: 8pt; color: #475569; margin-top: 2px; font-weight: bold;">
                    Fecha de emisión: {{ date('d/m/Y H:i') }} hrs
                </div>
            </td>
        </tr>
    </table>
    <div class="header-divider-line"></div>

    <div class="doc-banner">
        @if(isset($proyectoInfo) && $proyectoInfo)
            <h2>INFORME DE RENDICIÓN DE CUENTAS DE PROYECTO</h2>
            <p>Proyecto / Fondo: <strong>{{ $proyectoInfo['nombre'] }}</strong> {{ $proyectoInfo['codigo'] ? '('.$proyectoInfo['codigo'].')' : '' }}</p>
            <div style="font-size: 8pt; color: #475569; margin-top: 3px;">Período Evaluado: {{ $nombrePeriodo }}</div>
        @else
            <h2>LIBRO DE RESPALDO DE MOVIMIENTOS FINANCIEROS</h2>
            <p>Período Evaluado: {{ $nombrePeriodo }}</p>
        @endif
    </div>

    <!-- Project Specific Rendición Summary Card (If filtering by project) -->
    @if(isset($proyectoInfo) && $proyectoInfo)
        <table class="totals-box">
            <tr>
                <td width="25%">
                    <div class="totals-card" style="border-left: 4px solid #4338ca; background-color: #f5f3ff;">
                        <span class="totals-label">Presupuesto Límite</span>
                        <span class="totals-val" style="color: #3730a3;">{{ $proyectoInfo['presupuesto_total'] > 0 ? $proyectoInfo['presupuesto_total_formatted'] : 'Sin Límite Fijo' }}</span>
                    </div>
                </td>
                <td width="25%">
                    <div class="totals-card" style="border-left: 4px solid #be123c;">
                        <span class="totals-label">Gastado Acumulado</span>
                        <span class="totals-val" style="color: #be123c;">{{ $proyectoInfo['total_egresos_historicos_formatted'] }}</span>
                    </div>
                </td>
                <td width="25%">
                    <div class="totals-card" style="border-left: 4px solid #16a34a; background-color: #f0fdf4;">
                        <span class="totals-label">Saldo Disponible</span>
                        <span class="totals-val" style="color: #15803d;">{{ $proyectoInfo['saldo_disponible_formatted'] }}</span>
                    </div>
                </td>
                <td width="25%">
                    <div class="totals-card" style="border-left: 4px solid #0f172a;">
                        <span class="totals-label">% Ejecución</span>
                        <span class="totals-val" style="color: #0f172a;">{{ $proyectoInfo['pct_ejecucion'] }}%</span>
                    </div>
                </td>
            </tr>
        </table>
    @else
        <!-- General Totals Summary Card -->
        <table class="totals-box">
            <tr>
                <td width="33%">
                    <div class="totals-card" style="border-left: 4px solid #16a34a;">
                        <span class="totals-label">Total Ingresos</span>
                        <span class="totals-val" style="color: #15803d;">${{ number_format($totalIngresos, 0, ',', '.') }}</span>
                    </div>
                </td>
                <td width="33%">
                    <div class="totals-card" style="border-left: 4px solid #be123c;">
                        <span class="totals-label">Total Egresos</span>
                        <span class="totals-val" style="color: #be123c;">${{ number_format($totalEgresos, 0, ',', '.') }}</span>
                    </div>
                </td>
                <td width="33%">
                    <div class="totals-card" style="border-left: 4px solid #0f172a;">
                        <span class="totals-label">Balance Neto Período</span>
                        <span class="totals-val" style="color: {{ $balanceNeto >= 0 ? '#0f172a' : '#be123c' }};">
                            ${{ number_format($balanceNeto, 0, ',', '.') }}
                        </span>
                    </div>
                </td>
            </tr>
        </table>
    @endif

    <!-- Section Banner -->
    <div class="section-banner">
        DETALLE DE MOVIMIENTOS IMPUTADOS AL {{ isset($proyectoInfo) && $proyectoInfo ? 'PROYECTO' : 'PERÍODO' }}
    </div>

    <!-- Data Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th width="10%">FECHA</th>
                <th width="35%">CONCEPTO / GLOSA</th>
                <th width="20%">CATEGORÍA</th>
                <th width="20%">PROYECTO / FONDO</th>
                <th width="15%" class="text-right">MONTO</th>
            </tr>
        </thead>
        <tbody>
            @forelse($movimientos as $mov)
                <tr>
                    <td class="fecha">{{ $mov->fecha ? $mov->fecha->format('d/m/Y') : '-' }}</td>
                    <td>
                        <strong>{{ $mov->concepto }}</strong>
                        @if($mov->tipo === 'ingreso')
                            <span style="color: #15803d; font-size: 8px; font-weight: bold; margin-left: 4px;">(INGRESO)</span>
                        @endif
                        @if($mov->observaciones)
                            <div style="font-size: 8pt; color: #64748b; margin-top: 2px;">{{ $mov->observaciones }}</div>
                        @endif
                    </td>
                    <td>{{ $mov->categoria }}</td>
                    <td><strong style="color: #4338ca;">{{ $mov->proyecto ?: 'Fondo General / Operación' }}</strong></td>
                    <td class="monto" style="color: {{ $mov->tipo === 'ingreso' ? '#15803d' : '#0f172a' }};">
                        {{ $mov->tipo === 'ingreso' ? '+' : '' }}${{ number_format($mov->monto, 0, ',', '.') }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center; color: #64748b; padding: 15px;">
                        No se registraron movimientos en este proyecto / período.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Firma de Rendición oficial para proyectos -->
    @if(isset($proyectoInfo) && $proyectoInfo)
        <table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
            <tr>
                <td width="45%" style="text-align: center; vertical-align: top;">
                    <div style="border-top: 1px solid #94a3b8; width: 80%; margin: 0 auto; padding-top: 5px;">
                        <strong style="font-size: 9pt; color: #0f172a; display: block;">FIRMA RESPONSABLE PROYECTO</strong>
                        <span style="font-size: 8pt; color: #64748b;">Fundación Miguel Ángel Gamboa</span>
                    </div>
                </td>
                <td width="10%"></td>
                <td width="45%" style="text-align: center; vertical-align: top;">
                    <div style="border-top: 1px solid #94a3b8; width: 80%; margin: 0 auto; padding-top: 5px;">
                        <strong style="font-size: 9pt; color: #0f172a; display: block;">FIRMA TESORERÍA / DIRECCIÓN</strong>
                        <span style="font-size: 8pt; color: #64748b;">Fundación Miguel Ángel Gamboa</span>
                    </div>
                </td>
            </tr>
        </table>
    @endif

    <!-- SECTION 2: ANEXO DE COMPROBANTES (Vouchers Section) -->
    @php
        $movimientosConFoto = $movimientos->filter(fn($m) => $m->is_image && !empty($m->comprobante_base64));
    @endphp

    @if($movimientosConFoto->count() > 0)
        <div class="page-break"></div>

        <div class="annex-header">
            <div class="annex-title">ANEXO DE COMPROBANTES Y RESPALDOS FOTOGRÁFICOS</div>
            <div class="annex-sub">{{ isset($proyectoInfo) && $proyectoInfo ? 'Rendición Proyecto: '.$proyectoInfo['nombre'] : $nombrePeriodo }}</div>
        </div>

        @foreach($movimientosConFoto as $mov)
            <div class="voucher-card">
                <div class="voucher-header">
                    {{ $mov->fecha ? $mov->fecha->format('d/m/Y') : '' }} — {{ $mov->concepto }} — ${{ number_format($mov->monto, 0, ',', '.') }} (Proyecto: {{ $mov->proyecto }})
                </div>
                <div class="voucher-body">
                    <img src="{{ $mov->comprobante_base64 }}" class="voucher-img" alt="Comprobante de Rendición">
                </div>
            </div>
        @endforeach
    @endif

    <div class="footer-note">
        Informe generado automáticamente por el Sistema Interno de Gestión — Fundación Miguel Ángel Gamboa.
    </div>

</body>
</html>
