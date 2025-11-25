#target illustrator

function main() {
    // 1. VERIFICAÇÃO DE SELEÇÃO
    if (app.documents.length === 0 || app.activeDocument.selection.length === 0) {
        alert("⚠️ ATENÇÃO: Nenhum objeto selecionado.\n\n" +
              "Para o script funcionar:\n" +
              "1. Abra seu arquivo.\n" +
              "2. Selecione os vetores que deseja alterar.\n" +
              "3. Rode o script novamente.");
        return;
    }

    // 2. CRIAÇÃO DA JANELA (UI)
    var win = new Window("dialog", "Ajuste Fino CMYK");
    win.orientation = "column";
    win.alignChildren = "fill";

    // Painel de Canais
    var pnlColors = win.add("panel", undefined, "Selecione os canais para alterar:");
    pnlColors.alignChildren = "left";

    // Função auxiliar para criar linhas (Checkbox + Input)
    function addChannelRow(parent, label) {
        var grp = parent.add("group");
        var chk = grp.add("checkbox", undefined, label);
        var input = grp.add("edittext", undefined, "0");
        input.characters = 5;
        input.enabled = false; // Desativado até marcar o check
        
        // Ativa input ao marcar checkbox
        chk.onClick = function() { input.enabled = this.value; }
        return { check: chk, val: input };
    }

    var cRow = addChannelRow(pnlColors, "Cyan (C)");
    var mRow = addChannelRow(pnlColors, "Magenta (M)");
    var yRow = addChannelRow(pnlColors, "Yellow (Y)");
    var kRow = addChannelRow(pnlColors, "Black (K)");

    // Painel de Ação
    var pnlAction = win.add("panel", undefined, "Ação:");
    pnlAction.orientation = "row";
    var radAdd = pnlAction.add("radiobutton", undefined, "Somar (+)");
    var radSub = pnlAction.add("radiobutton", undefined, "Diminuir (-)");
    radSub.value = true; // Padrão é diminuir

    // Botões
    var grpBtns = win.add("group");
    grpBtns.alignment = "right";
    var btnCancel = grpBtns.add("button", undefined, "Cancelar");
    var btnOk = grpBtns.add("button", undefined, "Aplicar");

    // 3. LÓGICA DE PROCESSAMENTO
    btnOk.onClick = function() {
        var inputs = {
            c: { active: cRow.check.value, val: parseFloat(cRow.val.text) },
            m: { active: mRow.check.value, val: parseFloat(mRow.val.text) },
            y: { active: yRow.check.value, val: parseFloat(yRow.val.text) },
            k: { active: kRow.check.value, val: parseFloat(kRow.val.text) }
        };

        var isSubtraction = radSub.value;

        // Validação básica
        if (!inputs.c.active && !inputs.m.active && !inputs.y.active && !inputs.k.active) {
            alert("Selecione pelo menos uma cor.");
            return;
        }

        win.close();
        applyChanges(inputs, isSubtraction);
    }

    btnCancel.onClick = function() { win.close(); }

    win.show();

    // Função que varre os objetos
    function applyChanges(opts, isSub) {
        var doc = app.activeDocument;
        var sel = doc.selection;
        var count = 0;

        function processItem(item) {
            if (item.typename === "GroupItem") {
                for (var i = 0; i < item.pageItems.length; i++) {
                    processItem(item.pageItems[i]);
                }
            } else if (item.typename === "PathItem" || item.typename === "CompoundPathItem") {
                if (item.filled && item.fillColor.typename === "CMYKColor") {
                    var col = item.fillColor;
                    var newCol = new CMYKColor();
                    
                    // Lógica para cada canal
                    newCol.cyan = calcVal(col.cyan, opts.c, isSub);
                    newCol.magenta = calcVal(col.magenta, opts.m, isSub);
                    newCol.yellow = calcVal(col.yellow, opts.y, isSub);
                    newCol.black = calcVal(col.black, opts.k, isSub);

                    item.fillColor = newCol;
                    count++;
                }
            }
        }

        // Função matemática
        function calcVal(currentVal, optChannel, isSub) {
            if (!optChannel.active) return currentVal; // Se não marcou, mantém original
            
            var change = optChannel.val;
            if (isNaN(change)) return currentVal;

            var result = isSub ? (currentVal - change) : (currentVal + change);
            
            // Trava entre 0 e 100
            if (result > 100) return 100;
            if (result < 0) return 0;
            return result;
        }

        // Loop principal
        for (var i = 0; i < sel.length; i++) {
            processItem(sel[i]);
        }
    }
}

main();