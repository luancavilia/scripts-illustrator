// Script Illustrator: cria retângulo 18 mm maior que a seleção
// e ajusta artboard 5 cm maior, SEM exibir mensagens.

(function () {
    if (app.documents.length === 0) {
        alert("Nenhum documento aberto.");
        return;
    }

    var doc = app.activeDocument;

    if (!doc.selection || doc.selection.length === 0) {
        alert("Nenhum objeto selecionado.");
        return;
    }

    // ==== CONFIGURAÇÕES ====

    var marginMm = 18.0;
    var mmToPt = 2.834645669;
    var marginPt = marginMm * mmToPt;

    var extraCm = 5.0;
    var cmToPt = 72 / 2.54;
    var extraPt = extraCm * cmToPt;

    // ==== BOUNDING BOX DA SELEÇÃO ====

    var sel = doc.selection;
    var left   = sel[0].visibleBounds[0];
    var top    = sel[0].visibleBounds[1];
    var right  = sel[0].visibleBounds[2];
    var bottom = sel[0].visibleBounds[3];

    for (var i = 1; i < sel.length; i++) {
        var b = sel[i].visibleBounds;
        if (b[0] < left)   left   = b[0];
        if (b[1] > top)    top    = b[1];
        if (b[2] > right)  right  = b[2];
        if (b[3] < bottom) bottom = b[3];
    }

    // (Mensagens removidas conforme solicitado)

    // ==== APLICA MARGEM DE 18 MM ====

    var rectLeft   = left  - marginPt;
    var rectTop    = top   + marginPt;
    var rectRight  = right + marginPt;
    var rectBottom = bottom - marginPt;

    var rectWidth  = rectRight - rectLeft;
    var rectHeight = rectTop   - rectBottom;

    // Cria o retângulo
    var rect = doc.pathItems.rectangle(rectTop, rectLeft, rectWidth, rectHeight);

    rect.stroked = true;
    rect.filled  = false;

    // Verde CMYK (100C 0M 100Y 0K)
    var strokeColor = new CMYKColor();
    strokeColor.cyan    = 100;
    strokeColor.magenta = 0;
    strokeColor.yellow  = 100;
    strokeColor.black   = 0;
    rect.strokeColor = strokeColor;

    rect.strokeWidth = 1;

    // ==== AJUSTA A ARTBOARD ====

    var cx = rectLeft + rectWidth / 2;
    var cy = rectTop  - rectHeight / 2;

    var newAbWidth  = rectWidth  + extraPt;
    var newAbHeight = rectHeight + extraPt;

    var abIndex = doc.artboards.getActiveArtboardIndex();
    var ab = doc.artboards[abIndex];

    ab.artboardRect = [
        cx - newAbWidth / 2,
        cy + newAbHeight / 2,
        cx + newAbWidth / 2,
        cy - newAbHeight / 2
    ];

})();
