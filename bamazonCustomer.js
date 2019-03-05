var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require('console.table');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    port: 3306,
    password: "password",
    database: "bamazon"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    startBamazon();
  });

  function startBamazon(){
      con.query('SELECT * FROM products', function(err, result){
       
        console.table(result);
        inquirer
        .prompt([
            {
                type: 'input',
                message: "Choose the id of the item you would like to purchase?",
                name: 'id'
            },
            {
                type: 'input',
                message: 'how many?',
                name: 'quantity'
            }
        ]).then(function(answer){
           
            con.query('SELECT * FROM products WHERE item_id = ' + answer.id, function(err, result){
                console.log(err)
                
                if(result[0].stock_quantity > parseInt(answer.quantity)){
                  
                    var newQuantity = parseInt(result[0].stock_quantity) - parseInt(answer.quantity);
                    con.query("UPDATE products SET stock_quantity = " + newQuantity +" WHERE item_id = " + answer.id, function(err, res){
                        console.log("Order Successful");
                        startBamazon()
                    })
                }else {
                    console.log("insufficient quantity")
                }
            })
        })
      });
  }