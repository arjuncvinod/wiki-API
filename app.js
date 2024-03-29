const express=require("express")
const mongoose=require("mongoose")
const ejs=require("ejs")
const bodyParser = require("body-parser")
 const app=express()

 app.set("view-engine","ejs")

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1/wikiDB",{useNewUrlParser:true})

const ArticleSchema={
    title:String,
    content:String
}
const Article = mongoose.model("Article",ArticleSchema)

app.route("/articles")
    .get(async(req,res)=>{
        const articles=await Article.find({})
        res.send(articles)
    })
    .post((req,res)=>{
        const newAricle= Article({
            title:req.body.title,
            content:req.body.content
        })
        newAricle.save().then(res.send("successfully added"))

    })
    .delete((req,res)=>{
        Article.deleteMany().then( res.send("Deleted Everything"))
    })

    app.route("/articles/:articlename")
    .get(async(req,res)=>{
        const results=await Article.findOne({title:req.params.articlename})
        if(results){
        res.send(results)
        }else{
            res.send("Not found")
        } 
    
    })
    .put((req,res)=>{
        Article.findOneAndUpdate(
            {title:req.params.articlename},
            {title:req.body.title,content:req.body.content}
            ).then( res.send("updated"))
       
    })
    .delete((req,res)=>{
        Article.deleteOne({title:req.params.articlename}).then(res.send("deleted"))
    })
    .patch((req,res)=>{
        Article.findOneAndUpdate({title:req.params.title},{$set:req.body}).then(res.send("updated"))
    })







app.listen(3000,()=>{
    console.log("server started");
})
//h