/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;


// function middleware1(req, res, next) {
//   if(req.params.file){
//     next();
//   }
//   res.status(404).send("Route not found");
// }

function getFilesList(req, res) {
  const fullPath = path.join(__dirname, "files");
  // console.log(fullPath);
  fs.readdir(fullPath, (err, files) =>  {
    if(err) {
      console.log(err.message);
      res.status(err.status).send({
        error: {
          message: err.message
        }
      });
    } else {
      // console.log(files);
      res.json(files);
    }
  });
  
}

app.get('/files', getFilesList);



function getFile(req, res) {
  var fileName = req.params.filename;
  var filePath = path.join(__dirname, './files/', fileName);
  // console.log(filePath)
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if(err) return res.status(404).send("File not found");
    else {
      const fileExtention = path.extname(filePath);
      console.log(fileExtention);
      if(fileExtention==='.html') return res.sendFile(filePath);
      else res.send(data);
    }
  });
}


app.get('/file/:filename', getFile);

app.all('*', (req, res)=> {
  res.status(404).send("Route not found");
})

//By placing the middleware at the end, it acts as a fallback handler for undefined routes
// app.use(middleware1);


function started() {
  console.log(`Listening on ${port}`);
}
app.listen(port, started);

module.exports = app;
