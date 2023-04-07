let data = [];
var check = false;

(function () {
    data = localStorage.getItem('todo-list');

    if (data != "" && data != null) {
        data = data.split(",")
        if (data.length == 0) {
            data = [];
        }
        else {
            data.forEach((element, index) => {
                let div = document.createElement("div");
                if(index % 2 == 0) div.classList.add("fromLeft");
                else div.classList.add("fromRight");
                div.setAttribute("class", "todo active");
                div.innerHTML = document.getElementById("blockOfStuff").innerHTML;

                div.innerHTML = div.innerHTML.replace(/{content}/g, element);

                document.getElementById("todos").appendChild(div);
            })
        }
    }
    else {
        data = [];
    }
}());

let input = document.getElementById("input-todo");
input.addEventListener("keypress", function (event) {
    if (event.key == "Enter") {
        if (input.value.length != 0) {
            let div = document.createElement("div");
            div.setAttribute("class", "todo");
            div.innerHTML = document.getElementById("blockOfStuff").innerHTML;

            div.innerHTML = div.innerHTML.replace(/{content}/g, input.value);
            data.push(input.value)

            document.getElementById("todos").appendChild(div);
            console.log(div.offsetWidth)
            if((data.length - 1) % 2 == 0) div.classList.add("fromLeft");
                else div.classList.add("fromRight");

            div.className += " active"

            input.value = "";
            console.log(data)
        }
    }
});

const deleteItem = (el) => {
    while (el.nodeName != 'P' && el != null) {
        el = el.previousElementSibling;
    }

    data = data.filter((item) => item != el.innerHTML);
    let todos = document.getElementsByClassName("todo");
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].firstElementChild.innerHTML === el.innerHTML) {
            document.getElementById("todos").removeChild(todos[i]);
        }
    }
}

const checkOrUncheck = (el) => {
    let prev = el.previousElementSibling;
    let line = el.previousElementSibling;
    let edit = 
    document.querySelector(".fa-pen-to-square");

    while (line.nodeName != 'DIV' && line != null) {
        line = line.previousElementSibling;
    }

    let px = 0;
    check = !check;

    while (prev.nodeName != 'P' && prev != null) {
        prev = prev.previousElementSibling;
    }

    if (check) {
        edit.removeAttribute("onclick");
        el.className = "fa-solid fa-backward";
        line.style.border = "1px solid black";
        let interval = setInterval(() => {
            px += 5;

            if (line.style.width != "") {
                if (px > (prev.offsetWidth)) {
                    clearInterval(interval);
                    prev.style.color = '#d6d8da';
                }
            }
            line.style.width = `${px}px`;
        }, 30)
    }
    else {
        el.className = "fa-regular fa-circle-check";
        px = parseInt(line.style.width, 10);
        let interval = setInterval(() => {
            px -= 5;

            if (line.style.width != "") {
                if (px == 0) {
                    clearInterval(interval);
                    prev.style.color = 'black';
                    line.style.border = "none";
                    edit.setAttribute("onclick", "modifyItem(this)");
                }
            }
            line.style.width = `${px}px`;
        }, 30)
    }
}

const modifyItem = (el) => {
    let check = document.querySelector(".fa-circle-check");
    check.removeAttribute("onclick");
    let prev = el.previousElementSibling;
    while (prev.nodeName != 'INPUT' && prev != null) {
        prev = prev.previousElementSibling;
    }

    let input = prev;

    input.hidden = false;
    input.focus();

    while (prev.nodeName != 'P' && prev != null) {
        prev = prev.previousElementSibling;
    }

    prev.style.display = 'none';
    el.style.display = 'none';

    input.addEventListener("keypress", function (event) {
        if (event.key == "Enter") {
            if (input.value != "") {
                let index = data.indexOf(prev.innerHTML);
                data[index] = input.value;
                prev.innerHTML = input.value;
            }

            input.hidden = true;
            prev.style.display = 'inline-block';
            el.style.display = 'var(--fa-display,inline-block)';

            check.setAttribute("onclick", "checkOrUncheck(this)");
        }
    })
}

window.onbeforeunload = (event) => {
    localStorage.setItem("todo-list", data);
};

window.addEventListener("scroll", reveal);
function reveal() {

    var todos = document.querySelectorAll('.todo');
    for(var i = 0; i < todos.length; i++) {
        var windowHeight = window.innerHeight;
        var revealTop = todos[i].getBoundingClientRect().top;
        var revealPoint = todos[i].offsetHeight;

        if(revealTop < windowHeight - revealPoint) todos[i].classList.add("active");
        else todos[i].classList.remove("active");
    }
}