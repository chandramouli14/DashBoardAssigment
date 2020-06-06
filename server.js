// const express = require('express');
// const favicon = require('express-favicon');
// const path = require('path');
// const port = process.env.PORT || 8080;
// const app = express();
// // app.use(favicon(__dirname + '/public/favicon.png'));
// // the __dirname is the current directory from where the script is running
// app.use(express.static(__dirname));
// // send the user to index html page inspite of the url
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'index.html'));
// });
// // app.get("/addBook",(req,res)=>{
// //     res.sendFile(path,resolve(__dirname,"addBook.html"))
// // })
// app.listen(port);
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
 
server.use(middlewares)
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})
server.get('/index',(req,res)=>{
  res.sendFile(__dirname,'index.html')
})