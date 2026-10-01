<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Comodato {{ $comodato->codigo }} — Fundación Miguel Ángel Gamboa</title>
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
            padding: 8px;
            margin-bottom: 20px;
            border-radius: 6px;
        }
        .doc-title h2 {
            margin: 0;
            font-size: 12pt;
            color: #9f1239;
            text-transform: uppercase;
        }
        .doc-code {
            font-size: 9pt;
            color: #be123c;
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
            color: #be123c;
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
            width: 32%;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .items-table th {
            background-color: #be123c;
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
        .clauses {
            font-size: 8.5pt;
            color: #334155;
            text-align: justify;
            margin-bottom: 25px;
        }
        .clauses p {
            margin: 4px 0;
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
                    <div style="font-size: 16pt; font-weight: 900; color: #be123c;">
                        FUNDACIÓN<br>GAMBOA
                    </div>
                @endif
            </td>
            <td class="header-title">
                <h1>Fundación Miguel Ángel Gamboa</h1>
                <p>Sistema de Gestión Interno — Banco de Ayudas Técnicas</p>
                <p>Fecha de emisión: {{ \Carbon\Carbon::parse($comodato->fecha_entrega)->format('d/m/Y') }}</p>
            </td>
        </tr>
    </table>

    <!-- Document Title -->
    <div class="doc-title">
        <h2>Contrato y Acta de Entrega de Equipos e Insumos</h2>
        <div class="doc-code">CÓDIGO DE REGISTRO: {{ $comodato->codigo }}</div>
    </div>

    <!-- Beneficiario Data -->
    <div class="section-box">
        <div class="section-title">1. Antecedentes del Beneficiario / Comodatario</div>
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
                <td class="data-label">Fecha Registro Beneficiario:</td>
                <td>{{ $comodato->beneficiario->fecha_registro ? \Carbon\Carbon::parse($comodato->beneficiario->fecha_registro)->format('d/m/Y') : 'Reciente' }}</td>
            </tr>
            <tr>
                <td class="data-label">Sucursal de Entrega:</td>
                <td><strong>{{ $comodato->sucursal->nombre ?? 'Casa Matriz' }}</strong></td>
            </tr>
        </table>
    </div>

    <!-- Products / Equipment Detail -->
    <div class="section-box">
        <div class="section-title">2. Detalle de Equipos (Comodato) e Insumos Consumibles Entregados</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Categoría</th>
                    <th>Producto / Insumo</th>
                    <th>Identificador / Serie</th>
                    <th>Cant.</th>
                    <th>Tipo de Entrega</th>
                </tr>
            </thead>
            <tbody>
                @foreach($comodato->items as $item)
                <tr>
                    <td>{{ $item->producto->categoria }}</td>
                    <td><strong>{{ $item->producto->nombre }}</strong></td>
                    <td>{{ $item->unidad ? $item->unidad->codigo_unidad : 'Stock Genérico' }}</td>
                    <td style="text-align: center;"><strong>{{ $item->cantidad }}</strong></td>
                    <td>
                        @if($item->unidad)
                            <strong>Comodato Retornable</strong>
                        @else
                            <em>Donación Definitiva (Consumible)</em>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Legal Clauses -->
    <div class="section-box">
        <div class="section-title">3. Cláusulas y Condiciones del Préstamo y Entrega de Insumos</div>
        <div class="clauses">
            <p><strong>PRIMERA (NATURALEZA DE LA ENTREGA):</strong> La Fundación Miguel Ángel Gamboa entrega al beneficiario/comodatario los productos descritos precedentemente. Los equipos durables (Camas, Sillas, Andadores) se entregan en calidad de Comodato (préstamo de uso gratuito retornable), mientras que los insumos consumibles (Pañales, Sabanillas, Suplementos) constituyen una donación definitiva no retornable.</p>
            <p><strong>SEGUNDA (DURACIÓN DEL PRÉSTAMO):</strong> El comodato de equipos no tiene costo y se mantendrá vigente mientras el beneficiario requiera efectivamente del uso de los equipos para su asistencia o tratamiento de salud.</p>
            <p><strong>TERCERA (CONSERVACIÓN Y CUIDADO):</strong> El comodatario se obliga a cuidar, mantener aseado y dar un uso adecuado a los equipos durables recibidos, conservando sus motores, estructura y accesorios en estado funcional.</p>
            <p><strong>CUARTA (OBLIGACIÓN DE DEVOLUCIÓN DE EQUIPOS):</strong> Cuando el beneficiario ya no requiera el equipamiento durable, el comodatario o sus familiares se comprometen a dar aviso inmediato a la Fundación y devolver el bien para ser sanitizado y prestado a otra persona necesitada.</p>
            <p><strong>QUINTA (PROHIBICIÓN DE ENAJENACIÓN):</strong> Queda estrictamente prohibido vender, alquilar, ceder o transferir la posesión de los bienes entregados a terceras personas ajenas a esta acta.</p>
            <p><strong>SEXTA (PROTECCIÓN DE DATOS PERSONALES - LEY N° 19.628):</strong> En conformidad con la legislación chilena sobre protección de datos personales (Ley N° 19.628 y Ley N° 21.719), los datos personales y de contacto recopilados en esta acta son estrictamente confidenciales y tratados con la sola finalidad de coordinar y auditar la entrega de ayudas sociales. Los titulares podrán ejercer sus derechos de acceso, actualización y cancelación contactando a la Fundación.</p>
        </div>
    </div>

    <!-- Signatures -->
    <table class="signatures-table">
        <tr>
            <td class="signature-cell">
                <div class="signature-space"></div>
                <div class="signature-line">
                    FIRMA DEL BENEFICIARIO O RESPONSABLE<br>
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
                    Responsable: {{ $comodato->responsable->name }}<br>
                    Cargo: Operación y Logística<br>
                    &nbsp;
                </div>
            </td>
        </tr>
    </table>

</body>
</html>
