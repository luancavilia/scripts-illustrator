#target illustrator

function main() {
    if (app.documents.length === 0 || app.activeDocument.selection.length === 0) {
        alert("Selecione os objetos (swatches) primeiro.");
        return;
    }

    var doc = app.activeDocument;
    var sel = doc.selection;
    var offset = 2; // Distância entre o objeto e o texto (em pt)

    // Cria a cor preta para o texto
    var blackColor = new CMYKColor();
    blackColor.cyan = 0;
    blackColor.magenta = 0;
    blackColor.yellow = 0;
    blackColor.black = 100;

    for (var i = 0; i < sel.length; i++) {
        var item = sel[i];
        
        // Pega as coordenadas do objeto
        // bounds = [left, top, right, bottom]
        var bounds = item.geometricBounds;
        var itemWidth = bounds[2] - bounds[0];
        
        // Verifica se tem preenchimento CMYK
        if (item.filled && item.fillColor.typename === "CMYKColor") {
            var c = Math.round(item.fillColor.cyan);
            var m = Math.round(item.fillColor.magenta);
            var y = Math.round(item.fillColor.yellow);
            var k = Math.round(item.fillColor.black);

            // Cria a string
            var content = "C:" + c + " / M:" + m + " / Y:" + y + " / K:" + k;

            // Cria o objeto de texto
            var textRef = doc.textFrames.add();
            textRef.contents = content;
            
            // Aplica a cor preta
            textRef.textRange.characterAttributes.fillColor = blackColor;
            textRef.textRange.characterAttributes.size = 10; // Tamanho base inicial (será reescalado)

            // Posicionamento
            // Topo do texto = Fundo do objeto - offset
            textRef.top = bounds[3] - offset; 
            textRef.left = bounds[0]; // Alinha à esquerda do objeto

            // Força a largura do texto a ser igual à do objeto
            // Se não quiser distorcer a fonte, comente a linha abaixo.
            if (itemWidth > 0) {
                textRef.width = itemWidth; 
            }
        }
    }
    
    // Remove a seleção dos objetos originais para facilitar visualização
    app.selection = null;
}

main();