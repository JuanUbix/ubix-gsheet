//1. enviar al servidor las hojas updated y shipped con un trigger propio para cada una con distintos horarios
//2. pasar rows con delivery a la hoja de delivered
//3. eliminar rows que coincida en shipped vs deliver
//4. pasar rows con shipping a la hoja de shipped
//5. eliminar rows que coincida en uploaded vs shipped
class Cleaner {
    constructor(
      spreadSheetId 
    ){
      this.spreadSheetId = spreadSheetId
    }

    moverFilas(sourceSheet, targetSheet) {
        const ss = SpreadsheetApp.openById(this.spreadSheetId);

        var origenHoja = ss.getSheetByName(sourceSheet);
        var destinoHoja = ss.getSheetByName(targetSheet);
     

        if (!origenHoja) {
            Logger.log("La hoja 'uploadeds' no existe.");
            return;
        }

        if (!destinoHoja) {
            Logger.log("La hoja 'SHIPPED' no existe.");
            return;
        }

        // Leer datos
        var lastRowOrigen = origenHoja.getLastRow();
        if (lastRowOrigen < 2) {
            Logger.log("No hay datos para mover.");
            return;
        }

        var datosOrigen = origenHoja.getRange(2, 1, lastRowOrigen - 1, 39).getValues();
        Logger.log("Filas cargadas: " + datosOrigen.length);
        let column = 29
        if(sourceSheet === CHINA_PRODUCTION_UPLOADED_SHEET_NAME){
            column = 27;
        }
        Logger.log(column) 
        // Filtrar datos por ACTUAL DELIVERY DATE (por ejemplo, si está en la columna 30, el índice es 29)
        var filasParaMover = datosOrigen.filter(function(row) {
            return row[column] && row[column] !== '';  // Mover solo las filas con valor en ACTUAL DELIVERY DATE
        });

        // Verificar si hay filas para mover
        if (filasParaMover.length > 0) {
            var lastRowDestino = destinoHoja.getLastRow();
            destinoHoja.getRange(lastRowDestino + 1, 1, filasParaMover.length, 39).setValues(filasParaMover);

            // Opcional: ordenar la hoja de destino por la primera columna
            destinoHoja.getRange(2, 1, destinoHoja.getLastRow() - 1, 39).sort(1);
        } else {
            Logger.log("No hay filas para mover.");
        }
    }

    eliminarFilasCoincidentesArrayLotes(sourceSheet, deleteOnSheet) {
        var lock = LockService.getScriptLock(); // Obtener el lock del script
        try {
            lock.waitLock(30000); 

        const ss = SpreadsheetApp.openById(this.spreadSheetId);

            var origenHoja = ss.getSheetByName(deleteOnSheet);
            var destinoHoja = ss.getSheetByName(sourceSheet);
            Logger.log('lee de: '+ sourceSheet)
            Logger.log('borra de: '+ deleteOnSheet)


            if (!origenHoja || !destinoHoja) {
                Logger.log("Una de las hojas no existe.");
                return;
            }

            // 1. Crear array con las filas y sus respectivas referencias de "uploadeds".
            var rangoOrigen = origenHoja.getRange(2, 1, origenHoja.getLastRow() - 1, 1).getValues();
            var filasOrigen = rangoOrigen.map(function(valor, index) {
                return {id: valor[0], fila: index + 2};
            });

            // 2. Crear array con los IDs de "Sent Orders Oct2024".
            var idsDestino = destinoHoja.getRange(2, 1, destinoHoja.getLastRow() - 1).getValues().flat();

            // 3. Comparar ambos arrays y construir uno nuevo con las referencias de fila coincidentes.
            var filasParaEliminar = filasOrigen.filter(function(item) {
                return idsDestino.includes(item.id);
            }).map(function(item) {
                return item.fila;
            });

            // 4. Eliminar las filas coincidentes en lotes.
            filasParaEliminar.sort((a, b) => b - a); // Ordenar en orden descendente

            for (var i = 0; i < filasParaEliminar.length; ) {
                var startRow = filasParaEliminar[i];
                var count = 1;

                while (i + count < filasParaEliminar.length && filasParaEliminar[i + count] === startRow - count) {
                    count++;
                }

                origenHoja.deleteRows(startRow - count + 1, count);
                i += count;
            }

        } catch (e) {
            Logger.log("Error al obtener el lock: " + e.message);
        } finally {
            lock.releaseLock(); // Liberar el lock al finalizar
        }
    }

}
