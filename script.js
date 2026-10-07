let inputbox = document.getElementById("inputbox");
let buttons = document.querySelectorAll(".calculator button");

let historyList = document.getElementById("historyList");
let clearHistoryBtn = document.getElementById("clearHistory");

let themeBtn = document.getElementById("themeBtn");

let string = "";


// ================= HISTORY =================

let history = JSON.parse(
    localStorage.getItem("calculatorHistory")
) || [];


// ================= DISPLAY HISTORY =================

function displayHistory(){

    historyList.innerHTML = "";

    if(history.length === 0){

        historyList.innerHTML = `
            <p class="empty-history">
                No calculations yet
            </p>
        `;

        return;
    }


    history.slice().reverse().forEach((item) => {

        let historyItem = document.createElement("div");

        historyItem.classList.add("history-item");

        historyItem.innerHTML = `
            <div class="expression">
                ${item.expression}
            </div>

            <div class="result">
                = ${item.result}
            </div>
        `;


        // Click history to use result again

        historyItem.addEventListener("click", () => {

            string = String(item.result);

            inputbox.value = string;

        });


        historyList.appendChild(historyItem);

    });

}


// ================= SAVE HISTORY =================

function saveHistory(expression, result){

    history.push({

        expression: expression,

        result: result

    });


    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );


    displayHistory();

}


// ================= CALCULATOR BUTTONS =================

buttons.forEach(button => {

    button.addEventListener("click", (e) => {

        let value = e.target.innerHTML;


        // ================= EQUAL =================

        if(value === "="){

            if(string === ""){
                return;
            }


            try{

                let expression = string;

                let result = eval(string);


                if(!isFinite(result)){

                    throw new Error("Invalid calculation");

                }


                saveHistory(
                    expression,
                    result
                );


                string = String(result);

                inputbox.value = string;

            }

            catch(error){

                inputbox.value = "Error";

                string = "";

            }

        }


        // ================= ALL CLEAR =================

        else if(value === "AC"){

            string = "";

            inputbox.value = "";

        }


        // ================= DELETE =================

        else if(value === "DEL"){

            string = string.substring(
                0,
                string.length - 1
            );

            inputbox.value = string;

        }


        // ================= PERCENTAGE =================

        else if(value === "%"){

            if(string !== ""){

                string = String(
                    Number(string) / 100
                );

                inputbox.value = string;

            }

        }


        // ================= PLUS / MINUS =================

        else if(value === "+/-"){

            let numbers = string.split(
                /([+\-*/])/
            );

            let last = numbers.length - 1;


            if(numbers[last] !== ""){

                numbers[last] =
                    String(
                        Number(numbers[last]) * -1
                    );


                string = numbers.join("");

                inputbox.value = string;

            }

        }


        // ================= NUMBERS & OPERATORS =================

        else{

            string += value;

            inputbox.value = string;

        }

    });

});


// ================= CLEAR HISTORY =================

clearHistoryBtn.addEventListener(
    "click",
    () => {

        history = [];

        localStorage.removeItem(
            "calculatorHistory"
        );

        displayHistory();

    }
);


// ================= THEME =================

let savedTheme =
    localStorage.getItem("calculatorTheme");


if(savedTheme === "light"){

    document.body.classList.add("light");

    themeBtn.innerHTML = "☀️";

}


themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("light");


        if(document.body.classList.contains("light")){

            themeBtn.innerHTML = "☀️";

            localStorage.setItem(
                "calculatorTheme",
                "light"
            );

        }

        else{

            themeBtn.innerHTML = "🌙";

            localStorage.setItem(
                "calculatorTheme",
                "dark"
            );

        }

    }
);


// ================= KEYBOARD SUPPORT =================

document.addEventListener(
    "keydown",
    (e) => {

        let key = e.key;


        // Numbers

        if(
            (key >= "0" && key <= "9") ||
            key === "." ||
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ){

            string += key;

            inputbox.value = string;

        }


        // Enter = Calculate

        else if(key === "Enter"){

            document
                .querySelector(".equalbtn")
                .click();

        }


        // Backspace = Delete

        else if(key === "Backspace"){

            document
                .querySelector(".calculator .operator:nth-child(2)")
                .click();

        }


        // Escape = Clear

        else if(key === "Escape"){

            document
                .querySelector(".calculator .operator")
                .click();

        }


        // Percentage

        else if(key === "%"){

            string = String(
                Number(string) / 100
            );

            inputbox.value = string;

        }

    }
);


// ================= INITIAL LOAD =================

displayHistory();
