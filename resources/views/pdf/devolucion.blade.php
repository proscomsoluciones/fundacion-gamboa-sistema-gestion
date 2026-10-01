<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Acta de Devolución {{ $comodato->codigo }} — Fundación Miguel Ángel Gamboa</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10.5pt;
            color: #1e293b;
            line-height: 1.5;
            margin: 20px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            border-bottom: 2px solid #059669;
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
            background-color: #d1fae5;
            border: 1px solid #a7f3d0;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 6px;
        }
        .doc-title h2 {
            margin: 0;
            font-size: 12pt;
            color: #065f46;
            text-transform: uppercase;
        }
        .doc-code {
            font-size: 9pt;
            color: #047857;
            font-weight: bold;
        }
        .section-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 10pt;
            font-weight: bold;
            color: #047857;
            text-transform: uppercase;
            margin-bottom: 8px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
        }
        .data-grid {
            width: 100%;
            border-collapse: collapse;
        }
        .data-grid td {
            padding: 4px 6px;
            vertical-align: top;
            font-size: 10pt;
        }
        .data-label {
            font-weight: bold;
            color: #334155;
            width: 35%;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #059669;
            color: #ffffff;
            font-size: 9pt;
            text-transform: uppercase;
            padding: 6px 8px;
            text-align: left;
        }
        .items-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 8px;
            font-size: 9.5pt;
        }
        .obs-box {
            background-color: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 10px;
            border-radius: 4px;
            font-size: 9.5pt;
            color: #334155;
            margin-top: 5px;
        }
        .signatures-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
        }
        .signature-cell {
            width: 46%;
            text-align: center;
            vertical-align: top;
        }
        .signature-space {
            height: 55px;
        }
        .signature-line {
            border-top: 1px dashed #475569;
            padding-top: 6px;
            font-size: 8.5pt;
            font-weight: bold;
            color: #0f172a;
        }
        .footer-note {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 8pt;
            color: #64748b;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- Header with Logo -->
    <table class="header-table">
        <tr>
            <td class="header-logo">
                @if(file_exists(public_path('img/logo/logo-fundacion.svg')))
                    <img src="data:image/svg+xml;base64,{{ base64_encode(file_get_contents(public_path('img/logo/logo-fundacion.svg'))) }}" alt="Logo Fundación Gamboa" />
                @else
                    <div style="font-size: 15pt; font-weight: 900; color: #059669;">
                        FUNDACIÓN<br>GAMBOA
                    </div>
                @endif
            </td>
            <td class="header-title">
                <h1>Fundación Miguel Ángel Gamboa</h1>
                <p>Sistema de Gestión Interno — Banco de Ayudas Técnicas</p>
                <p>Fecha de emisión: {{ date('d/m/Y H:i') }} hrs</p>
            </td>
        </tr>
    </table>

    <!-- Document Title -->
    <div class="doc-title">
        <h2>Acta de Recepción y Constancia de Devolución de Comodato</h2>
        <div class="doc-code">CÓDIGO DE FICHA: {{ $comodato->codigo }}</div>
    </div>

    <!-- Beneficiario Data -->
    <div class="section-box">
        <div class="section-title">1. Antecedentes de Recepción del Comodatorio / Beneficiario</div>
        <table class="data-grid">
            <tr>
                <td class="data-label">Nombre del Beneficiario:</td>
                <td><strong>{{ $comodato->beneficiario->nombre }}</strong></td>
            </tr>
            <tr>
                <td class="data-label">RUT / DNI:</td>
                <td><strong>{{ $comodato->beneficiario->rut ?? 'No registrado' }}</strong></td>
            </tr>
            <tr>
                <td class="data-label">Comuna / Dirección:</td>
                <td>{{ $comodato->beneficiario->comuna ? $comodato->beneficiario->comuna . ' — ' : '' }}{{ $comodato->beneficiario->direccion ?? 'No registrada' }}</td>
            </tr>
            <tr>
                <td class="data-label">Teléfono de Contacto:</td>
                <td>{{ $comodato->beneficiario->telefono ?? 'No registrado' }}</td>
            </tr>
            @if($comodato->beneficiario->representante_nombre || $comodato->beneficiario->contacto_adicional)
            <tr>
                <td class="data-label">Contacto / Apoderado:</td>
                <td>{{ $comodato->beneficiario->representante_nombre ?? $comodato->beneficiario->contacto_adicional }} {{ $comodato->beneficiario->representante_rut ? '(RUT: '.$comodato->beneficiario->representante_rut.')' : '' }}</td>
            </tr>
            @endif
            <tr>
                <td class="data-label">Parentesco / Vínculo:</td>
                <td><strong>{{ $comodato->beneficiario->parentesco ?? 'Paciente Directo' }}</strong></td>
            </tr>
            <tr>
                <td class="data-label">Fecha Inicial de Entrega:</td>
                <td>{{ \Carbon\Carbon::parse($comodato->fecha_entrega)->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td class="data-label">Fecha Efectiva de Devolución:</td>
                <td><strong>{{ $comodato->fecha_devolucion_real ? \Carbon\Carbon::parse($comodato->fecha_devolucion_real)->format('d/m/Y') : date('d/m/Y') }}</strong></td>
            </tr>
        </table>
    </div>

    <!-- Equipment Restored -->
    <div class="section-box">
        <div class="section-title">2. Detalle de los Equipos e Insumos Devueltos a Inventario</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Producto / Insumo</th>
                    <th>Código Serie / Unidad</th>
                    <th>Cantidad</th>
                    <th>Estado de Recepción</th>
                </tr>
            </thead>
            <tbody>
                @foreach($comodato->items as $item)
                <tr>
                    <td>{{ $item->producto->categoria }}</td>
                    <td><strong>{{ $item->producto->nombre }}</strong></td>
                    <td>{{ $item->unidad ? $item->unidad->codigo_unidad : 'Stock Genérico' }}</td>
                    <td style="text-align: center;"><strong>{{ $item->cantidad }}</strong></td>
                    <td>Recibido y Restablecido a Stock</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Observaciones de Recepción -->
    <div class="section-box">
        <div class="section-title">3. Estado de Recepción y Observaciones del Taller</div>
        <div class="obs-box">
            {{ $comodato->observaciones_devolucion ?? 'Equipos recibidos conforme en taller de la Fundación para proceso de sanitización y reacondicionamiento.' }}
        </div>
    </div>

    <!-- Certificado de Liberación -->
    <div class="section-box" style="background-color: #ecfdf5; border-color: #a7f3d0;">
        <div style="font-size: 8.5pt; color: #065f46; text-align: justify;">
            <strong>CONSTANCIA DE DEVOLUCIÓN:</strong> Por medio del presente documento, la Fundación Miguel Ángel Gamboa certifica la recepción conforme de los equipos señalados precedentemente, declarando que el beneficiario/comodatario ha dado cumplimiento a la obligación de devolución en óptimas condiciones, liberándolo de la tenencia del bien.
        </div>
    </div>

    <!-- Signatures -->
    <table class="signatures-table">
        <tr>
            <td class="signature-cell">
                <div class="signature-space"></div>
                <div class="signature-line">
                    QUIEN DEVUELVE / RESPONSABLE<br>
                    Nombre: {{ $comodato->beneficiario->representante_nombre ?? $comodato->beneficiario->contacto_adicional ?? $comodato->beneficiario->nombre }}<br>
                    RUT: {{ $comodato->beneficiario->representante_rut ?? $comodato->beneficiario->rut ?? '____________' }}<br>
                    Parentesco / Vínculo: {{ $comodato->beneficiario->parentesco ?? 'Paciente Directo' }}
                </div>
            </td>
            <td style="width: 8%;"></td>
            <td class="signature-cell">
                <div class="signature-space"></div>
                <div class="signature-line">
                    POR FUNDACIÓN MIGUEL ÁNGEL GAMBOA<br>
                    Recepción Taller / Logística<br>
                    Fecha: {{ date('d/m/Y') }}
                </div>
            </td>
        </tr>
    </table>

    <div style="font-size: 7.5pt; color: #64748b; text-align: center; margin-top: 15px;">
        🔒 Protección de Datos Personales (Ley N° 19.628 / 21.719): Los datos personales de esta acta son confidenciales y resguardados en conformidad a la legislación chilena.
    </div>

    <div class="footer-note">
        Comprobante oficial de recepción emitido por la Fundación Miguel Ángel Gamboa — Banco de Ayudas Técnicas.
    </div>

</body>
</html>
