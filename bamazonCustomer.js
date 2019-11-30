var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Iam50now?!",
    database: "bamazon"
});




function displayItems() {
    connection.query("SELECT * FROM products", function (err, results) {

        if (err) throw err;



        for (var i = 0; i < results.length; i++) {
            console.log(results[i].item_id + " | " + results[i].product_name + " | $" + results[i].price.toFixed(2));
        }


        inquirer
            .prompt([
                {
                    name: "item_id",
                    type: "input",
                    message: "Which item would like to buy (Enter item number): ",
                    validate: function (value) {
                        if (isNaN(value) === false && value > 0 && value < results.length + 1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                {
                    name: "numberWanted",
                    type: "input",
                    message: "How many would you like to purchase?",
                    validate: function (value) {
                        if (isNaN(value) === false && value > 0) {
                            return true;
                        } else {
                            return false;
                        };
                    }
                }
            ]).then(function (answers) {
                var item_id = answers.item_id;
                var numberWanted = answers.numberWanted;
                if (numberWanted > results[item_id - 1].stock_quantity) {
                    console.log("Their Ain't Enough");

                    inquirer
                        .prompt([
                            {
                                name: "confirm",
                                type: "confirm",
                                message: "Would you like to chose another item?"

                            }
                        ]).then(function (answers) {
                            if (answers.confirm) {
                                displayItems();
                            }
                        });
                } else {

                    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? where item_id =?",
                        [
                            numberWanted
                            ,
                            item_id
                        ], function (err, results) { });
                    console.log("Your total for this item is: $" + (results[item_id - 1].price * answers.numberWanted))

                }
            });
    })
};

displayItems();
