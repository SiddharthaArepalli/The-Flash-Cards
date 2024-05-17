const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get("/",function(req,res){
    fs.readdir(`./files`,function(err,files){
        res.render("index",{files:files});
    })
  });
   

  app.get("/files/:filename", function(req, res) {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            // Handle the error, for example:
            console.error("Error reading file:", err);
            res.status(500).send("Error reading file");
            return;
        }
        // If no error, render the file content
        res.render('show', {filename:req.params.filename,filedata:filedata});
    });
});

app.get('/delete/:filename', function(req, res) {
    const filename = req.params.filename;
    const filePath = `./files/${filename}`;

    // Delete the file
    fs.unlink(filePath, function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Error occurred while deleting the file.');
            return;
        }
        
        // If deletion is successful, redirect the user back to the root URL
        res.redirect('/');
    });
});



app.get('/edit/:filename',function(req,res){
    res.render('edit',{filename: req.params.filename});
})
app.post('/edit',function(req,res){
   fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`,function(err){
   res.redirect("/")
   })
})

  
 app.post("/create",function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details,function(err){
         res.redirect('/');
    }) 
  });
 app.listen(3000);
   