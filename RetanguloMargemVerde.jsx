#target illustrator

(function () {
    if (app.documents.length === 0) {
        alert("Abra um documento antes de executar o script.");
        return;
    }

    var doc = app.activeDocument;

    if (doc.selection.length === 0) {
        alert("Selecione um grupo ou objetos antes de executar o script.");
        return;
    }

    var selectionBounds = getSelectionBounds(doc.selection);
    if (!selectionBounds) {
        alert("Não foi possível calcular os limites dos objetos selecionados.");
        return;
    }

    var offset = cmToPoints(1.8);
    var rectTop = selectionBounds.top + offset;
    var rectLeft = selectionBounds.left - offset;
    var rectWidth = (selectionBounds.right - selectionBounds.left) + offset * 2;
    var rectHeight = (selectionBounds.top - selectionBounds.bottom) + offset * 2;

    var rectangle = doc.pathItems.rectangle(rectTop, rectLeft, rectWidth, rectHeight);
    rectangle.stroked = true;
    rectangle.filled = false;
    rectangle.strokeWeight = 1;
    rectangle.strokeColor = createGreenColor(doc.documentColorSpace);
    rectangle.name = "Margem 1.8cm";

    rectangle.move(doc.activeLayer, ElementPlacement.PLACEATBEGINNING);

    function getSelectionBounds(selectionItems) {
        var top = -Infinity;
        var left = Infinity;
        var bottom = Infinity;
        var right = -Infinity;
        var hasBounds = false;

        for (var i = 0; i < selectionItems.length; i++) {
            var item = selectionItems[i];
            if (!item.geometricBounds) {
                continue;
            }

            var bounds = item.geometricBounds; // [y1, x1, y2, x2]
            hasBounds = true;
            top = Math.max(top, bounds[0]);
            left = Math.min(left, bounds[1]);
            bottom = Math.min(bottom, bounds[2]);
            right = Math.max(right, bounds[3]);
        }

        if (!hasBounds) {
            return null;
        }

        return { top: top, left: left, bottom: bottom, right: right };
    }

    function cmToPoints(cmValue) {
        var pointsPerCm = 72 / 2.54;
        return cmValue * pointsPerCm;
    }

    function createGreenColor(colorSpace) {
        if (colorSpace === DocumentColorSpace.CMYK) {
            var cmykColor = new CMYKColor();
            cmykColor.cyan = 100;
            cmykColor.magenta = 0;
            cmykColor.yellow = 100;
            cmykColor.black = 0;
            return cmykColor;
        }

        var rgbColor = new RGBColor();
        rgbColor.red = 0;
        rgbColor.green = 255;
        rgbColor.blue = 0;
        return rgbColor;
    }
})();
