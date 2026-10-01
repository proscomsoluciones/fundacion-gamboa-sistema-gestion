<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\BeneficiarioController;
use App\Http\Controllers\ComodatoController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\ConfiguracionController;
use App\Http\Controllers\FinanzasController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentoController;
use Illuminate\Support\Facades\Route;

// Redirigir la raíz al Dashboard si está autenticado
Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // Perfil de Usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Módulo de Inventario & Productos
    Route::get('/productos', [ProductoController::class, 'index'])->name('productos.index');
    Route::post('/productos', [ProductoController::class, 'store'])->name('productos.store');
    Route::put('/productos/{producto}', [ProductoController::class, 'update'])->name('productos.update');
    Route::post('/productos/{producto}/stock', [ProductoController::class, 'updateStock'])->name('productos.stock.update');
    Route::post('/productos/{producto}/ingresar-stock-modulo', [ProductoController::class, 'ingresarStockModulo'])->name('productos.stock.modulo.ingresar');
    Route::post('/productos/{producto}/unidades', [ProductoController::class, 'storeUnidad'])->name('productos.unidades.store');
    Route::patch('/unidades/{unidad}/estado', [ProductoController::class, 'updateUnidadEstado'])->name('unidades.estado.update');
    Route::get('/api/inventario/consultar-qr/{codigo}', [ProductoController::class, 'consultarQrJson'])->name('productos.consultarQrJson');
    Route::get('/productos/reporte/pdf', [ProductoController::class, 'downloadReportePdf'])->name('productos.reporte.pdf');
    Route::post('/productos/etiquetas-masivas/pdf', [ProductoController::class, 'downloadEtiquetasMasivasPdf'])->name('productos.etiquetas.masivas.pdf');
    Route::get('/productos/export/excel', [ProductoController::class, 'exportExcel'])->name('productos.export.excel');

    // Módulo de Beneficiarios
    Route::get('/beneficiarios', [BeneficiarioController::class, 'index'])->name('beneficiarios.index');
    Route::post('/beneficiarios', [BeneficiarioController::class, 'store'])->name('beneficiarios.store');
    Route::put('/beneficiarios/{beneficiario}', [BeneficiarioController::class, 'update'])->name('beneficiarios.update');
    Route::get('/api/beneficiarios/buscar', [BeneficiarioController::class, 'searchJson'])->name('beneficiarios.searchJson');
    Route::get('/beneficiarios/reporte/pdf', [BeneficiarioController::class, 'downloadPdf'])->name('beneficiarios.pdf');
    Route::get('/beneficiarios/export/excel', [BeneficiarioController::class, 'exportExcel'])->name('beneficiarios.export.excel');

    // Módulo de Comodatos (Préstamos)
    Route::get('/comodatos', [ComodatoController::class, 'index'])->name('comodatos.index');
    Route::get('/comodatos/nuevo', [ComodatoController::class, 'create'])->name('comodatos.create');
    Route::post('/comodatos', [ComodatoController::class, 'store'])->name('comodatos.store');
    Route::get('/comodatos/{comodato}', [ComodatoController::class, 'show'])->name('comodatos.show');
    Route::put('/comodatos/{comodato}', [ComodatoController::class, 'update'])->name('comodatos.update');
    Route::delete('/comodatos/{comodato}', [ComodatoController::class, 'destroy'])
        ->middleware('permission:eliminar-comodatos')
        ->name('comodatos.destroy');
    Route::get('/comodatos/{comodato}/pdf', [ComodatoController::class, 'downloadPdf'])->name('comodatos.pdf');
    Route::get('/comodatos/{comodato}/devolucion-pdf', [ComodatoController::class, 'downloadDevolucionPdf'])->name('comodatos.devolucion.pdf');
    Route::post('/comodatos/{comodato}/firmado', [ComodatoController::class, 'uploadSigned'])->name('comodatos.uploadSigned');
    Route::post('/comodatos/{comodato}/devolucion', [ComodatoController::class, 'devolucion'])->name('comodatos.devolucion');
    Route::get('/comodatos/export/excel', [ComodatoController::class, 'exportExcel'])->name('comodatos.export.excel');

    // Módulo de Finanzas (Ingresos, Egresos, Proyectos & Libro de Respaldos PDF)
    Route::middleware(['role:super_admin|admin'])->group(function () {
        Route::get('/finanzas', [FinanzasController::class, 'index'])->name('finanzas.index');
        Route::post('/finanzas', [FinanzasController::class, 'store'])->name('finanzas.store');
        Route::put('/finanzas/{movimiento}', [FinanzasController::class, 'update'])->name('finanzas.update');
        Route::delete('/finanzas/{movimiento}', [FinanzasController::class, 'destroy'])->name('finanzas.destroy');
        Route::get('/finanzas/reporte/pdf', [FinanzasController::class, 'downloadPdf'])->name('finanzas.pdf');

        // Gestión de Proyectos / Fondos
        Route::post('/finanzas/proyectos', [FinanzasController::class, 'storeProyecto'])->name('finanzas.proyectos.store');
        Route::put('/finanzas/proyectos/{proyectoModel}', [FinanzasController::class, 'updateProyecto'])->name('finanzas.proyectos.update');
        Route::delete('/finanzas/proyectos/{proyectoModel}', [FinanzasController::class, 'destroyProyecto'])->name('finanzas.proyectos.destroy');

        // Módulo de Configuración & Categorías & Usuarios
        Route::get('/configuracion', [ConfiguracionController::class, 'index'])->name('configuracion.index');
        Route::post('/configuracion/categorias', [ConfiguracionController::class, 'storeCategoria'])->name('configuracion.categorias.store');
        Route::put('/configuracion/categorias/{categoria}', [ConfiguracionController::class, 'updateCategoria'])->name('configuracion.categorias.update');
        Route::delete('/configuracion/categorias/{categoria}', [ConfiguracionController::class, 'destroyCategoria'])->name('configuracion.categorias.destroy');

        // Gestión de Estados Físicos de Productos
        Route::post('/configuracion/estados-producto', [ConfiguracionController::class, 'storeEstadoProducto'])->name('configuracion.estados.store');
        Route::put('/configuracion/estados-producto/{estadoProducto}', [ConfiguracionController::class, 'updateEstadoProducto'])->name('configuracion.estados.update');
        Route::delete('/configuracion/estados-producto/{estadoProducto}', [ConfiguracionController::class, 'destroyEstadoProducto'])->name('configuracion.estados.destroy');

        // Gestión de Usuarios del Sistema
        Route::post('/configuracion/usuarios', [ConfiguracionController::class, 'storeUser'])->name('configuracion.usuarios.store');
        Route::put('/configuracion/usuarios/{user}', [ConfiguracionController::class, 'updateUser'])->name('configuracion.usuarios.update');
        Route::delete('/configuracion/usuarios/{user}', [ConfiguracionController::class, 'destroyUser'])->name('configuracion.usuarios.destroy');

        // Módulo Mantenedor de Sucursales
        Route::get('/configuracion/sucursales', [\App\Http\Controllers\SucursalController::class, 'index'])->name('sucursales.index');
        Route::post('/configuracion/sucursales', [\App\Http\Controllers\SucursalController::class, 'store'])->name('sucursales.store');
        Route::put('/configuracion/sucursales/{sucursal}', [\App\Http\Controllers\SucursalController::class, 'update'])->name('sucursales.update');
        Route::patch('/configuracion/sucursales/{sucursal}/estado', [\App\Http\Controllers\SucursalController::class, 'toggleStatus'])->name('sucursales.status');
    });

    // Módulo de Traslados de Inventario entre Sucursales
    Route::post('/inventario/traslados', [\App\Http\Controllers\TrasladoController::class, 'store'])->name('inventario.traslados.store');

    // Módulo de Reportes & Indicadores (DEDICADO)
    Route::get('/reportes', [ReporteController::class, 'index'])->name('reportes.index');
    Route::get('/reportes/comodatos/pdf', [ReporteController::class, 'downloadComodatosPdf'])->name('reportes.comodatos.pdf');

    // Módulo de Gestión Documental (Word, Excel, PDF)
    Route::get('/documentos', [DocumentoController::class, 'index'])->name('documentos.index');
    Route::post('/documentos', [DocumentoController::class, 'store'])->name('documentos.store');
    Route::put('/documentos/{documento}', [DocumentoController::class, 'update'])->name('documentos.update');
    Route::delete('/documentos/{documento}', [DocumentoController::class, 'destroy'])->name('documentos.destroy');
    Route::get('/documentos/{documento}/download', [DocumentoController::class, 'download'])->name('documentos.download');
    Route::get('/documentos/{documento}/preview', [DocumentoController::class, 'preview'])->name('documentos.preview');
});

require __DIR__.'/auth.php';
