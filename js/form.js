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
        input_name.name = "name";
        input_name.placeholder = "Название конкурента";
        let button_delete = document.createElement("div");
        button_delete.className = "button-delete";
        // let button_delete_content = document.createElement("div");
        // button_delete_content.className = "__content";

        button_delete.addEventListener("click", () => {
            delete_competitor(new_comp);
        });
        
        let input_1 = input_param("Эффективность", "input1", "100");
        let input_2 = input_param("Результативность", "input2", "100");
        let input_3 = input_param("Продуктивность", "input3", "100");
        let input_4 = input_param("Удовлетворенность", "input4", "100");
        let input_5 = input_param("Утомляемость", "input5", "100");
        let input_6 = input_param("Безошибочность", "input6", "100");
        let input_7 = input_param("Соответствие интерфейса среде", "input7", "100");

        let inputs_box = document.createElement("div");
        inputs_box.className = "inputs-box";        

        head.append(input_name);
        // button_delete.append(button_delete_content);
        head.append(button_delete);
        form.append(head);
        inputs_box.append(input_1);
        inputs_box.append(input_2);
        inputs_box.append(input_3);
        inputs_box.append(input_4);
        inputs_box.append(input_5);
        inputs_box.append(input_6);
        inputs_box.append(input_7);
        form.append(inputs_box);
        new_comp.append(form);
        competitors_box.append(new_comp);

        update_button_calculate()
    }

    function calculate_answer() {
        let answer_table = document.getElementsByClassName("answer-table")[0];
        answer_table.classList.toggle("hidden");
        let forms = document.forms;
        for (let i = 0; i < forms.length; i++) {
            let labels = forms[i].getElementsByClassName("inputs-box")[0].children;
            for (let j = 0; j < labels.length; j++) {
                let input = labels[j].getElementsByTagName("input")[0];
                console.log(input.value);
            }
        }
    }

    let form_count = 0;

    const btn_add = document.getElementsByClassName("button")[0];
    let competitors_box = document.getElementsByClassName("competitors")[0];

    const btn_calculate = document.getElementsByClassName("btn_calculate")[0];

    btn_add.addEventListener("click", add_competitor);
    btn_calculate.addEventListener("click", calculate_answer);
})