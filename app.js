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
const dotenv = require("dotenv");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();

const connection = mysql.createConnection({
  user: "root",
  password: "12345678",
  database: "tickets",
});

app.get("/", (req, res) => {
  console.log("Req", req.body);
  connection.query("SELECT * FROM tickets", (error, results, fields) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      console.log("Results", results);
      res.status(200).json({ results });
    }
  });
});

app.post("/booking", (req, res) => {
  console.log("Req Here", req.body);
  const {
    flightType,
    homeLocation,
    destination,
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
            destination VARCHAR(255),
            flightType VARCHAR(255),
            departureDate VARCHAR(255),
            passengerCount VARCHAR(3),
            currency VARCHAR(10)
            );`,
        function (error, result) {
          if (error) console.log("Error Creating Table", error);
          else {
            console.log("created table");
            connection.query(
              "INSERT INTO tickets VALUES (?,?,?,?,?,?,?,?,?)",
              [
                email,
                phoneNumber,
                countryCode,
                homeLocation,
                destination,
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
  console.log("Example app listening on port 8080!");
});
