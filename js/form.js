window.addEventListener("DOMContentLoaded", () => {
    function input_param(text, input_name, placeholder) {
        let container = document.createElement("label");
        container.className = "input-label";
        let text_block = document.createElement("p");
        text_block.className = "input-text";
        text_block.textContent = text;
        let input = document.createElement("input");
        input.type = "number";
        input.name = input_name;
        input.placeholder = placeholder;
        input.min = MIN_MARK;
        input.max = MAX_MARK;

        container.append(text_block);
        container.append(input);

        return container
    }

    function delete_competitor(comp) {
        comp.remove();
        update_button_calculate()
    }

    function update_button_calculate() {
        let btn = document.getElementsByClassName("btn_calculate")[0];
        let comps = document.getElementsByClassName("comp");
        if (comps.length > 0) {
            if (btn.classList.contains("hidden"))
                btn.classList.remove("hidden");
        } else {
            btn.classList.add("hidden");
            let answer_table = document.getElementsByClassName("answer-table")[0];
            answer_table.classList.add("hidden");
        }
    }

    function add_competitor() {
        let new_comp = document.createElement("div");
        new_comp.className = "comp"
        let form = document.createElement("form");
        form.action = "POST";
        form.name = "form" + form_count.toString();
        form_count += 1;

        let head = document.createElement("div");
        head.className = "form-head";
        let input_name = document.createElement("input");
        input_name.type = "text";
        input_name.name = "comp-name";
        input_name.placeholder = "Название конкурента";
        let button_delete = document.createElement("div");
        button_delete.className = "button-delete";
        // let button_delete_content = document.createElement("div");
        // button_delete_content.className = "__content";

        button_delete.addEventListener("click", () => {
            delete_competitor(new_comp);
        });

        let inputs_box = document.createElement("div");
        inputs_box.className = "inputs-box";   
        
        let inputs = [];
        params.forEach((element) => {
            let inp = input_param(element['title'], element['name'], element['max']);
            inputs_box.append(inp);
        });

        head.append(input_name);
        // button_delete.append(button_delete_content);
        head.append(button_delete);
        form.append(head);
        form.append(inputs_box);
        new_comp.append(form);
        competitors_box.append(new_comp);

        update_button_calculate()
    }

    function get_values() {
        let competitors = {};

        let forms = document.forms;
        for (let i = 0; i < forms.length; i++) {
            let labels = forms[i].getElementsByClassName("inputs-box")[0].children;
            let values = {};
            let comp_name = forms[i]['comp-name'].value;
            if (!comp_name)
                comp_name = forms[i].name;
            
            for (let j = 0; j < labels.length; j++) {
                let input = labels[j].getElementsByTagName("input")[0];
                let value = Number(input.value);
                value = value > MAX_MARK ? MAX_MARK : value;
                value = value < MIN_MARK ? MIN_MARK : value;
                values[input.name] = value;
            }
            competitors[comp_name] = values;
        }
        
        return competitors;
    }

    function create_table_head(competitors) {
        let head = document.createElement("tr");
        let td1 = document.createElement("th");
        let td_weight = document.createElement("th");
        td_weight.textContent = "Вес";
        let td_mark = document.createElement("th");
        td_mark.textContent = "Оценка";

        head.append(td1);
        head.append(td_weight);
        head.append(td_mark);
        for (let key in competitors) {
            let td = document.createElement("th");
            td.textContent = "% " + key;
            head.append(td);
        };
        for (let key in competitors) {
            let td = document.createElement("th");
            td.textContent = "Баллы " + key;
            head.append(td);
        };

        return head;
    }

    function create_row_param(param, competitors) {
        let row = document.createElement("tr");

        let td_title = document.createElement("td");
        td_title.textContent = param['title'];
        row.append(td_title);

        let td_weight = document.createElement("td");
        td_weight.textContent = param['weight'];
        row.append(td_weight);
        
        let td_mark = document.createElement("td");
        td_mark.textContent = param['max'] + '%';
        row.append(td_mark);

        for (let comp_name in competitors) {
            let td = document.createElement("td");
            td.textContent = competitors[comp_name][param['name']];
            row.append(td);
        }

        for (let comp_name in competitors) {
            let td = document.createElement("td");
            td.textContent = competitors[comp_name][param['name']] * param['weight'];
            row.append(td);
        }

        return row;
    }

    function create_sumup_row(isPoints, competitors) {
        let row = document.createElement("tr");
        for (let i = 0; i < (2 + Object.keys(competitors).length); i++)
            row.append(document.createElement("td"));

        let td_title = document.createElement("td");
        td_title.textContent = `ИТОГО${isPoints ? '' : ' %'}:`
        row.append(td_title);
        
        let points = {};
        for (let comp_name in competitors) {
            points[comp_name] = 0;
            params.forEach((param) => {
                points[comp_name] += param['weight'] * competitors[comp_name][param['name']];
            });

            let td = document.createElement("th");
            if (isPoints) {
                td.textContent = points[comp_name];
            } else {
                let max_points = 0;
                for (let key in params)
                    max_points += params[key]['weight'] * MAX_MARK;

                td.textContent = (points[comp_name] / max_points * 100).toString() + '%';
            }
            row.append(td);
        }

        return row;
    }

    function calculate_answer() {
        let answer_table = document.getElementsByClassName("answer-table")[0];
        answer_table.classList.remove("hidden");

        let competitors = get_values();
        let table = document.getElementsByClassName("answer-table")[0];
        table.innerHTML = "";

        let head = create_table_head(competitors);
        table.append(head);
        params.forEach((param) => {
            let row = create_row_param(param, competitors);
            table.append(row);
        });
        let sumup_points = create_sumup_row(true, competitors);
        table.append(sumup_points);
        let sumup_percent = create_sumup_row(false, competitors);
        table.append(sumup_percent);
        
    }

    const MIN_MARK = 0, MAX_MARK = 100;
    const params = [
        {'title': "Эффективность", 'name': "eff", 'max': MAX_MARK, 'weight': 4,},
        {'title': "Результативность", 'name': "res", 'max': MAX_MARK, 'weight': 5,},
        {'title': "Продуктивность", 'name': "prod", 'max': MAX_MARK, 'weight': 3,},
        {'title': "Удовлетворенность", 'name': "sat", 'max': MAX_MARK, 'weight': 2,},
        {'title': "Утомляемость", 'name': "fat", 'max': MAX_MARK, 'weight': 1,},
        {'title': "Безошибочность", 'name': "no-err", 'max': MAX_MARK, 'weight': 3,},
        {'title': "Соответствие интерфейса среде", 'name': "conf", 'max': MAX_MARK, 'weight': 2,},
    ];
    let form_count = 1;

    const btn_add = document.getElementsByClassName("button")[0];
    let competitors_box = document.getElementsByClassName("competitors")[0];

    const btn_calculate = document.getElementsByClassName("btn_calculate")[0];

    btn_add.addEventListener("click", add_competitor);
    btn_calculate.addEventListener("click", calculate_answer);
})