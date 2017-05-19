let fs=require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let path=require('path');
const app=express();
app.listen(8090)
function readProducts(callback){
    fs.readFile('./product.json','utf-8',function (err,data){
        if(err||data.length==0){
            callback([])
        }else{
            callback(JSON.parse(data))
        }
    })
}
function writeProducts(data,callback) {
    fs.writeFile('./product.json',JSON.stringify(data),callback);
}
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(function (req,res,next){
    req.path1=require('url').parse(req.url,true).pathname;
    next();
})
app.get('/',function (req,res){
    res.sendFile(path.resolve('./index.html'))
})
app.get('/book',function (req,res){
    readProducts(function (data){
        res.send(data);
    })
})
app.get('/book/:id',function (req,res){
    let id=req.params.id
        readProducts(function (data){
            var book=data.find(function (item){
                return item.id==id;
            })
            res.send(book);
        })
})
app.put('/book/:id',function (req,res){
    let id=req.params.id;
        readProducts(function (data) {
            data = data.map(function (item) {
                if (item.id == id) {
                    return req.body;
                }
                return item;
            })
            writeProducts(data, function () {
                res.send(req.body);
            })
        })
})
app.post('/book',function (req, res) {
    let book=req.body;
    readProducts(function (data) {
        book.id=data.length==0?1:data[data.length-1].id+1;
        data.push(book);
        writeProducts(data,function (){
            res.send(book);
        })
    })
})
app.delete('/book/:id',function (req,res){
    let id=req.params.id;
        readProducts(function (data){
            data=data.filter(function (item){
                return item.id!=id;
            })
            writeProducts(data,function (){
                res.send({});
            })
        })
})
/*app.all('*',function (req,res){
    res.sendFile(__dirname);
})*/
/*
http.createServer(function (req,res){
    var {pathname,query}=url.parse(req.url,true);
    console.log(pathname)
    if(pathname=='/'){
        res.setHeader('Content-Type','text/html;charset=utf-8;');
        fs.createReadStream('./index.html').pipe(res);
    }
    else if(/^\/book(\/\d+)?$/.test(pathname)){
        var id=/^\/book(?:\/(\d+))?$/.exec(pathname)[1];
        switch (req.method){
            case 'GET':
                if(id){
                    console.log(req.body)
                    readProducts(function (data){
                        var book=data.find(function (item){
                            return item.id==id;
                        })
                        res.end(JSON.stringify(book));
                    })
                }else{
                   readProducts(function (data){
                       res.end(JSON.stringify(data));
                   })
                }
                break;
            case 'PUT':
                if(id) {
                    var str = '';
                    req.on('data', function (data) {
                        str += data;
                    })
                    req.on('end', function () {
                        var book = JSON.parse(str);
                        readProducts(function (data) {
                           data= data.map(function (item) {
                                if (item.id == id) {
                                    return book
                                }
                                return item;
                            })
                            writeProducts(data,function (){
                                res.end(JSON.stringify(book));
                            })
                        })
                    })
                }
                break;
            case 'DELETE':
                if(id){
                    readProducts(function (data){
                        data=data.filter(function (item){
                            return item.id!=id;
                        })
                        writeProducts(data,function (){
                            res.end(JSON.stringify({}));
                        })
                    })
                }
                break;
            case 'POST':
                var str = '';
                req.on('data', function (data) {
                    str += data;
                })
                req.on('end', function () {
                    var book = JSON.parse(str);
                    readProducts(function (data) {
                        book.id=data.length==0?1:data[data.length-1].id+1;
                        data.push(book);
                        writeProducts(data,function (){
                            res.end(JSON.stringify(book));
                        })
                    })
                })
                break;
        }
    }else {
        fs.exists('.'+pathname,function (flag){
            if(flag){
                res.setHeader('Content-Type',mime.lookup(pathname)+';charset=utf-8;')
                fs.createReadStream('.'+pathname).pipe(res);
            }
            else {
                res.status=404;
                res.end('not found')
            }
        })
    }

}).listen(8010)*/
