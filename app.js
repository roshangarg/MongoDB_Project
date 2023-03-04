const express = require('express')
const { ObjectId } = require('mongodb')
const {connectToDb , getDb } = require('./db')

// initializing express app SS
const app = express()
app.use(express.json())
// connect to Db 
let db 
connectToDb((err) => {
    if(!err) {
        app.listen(3000,'localhost', () => {
            console.log("listenig to port number 3000 ");
        
        })
        db = getDb()
        
        }

})


// listen to port Number




// routes

app.get('/books' , (req , res ) => {
    let books = []
    const page = req.query.p || 0 
    const pageperPage  = 3 

    db.collection('Books')
    .find()
    .sort({auther: 1})
    .skip(page * pageperPage)
    .limit(pageperPage)
    .forEach(book => books.push(book))
    .then(() => {
        res.status(200).json(books)
    }).catch((err) => {
        res.status(500).json({error:'could not fetch result '})
    });
})


app.get("/books/:id", (req , res ) => {
    if(ObjectId.isValid(req.params.id)){
    db.collection("Books")
    .findOne({_id: new ObjectId(req.params.id)})
    .then((doc) => {
        res.status(200).json(doc)
    })
    .catch((err) => {
        res.status(500).json({error : "Could not fetch the documents "})
    })
    }
    else{
        res.status(500).json({error:'can not fetch '})
    }
    
} )


app.post('/books', (req,res) => {
    const book = req.body
    db.collection('Books')
    .insertOne(book)
    .then((result) => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({err : "could not insert Body "})
    })
})


// Delete Method 


app.delete('/books/:id' , (req , res ) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('Books')
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({error: "Could Not delete the documents "})
    })
    }
    else{
        res.status(500).json({error: "Document not found with this id "})
    }
})


// Patch request to update the documents


app.patch('/books/:id' , (req , res ) => {
    if(ObjectId.isValid(req.params.id)) {
        const update = req.body
        db.collection("Books")
        .updateOne({_id: new ObjectId(req.params.id)} , {$set: update })
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).json({error : "Can not update the document "})
        })
    }
    else{
        res.status(500).json({error : "unable to update the document"})
    }
})