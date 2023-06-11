/*
 * Copyright (c) 2012-2019 Red Hat, Inc.
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */

/*eslint-env node*/

var express = require("express");
var app = express();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((error) => {
  if (error) console.log(error);
  {
    console.log("Connected Hello");
  }
});

connection.query("SELECT * FROM tickets", function (error, result, fields) {
  console.log(error);
});

app.get("/", (req, res) => {
  connection.query("SELECT * FROM tickets", (error, results, fields) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      console.log("Results", results);
      res.status(200);
    }
  });
});

app.post("/booking", (req, res) => {
  const {
    flightType,
    homeLocation,
    departureDate,
    passCount,
    currency,
    phoneNumber,
    email,
    countryCode,
  } = req.body;
  connection.connect((error) => {
    if (error) throw error;
    else {
      console.log("DBMS Connected");
      connection.query(
        `CREATE TABLE IF NOT EXISTS tickets(
            email VARCHAR(255),
            phoneNumber VARCHAR(10),
            countryCode VARCHAR(3),
            homeLocation VARCHAR(255),
            flightType VARCHAR(255),
            departureDate VARCHAR(255),
            passengerCount INT,
            currency VARCHAR(10),
          )`,
        function (error, result) {
          if (error) console.log("Error Creating Table", error);
          else {
            console.log("created table");
            connection.query(
              "INSERT INTO VALUES (?,?,?,?,?,?,?,?)",
              [
                email,
                phoneNumber,
                countryCode,
                homeLocation,
                flightType,
                departureDate,
                passCount,
                currency,
              ],
              (error, result) => {
                if (error) {
                  console.log("Error Occured", error);
                } else {
                  console.log("Data Has Been inserted succesfully", result);
                }
              }
            );
          }
        }
      );
    }
  });
});

app.listen(8080, function () {
  console.log("Example app listening on port 3000!");
});
