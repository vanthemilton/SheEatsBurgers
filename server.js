
// 		Requirements
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var fs = require('fs');

// 		Establish express and port
var app = express();
var port = process.env.PORT || 3000;