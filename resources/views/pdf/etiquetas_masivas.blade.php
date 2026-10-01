<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Pliego Masivo de Etiquetas QR - Fundación Gamboa</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 8mm;
        }
        body {
            font-family: Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #1e293b;
        }
        .container {
            width: 100%;
        }
        .grid-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 4mm;
        }
        .sticker-card {
            border: 1.5pt solid #0f172a;
            border-radius: 12px;
            padding: 4mm 3mm;
            text-align: center;
            background: #ffffff;
            vertical-align: top;
            width: 32%;
        }
        .org-header {
            font-size: 6.5pt;
            font-weight: bold;
            text-transform: uppercase;
            color: #e11d48;
            letter-spacing: 0.5px;
            padding-bottom: 3px;
            border-bottom: 0.5pt solid #e2e8f0;
            margin-bottom: 4px;
        }
        .qr-image {
            width: 32mm;
            height: 32mm;
            margin: 2mm auto;
            display: block;
            border-radius: 8px;
        }
        .code-pill {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 4px 2px;
            margin-top: 3px;
        }
        .code-label {
            font-size: 5.5pt;
            font-weight: bold;
            color: #64748b;
            text-transform: uppercase;
            display: block;
            margin-bottom: 1px;
            letter-spacing: 0.3px;
        }
        .unit-code {
            font-family: Helvetica, Arial, sans-serif;
            font-size: 10pt;
            font-weight: bold;
            color: #be123c;
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        @php
            $chunks = array_chunk($etiquetas, 3);
        @endphp

        <table class="grid-table">
            @foreach($chunks as $row)
                <tr>
                    @foreach($row as $item)
                        <td class="sticker-card">
                            <div class="org-header">Fundación Miguel Ángel Gamboa</div>
                            
                            <img class="qr-image" 
                                 src="{{ $item['qr_base64'] }}" 
                                 alt="QR {{ $item['codigo_unidad'] }}" />

                            <div class="code-pill">
                                <span class="code-label">N° SERIE / CÓDIGO DE UNIDAD</span>
                                <span class="unit-code">{{ $item['codigo_unidad'] }}</span>
                            </div>
                        </td>
                    @endforeach
                    @for($i = count($row); $i < 3; $i++)
                        <td style="width: 32%; border: none;"></td>
                    @endfor
                </tr>
            @endforeach
        </table>
    </div>
</body>
</html>
