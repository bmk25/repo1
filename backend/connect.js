 const express = require('express') 

const  mysql2 = require('mysql2') 




exports.db = mysql2.createConnection({

    host: "localhost",
    user:"root",
    password:"sanam",
    database: "new_table"

})
